const schedule = require('node-schedule');
const fs = require('fs').promises;
const path = require('path');
const { getLunarData } = require('./lunarCalculations');

// Percorso del file di cache
const CACHE_FILE = path.join(__dirname, '../data/lunarCache.json');

// Intervallo di aggiornamento dei dati (default: 6 ore)
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL) || 21600000;

// Cache in memoria
let lunarCache = null;
let lastUpdateTime = 0;

/**
 * Inizializza i dati lunari all'avvio del server
 * In ambiente serverless, calcola i dati al volo quando necessario
 */
async function initializeLunarData() {
  try {
    // In ambiente di produzione (Vercel), non utilizziamo la cache su file
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode, using in-memory cache only');
      // Inizializza i dati in memoria
      lunarCache = {
        data: getLunarData(),
        timestamp: new Date().toISOString()
      };
      lastUpdateTime = Date.now();
      return;
    }
    
    // In ambiente di sviluppo, utilizziamo la cache su file
    // Assicurati che la directory data esista
    await ensureDataDirectory();
    
    // Prova a caricare i dati dalla cache
    try {
      const cacheData = await fs.readFile(CACHE_FILE, 'utf8');
      lunarCache = JSON.parse(cacheData);
      
      // Verifica se i dati in cache sono ancora validi
      const cacheAge = Date.now() - new Date(lunarCache.timestamp).getTime();
      if (cacheAge > UPDATE_INTERVAL) {
        // Cache troppo vecchia, aggiorna i dati
        await updateLunarData();
      } else {
        console.log('Lunar data loaded from cache');
        lastUpdateTime = new Date(lunarCache.timestamp).getTime();
      }
    } catch (error) {
      // Se il file non esiste o c'è un errore, calcola nuovi dati
      console.log('Cache not found or invalid, calculating new lunar data');
      await updateLunarData();
    }
    
    // Pianifica aggiornamenti periodici solo in ambiente di sviluppo
    scheduleUpdates();
    
  } catch (error) {
    console.error('Error initializing lunar data:', error);
    // In caso di errore, calcola comunque i dati in memoria
    lunarCache = {
      data: getLunarData(),
      timestamp: new Date().toISOString()
    };
    lastUpdateTime = Date.now();
  }
}

/**
 * Aggiorna i dati lunari e li salva nella cache
 */
async function updateLunarData() {
  try {
    // Calcola nuovi dati lunari
    const freshData = getLunarData();
    
    // Aggiorna la cache in memoria
    lunarCache = {
      data: freshData,
      timestamp: new Date().toISOString()
    };
    lastUpdateTime = Date.now();
    
    // Salva i dati nella cache su file solo in ambiente di sviluppo
    if (process.env.NODE_ENV !== 'production') {
      await fs.writeFile(CACHE_FILE, JSON.stringify(lunarCache, null, 2), 'utf8');
      console.log('Lunar data updated and cached at', lunarCache.timestamp);
    }
    
    return freshData;
  } catch (error) {
    console.error('Error updating lunar data:', error);
    throw error;
  }
}

/**
 * Pianifica aggiornamenti periodici dei dati lunari
 * Solo per ambiente di sviluppo
 */
function scheduleUpdates() {
  if (process.env.NODE_ENV !== 'production') {
    // Aggiorna i dati ogni UPDATE_INTERVAL millisecondi
    setInterval(async () => {
      try {
        await updateLunarData();
      } catch (error) {
        console.error('Scheduled update failed:', error);
      }
    }, UPDATE_INTERVAL);
    
    console.log(`Lunar data updates scheduled every ${UPDATE_INTERVAL / (60 * 1000)} minutes`);
  }
}

/**
 * Assicura che la directory data esista
 */
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.access(dataDir);
  } catch (error) {
    // La directory non esiste, creala
    await fs.mkdir(dataDir, { recursive: true });
    console.log('Created data directory');
  }
}

/**
 * Ottiene i dati lunari dalla cache o li calcola se necessario
 * In ambiente serverless, ricalcola i dati se la cache è troppo vecchia
 */
function getCachedLunarData() {
  const now = Date.now();
  
  // Se siamo in produzione e la cache è troppo vecchia o non esiste, ricalcola
  if (process.env.NODE_ENV === 'production' && 
      (!lunarCache || now - lastUpdateTime > UPDATE_INTERVAL)) {
    console.log('Recalculating lunar data for serverless environment');
    lunarCache = {
      data: getLunarData(),
      timestamp: new Date().toISOString()
    };
    lastUpdateTime = now;
  } else if (!lunarCache) {
    // Se la cache non è ancora inizializzata, calcola i dati al volo
    const freshData = getLunarData();
    return freshData;
  }
  
  return lunarCache.data;
}

module.exports = {
  initializeLunarData,
  updateLunarData,
  getCachedLunarData
}; 