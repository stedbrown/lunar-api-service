require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const lunarRoutes = require('./routes/lunar');
const { initializeLunarData } = require('./utils/dataManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware di sicurezza
// Helmet per impostare headers di sicurezza
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabilito completamente la CSP per risolvere i problemi
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' }
  })
);

// Disabilita ETag e Last-Modified
app.set('etag', false);
app.set('lastModified', false);

// Middleware per aggiungere headers di cache-control a tutte le risposte
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  res.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  res.set('X-Timestamp', Date.now().toString());
  next();
});

// Rate limiting - limita le richieste a 100 per 15 minuti per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // limite di 100 richieste per finestra
  standardHeaders: true, // Restituisce info sul rate limit negli headers `RateLimit-*`
  legacyHeaders: false, // Disabilita gli headers `X-RateLimit-*`
  message: {
    status: 'error',
    message: 'Troppe richieste, riprova più tardi',
    limit: '100 richieste ogni 15 minuti'
  }
});

// Middleware standard
app.use(cors({
  origin: '*', // Consenti richieste da qualsiasi origine
  methods: ['GET'], // Consenti solo richieste GET
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' })); // Limita la dimensione del body a 10kb

// Logging delle richieste
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms ${req.ip}`
    );
  });
  next();
});

// Servi i file statici dalla cartella public
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  lastModified: false,
  maxAge: 0,
  setHeaders: function (res, path) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    res.set('Clear-Site-Data', '"cache", "cookies", "storage"');
    res.set('X-Timestamp', Date.now().toString());
  }
}));

// Rimuovo il riferimento alla cartella locales che non esiste più
// app.use('/locales', express.static(path.join(__dirname, 'public', 'locales'), {
//   etag: false,
//   lastModified: false,
//   maxAge: 0
// }));

// Inizializza i dati lunari all'avvio del server
initializeLunarData();

// Applica rate limiting alle rotte API
app.use('/api/', apiLimiter);

// Rotte API
app.use('/api/lunar', lunarRoutes);

// Rotta di base per la documentazione HTML
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  res.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  res.set('X-Timestamp', Date.now().toString());
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Documentazione JSON per compatibilità con le versioni precedenti
app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: {
      '/api/lunar/phase': 'Get current moon phase',
      '/api/lunar/phase/:date': 'Get moon phase for specific date (YYYY-MM-DD)',
      '/api/lunar/info': 'Get detailed lunar information'
    }
  });
});

// Gestione 404 - rotte non trovate
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint non trovato'
  });
});

// Gestione errori
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Si è verificato un errore interno',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Avvio del server solo se non è in ambiente di produzione (Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Lunar API Service running on port ${PORT}`);
  });
}

// Esporta l'app per Vercel
module.exports = app; 