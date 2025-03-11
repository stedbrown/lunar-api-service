# Deployment su Vercel del Lunar API Service

Questo documento fornisce istruzioni dettagliate su come deployare il Lunar API Service su Vercel per garantire disponibilità 24/7.

## Prerequisiti

1. Un account [Vercel](https://vercel.com)
2. [Git](https://git-scm.com/) installato sul tuo computer
3. Il repository del progetto caricato su GitHub, GitLab o Bitbucket

## Passaggi per il Deployment

### 1. Preparazione del Repository

Assicurati che il tuo repository contenga i seguenti file:
- `vercel.json` (configurazione per Vercel)
- `src/index.js` modificato per l'esportazione dell'app
- `package.json` con tutte le dipendenze

### 2. Collegare il Repository a Vercel

1. Accedi al tuo account Vercel
2. Clicca su "Add New" > "Project"
3. Importa il repository dalla piattaforma Git che stai utilizzando
4. Seleziona il repository del Lunar API Service

### 3. Configurazione del Progetto

Nella schermata di configurazione del progetto:

1. **Framework Preset**: Seleziona "Other"
2. **Build and Output Settings**: Lascia le impostazioni predefinite
3. **Environment Variables**: Aggiungi le seguenti variabili d'ambiente:

   | Nome | Valore |
   |------|--------|
   | PORT | 3000 |
   | NODE_ENV | production |
   | UPDATE_INTERVAL | 21600000 |
   | EXTERNAL_API_KEY | (se necessario) |

4. Clicca su "Deploy"

### 4. Verifica del Deployment

Dopo il deployment, Vercel fornirà un URL per il tuo servizio (es. `lunar-api-service.vercel.app`).

Verifica che l'API funzioni correttamente testando i seguenti endpoint:
- `https://lunar-api-service.vercel.app/` (endpoint principale)
- `https://lunar-api-service.vercel.app/api/docs` (documentazione)
- `https://lunar-api-service.vercel.app/api/lunar/phase` (fase lunare attuale)

### 5. Configurazione di un Dominio Personalizzato (Opzionale)

Se desideri utilizzare un dominio personalizzato:

1. Vai alla dashboard del progetto su Vercel
2. Clicca su "Settings" > "Domains"
3. Aggiungi il tuo dominio e segui le istruzioni per configurare i record DNS

## Manutenzione e Monitoraggio

Vercel offre:
- **Analytics**: Per monitorare le prestazioni e l'utilizzo dell'API
- **Logs**: Per visualizzare i log del server
- **Deployment History**: Per gestire le versioni deployate

## Aggiornamenti

Per aggiornare l'API:

1. Effettua le modifiche al codice nel repository locale
2. Committa e pusha le modifiche al repository remoto
3. Vercel rileverà automaticamente le modifiche e avvierà un nuovo deployment

## Risoluzione dei Problemi

Se riscontri problemi con il deployment:

1. Controlla i log di build e deployment su Vercel
2. Verifica che tutte le variabili d'ambiente siano configurate correttamente
3. Assicurati che il file `vercel.json` sia configurato correttamente
4. Controlla che l'app sia esportata correttamente in `src/index.js` 