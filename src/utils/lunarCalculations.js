/**
 * Modulo per il calcolo delle fasi lunari
 * Implementa algoritmi astronomici per calcolare con precisione le fasi lunari
 */

// Costanti astronomiche
const LUNAR_CYCLE = 29.53058867; // Durata media di un ciclo lunare in giorni
const LUNAR_CYCLE_MS = LUNAR_CYCLE * 24 * 60 * 60 * 1000; // Durata in millisecondi
const NEW_MOON_REFERENCE = new Date('2000-01-06T18:14:00.000Z').getTime(); // Una data di riferimento di luna nuova

/**
 * Calcola la fase lunare per una data specifica
 * @param {Date} date - La data per cui calcolare la fase lunare
 * @returns {Object} - Informazioni sulla fase lunare
 */
function getLunarPhaseForDate(date = new Date()) {
  // Calcola il numero di millisecondi dalla luna nuova di riferimento
  const timestamp = date.getTime();
  const daysSinceReference = (timestamp - NEW_MOON_REFERENCE) / (24 * 60 * 60 * 1000);
  
  // Calcola l'età della luna nel ciclo corrente (da 0 a 29.53 giorni)
  const lunarAge = daysSinceReference % LUNAR_CYCLE;
  
  // Calcola la percentuale del ciclo lunare completata (da 0 a 1)
  const lunarCyclePercentage = lunarAge / LUNAR_CYCLE;
  
  // Calcola l'illuminazione (da 0 a 1, dove 0 = nuova, 0.5 = quarto, 1 = piena)
  let illumination;
  if (lunarCyclePercentage <= 0.5) {
    // Da nuova a piena: illuminazione cresce da 0 a 1
    illumination = lunarCyclePercentage * 2;
  } else {
    // Da piena a nuova: illuminazione decresce da 1 a 0
    illumination = (1 - lunarCyclePercentage) * 2;
  }
  
  // Determina la fase lunare in base alla percentuale del ciclo
  const phase = determineLunarPhase(lunarCyclePercentage);
  
  // Calcola le date della prossima luna piena e luna nuova
  const nextFullMoon = calculateNextPhaseDate(timestamp, 0.5);
  const nextNewMoon = calculateNextPhaseDate(timestamp, 0);
  
  // Calcola la distanza approssimativa della Luna dalla Terra (in km)
  // Questo è un calcolo semplificato che tiene conto dell'orbita ellittica
  const distance = calculateLunarDistance(lunarCyclePercentage);
  
  return {
    phase,
    illumination: parseFloat(illumination.toFixed(4)),
    age: parseFloat(lunarAge.toFixed(2)),
    cyclePercentage: parseFloat(lunarCyclePercentage.toFixed(4)),
    nextFullMoon: nextFullMoon.toISOString(),
    nextNewMoon: nextNewMoon.toISOString(),
    distance
  };
}

/**
 * Determina la fase lunare in base alla percentuale del ciclo
 * @param {number} cyclePercentage - Percentuale del ciclo lunare (0-1)
 * @returns {string} - Nome della fase lunare
 */
function determineLunarPhase(cyclePercentage) {
  if (cyclePercentage < 0.025 || cyclePercentage >= 0.975) {
    return 'New Moon';
  } else if (cyclePercentage < 0.24) {
    return 'Waxing Crescent';
  } else if (cyclePercentage < 0.26) {
    return 'First Quarter';
  } else if (cyclePercentage < 0.49) {
    return 'Waxing Gibbous';
  } else if (cyclePercentage < 0.51) {
    return 'Full Moon';
  } else if (cyclePercentage < 0.74) {
    return 'Waning Gibbous';
  } else if (cyclePercentage < 0.76) {
    return 'Last Quarter';
  } else {
    return 'Waning Crescent';
  }
}

/**
 * Calcola la data della prossima fase lunare specifica
 * @param {number} currentTimestamp - Timestamp corrente
 * @param {number} targetPhase - Fase target (0 = nuova, 0.5 = piena)
 * @returns {Date} - Data della prossima fase
 */
function calculateNextPhaseDate(currentTimestamp, targetPhase) {
  const daysSinceReference = (currentTimestamp - NEW_MOON_REFERENCE) / (24 * 60 * 60 * 1000);
  const lunarAge = daysSinceReference % LUNAR_CYCLE;
  const lunarCyclePercentage = lunarAge / LUNAR_CYCLE;
  
  let daysToTarget;
  if (lunarCyclePercentage < targetPhase) {
    daysToTarget = (targetPhase - lunarCyclePercentage) * LUNAR_CYCLE;
  } else {
    daysToTarget = (1 - lunarCyclePercentage + targetPhase) * LUNAR_CYCLE;
  }
  
  return new Date(currentTimestamp + daysToTarget * 24 * 60 * 60 * 1000);
}

/**
 * Calcola la distanza approssimativa della Luna dalla Terra
 * @param {number} cyclePercentage - Percentuale del ciclo lunare
 * @returns {number} - Distanza in chilometri
 */
function calculateLunarDistance(cyclePercentage) {
  // Distanza media: 384,400 km
  // Perigeo (più vicino): ~363,300 km
  // Apogeo (più lontano): ~405,500 km
  
  // Calcolo semplificato basato su un'orbita ellittica
  const angle = cyclePercentage * 2 * Math.PI;
  const distance = 384400 + 21100 * Math.sin(angle);
  
  return Math.round(distance);
}

/**
 * Ottiene i dati lunari correnti
 * @returns {Object} - Dati lunari per la data corrente
 */
function getLunarData() {
  return getLunarPhaseForDate(new Date());
}

module.exports = {
  getLunarData,
  getLunarPhaseForDate,
  determineLunarPhase,
  calculateNextPhaseDate,
  calculateLunarDistance
}; 