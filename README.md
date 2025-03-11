# 🌙 Lunar API Service

Un servizio API affidabile e sempre disponibile per ottenere informazioni sulle fasi lunari.

[![Vercel](https://img.shields.io/badge/Powered%20by-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![API Status](https://img.shields.io/badge/API-Online-success?style=for-the-badge)](https://lunar-api-service.vercel.app/)
[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-blue?style=for-the-badge)](https://lunar-api-service.vercel.app/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge)](https://lunar-api-service.vercel.app/)

## 🚀 Demo

L'API è disponibile all'indirizzo: [https://lunar-api-service.vercel.app/](https://lunar-api-service.vercel.app/)

Visita la [documentazione online](https://lunar-api-service.vercel.app/) per provare l'API direttamente dal browser!

## ✨ Caratteristiche

- 🌙 Calcolo preciso delle fasi lunari basato su algoritmi astronomici
- 🔄 Aggiornamenti automatici dei dati
- 💾 Sistema di caching per prestazioni ottimali
- 🔌 API RESTful semplice da integrare
- 📅 Supporto per date passate e future (1900-2100)
- 📊 Informazioni dettagliate (fase, illuminazione, distanza, ecc.)
- 🚀 Disponibilità 24/7 grazie al deployment su Vercel
- 🔒 Misure di sicurezza avanzate
- 🔍 Ottimizzazione SEO completa per massima visibilità
- 📱 Supporto PWA (Progressive Web App) per utilizzo offline

## 🔍 Endpoint API

### Ottieni la fase lunare corrente

```
GET /api/lunar/phase
```

### Ottieni la fase lunare per una data specifica

```
GET /api/lunar/phase/YYYY-MM-DD
```

### Ottieni informazioni lunari dettagliate

```
GET /api/lunar/info
```

## 🛡️ Sicurezza

L'API è stata progettata con la sicurezza come priorità:

- **Rate Limiting**: Limite di 100 richieste per IP ogni 15 minuti
- **Validazione degli Input**: Rigorosa validazione per prevenire attacchi di injection
- **Headers di Sicurezza**: Protezione contro XSS, CSRF e altri attacchi comuni
- **HTTPS**: Comunicazioni crittografate
- **Monitoraggio**: Logging e monitoraggio delle attività

## 🔧 Installazione locale

```bash
# Clona il repository
git clone https://github.com/stedbrown/lunar-api-service.git
cd lunar-api-service

# Installa le dipendenze
npm install

# Configura le variabili d'ambiente
cp .env.example .env

# Avvia il server in modalità sviluppo
npm run dev
```

## 📦 Deployment

Il progetto è configurato per essere facilmente deployato su Vercel:

```bash
# Installa Vercel CLI
npm install -g vercel

# Deploy su Vercel
vercel
```

Per istruzioni dettagliate, consulta il file [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).

## 🔍 Ottimizzazioni SEO

Il sito è completamente ottimizzato per i motori di ricerca:

- **Meta tag completi**: Descrizione, parole chiave, autore e robots
- **Open Graph e Twitter Card**: Per una migliore condivisione sui social media
- **Dati strutturati JSON-LD**: Per una migliore comprensione da parte dei motori di ricerca
- **Sitemap XML**: Per facilitare l'indicizzazione di tutte le pagine
- **Robots.txt**: Per guidare i crawler dei motori di ricerca
- **Link canonici**: Per evitare problemi di contenuti duplicati
- **Preconnect e Preload**: Per migliorare le prestazioni di caricamento

## 📱 Progressive Web App (PWA)

L'applicazione supporta le funzionalità PWA:

- **Manifest.json**: Per l'installazione come app
- **Service Worker**: Per il funzionamento offline
- **Caching delle risorse**: Per un caricamento rapido anche con connessione lenta
- **Responsive Design**: Ottimizzato per tutti i dispositivi

## 📝 Licenza

MIT

## 👨‍💻 Autore

- **Stefano Vananti** - [stefanovananti@icloud.com](mailto:stefanovananti@icloud.com)

## ⭐ Supporta il progetto

Se trovi utile questo progetto, lascia una stella su GitHub!

## 🤝 Contribuire

I contributi sono benvenuti! Per favore, apri una issue o una pull request.

## 📅 Ultimo aggiornamento

© 2025 - Lunar API Service 