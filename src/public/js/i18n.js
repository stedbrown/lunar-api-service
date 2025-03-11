// Inizializzazione di i18next
document.addEventListener('DOMContentLoaded', function() {
    // Estendi jQuery per supportare il selettore :contains
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };

    // Inizializza i18next
    i18next
        .use(i18nextBrowserLanguageDetector)
        .init({
            fallbackLng: 'en',
            debug: false,
            resources: {
                en: {
                    translation: {} // Sarà caricato dinamicamente
                },
                it: {
                    translation: {} // Sarà caricato dinamicamente
                },
                de: {
                    translation: {} // Sarà caricato dinamicamente
                },
                fr: {
                    translation: {} // Sarà caricato dinamicamente
                },
                es: {
                    translation: {} // Sarà caricato dinamicamente
                }
            },
            detection: {
                order: ['querystring', 'navigator'],
                lookupQuerystring: 'lng'
            }
        }, function(err, t) {
            // Carica i file di traduzione
            loadTranslations();
        });

    // Funzione per caricare i file di traduzione
    function loadTranslations() {
        const languages = ['en', 'it', 'de', 'fr', 'es'];
        
        languages.forEach(lang => {
            fetch(`/locales/${lang}/translation.json`)
                .then(response => response.json())
                .then(data => {
                    i18next.addResourceBundle(lang, 'translation', data);
                    
                    // Se è la lingua corrente, aggiorna la pagina
                    if (lang === i18next.language) {
                        updateContent();
                    }
                    
                    // Aggiungi il selettore di lingua dopo aver caricato tutte le traduzioni
                    if (lang === 'es') { // L'ultima lingua da caricare
                        setTimeout(addLanguageSelector, 500);
                    }
                })
                .catch(error => console.error(`Error loading ${lang} translations:`, error));
        });
    }

    // Funzione per aggiornare il contenuto della pagina
    function updateContent() {
        // Aggiorna il titolo della pagina
        document.title = i18next.t('title');
        
        // Aggiorna l'attributo lang dell'HTML
        document.documentElement.lang = i18next.language;
        
        // Aggiorna l'header
        document.querySelector('header h1').textContent = i18next.t('header.title');
        document.querySelector('header p').textContent = i18next.t('header.subtitle');
        
        // Aggiorna le sezioni
        updateSection('introduction');
        updateEndpoints();
        updatePhasesSection();
        updateSection('usage');
        updateSection('limits');
        updateSecuritySection();
        
        // Aggiorna il footer
        updateFooter();
        
        // Aggiorna gli elementi UI
        updateUIElements();
    }
    
    // Funzione per aggiornare una sezione generica
    function updateSection(sectionName) {
        // Trova la sezione in base al titolo in inglese
        const englishTitle = i18next.t(`sections.${sectionName}.title`, { lng: 'en' });
        const sections = document.querySelectorAll('section h2');
        let section = null;
        
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].textContent.trim() === englishTitle || 
                sections[i].textContent.trim() === i18next.t(`sections.${sectionName}.title`, { lng: 'it' })) {
                section = sections[i].parentElement;
                break;
            }
        }
        
        if (section) {
            // Aggiorna il titolo
            section.querySelector('h2').textContent = i18next.t(`sections.${sectionName}.title`);
            
            // Aggiorna i paragrafi
            const paragraphs = section.querySelectorAll('p');
            if (paragraphs.length > 0) {
                paragraphs[0].textContent = i18next.t(`sections.${sectionName}.paragraph1`);
                
                if (paragraphs.length > 1 && i18next.exists(`sections.${sectionName}.paragraph2`)) {
                    paragraphs[1].textContent = i18next.t(`sections.${sectionName}.paragraph2`);
                }
                
                if (paragraphs.length > 2 && i18next.exists(`sections.${sectionName}.description`)) {
                    paragraphs[2].textContent = i18next.t(`sections.${sectionName}.description`);
                }
            }
        }
    }
    
    // Funzione per aggiornare la sezione degli endpoint
    function updateEndpoints() {
        // Trova la sezione in base al titolo in inglese
        const englishTitle = i18next.t('sections.endpoints.title', { lng: 'en' });
        const sections = document.querySelectorAll('section h2');
        let section = null;
        
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].textContent.trim() === englishTitle || 
                sections[i].textContent.trim() === i18next.t('sections.endpoints.title', { lng: 'it' })) {
                section = sections[i].parentElement;
                break;
            }
        }
        
        if (section) {
            // Aggiorna il titolo
            section.querySelector('h2').textContent = i18next.t('sections.endpoints.title');
            
            // Aggiorna gli endpoint
            const endpoints = section.querySelectorAll('.endpoint');
            
            // Endpoint 1: Current Phase
            if (endpoints.length > 0) {
                endpoints[0].querySelector('p').textContent = i18next.t('sections.endpoints.currentPhase.description');
                endpoints[0].querySelector('h4').textContent = i18next.t('sections.endpoints.response');
                endpoints[0].querySelector('.try-it h4').textContent = i18next.t('sections.endpoints.tryIt');
                endpoints[0].querySelector('.try-it .btn').textContent = i18next.t('sections.endpoints.executeRequest');
            }
            
            // Endpoint 2: Specific Date
            if (endpoints.length > 1) {
                endpoints[1].querySelector('p').textContent = i18next.t('sections.endpoints.specificDate.description');
                endpoints[1].querySelector('h4').textContent = i18next.t('sections.endpoints.response');
                endpoints[1].querySelector('.try-it h4').textContent = i18next.t('sections.endpoints.tryIt');
                endpoints[1].querySelector('.try-it .btn').textContent = i18next.t('sections.endpoints.executeRequest');
            }
            
            // Endpoint 3: Detailed Info
            if (endpoints.length > 2) {
                endpoints[2].querySelector('p').textContent = i18next.t('sections.endpoints.detailedInfo.description');
                endpoints[2].querySelector('h4').textContent = i18next.t('sections.endpoints.response');
                endpoints[2].querySelector('.try-it h4').textContent = i18next.t('sections.endpoints.tryIt');
                endpoints[2].querySelector('.try-it .btn').textContent = i18next.t('sections.endpoints.executeRequest');
            }
        }
    }
    
    // Funzione per aggiornare la sezione delle fasi lunari
    function updatePhasesSection() {
        // Trova la sezione in base al titolo in inglese
        const englishTitle = i18next.t('sections.phases.title', { lng: 'en' });
        const sections = document.querySelectorAll('section h2');
        let section = null;
        
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].textContent.trim() === englishTitle || 
                sections[i].textContent.trim() === i18next.t('sections.phases.title', { lng: 'it' })) {
                section = sections[i].parentElement;
                break;
            }
        }
        
        if (section) {
            // Aggiorna il titolo
            section.querySelector('h2').textContent = i18next.t('sections.phases.title');
            
            // Aggiorna la descrizione
            section.querySelector('p').textContent = i18next.t('sections.phases.description');
            
            // Aggiorna le fasi lunari
            const phases = section.querySelectorAll('.emoji-item');
            
            if (phases.length >= 8) {
                phases[0].querySelector('span:not(.emoji)').textContent = i18next.t('sections.phases.newMoon');
                phases[1].querySelector('span:not(.emoji)').textContent = i18next.t('sections.phases.waxingCrescent');
                phases[2].querySelector('span:not(.emoji)').textContent = i18next.t('sections.phases.firstQuarter');
                phases[3].querySelector('span:not(.emoji)').textContent = i18next.t('sections.phases.waxingGibbous');
                phases[4].querySelector('span:not(.emoji)').textContent = i18next.t('sections.phases.fullMoon');
                phases[5].querySelector('span:not(.emoji)').textContent = i18next.t('sections.phases.waningGibbous');
                phases[6].querySelector('span:not(.emoji)').textContent = i18next.t('sections.phases.lastQuarter');
                phases[7].querySelector('span:not(.emoji)').textContent = i18next.t('sections.phases.waningCrescent');
            }
        }
    }
    
    // Funzione per aggiornare la sezione di sicurezza
    function updateSecuritySection() {
        // Trova la sezione in base al titolo in inglese
        const englishTitle = i18next.t('sections.security.title', { lng: 'en' });
        const sections = document.querySelectorAll('section h2');
        let section = null;
        
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].textContent.trim() === englishTitle || 
                sections[i].textContent.trim() === i18next.t('sections.security.title', { lng: 'it' })) {
                section = sections[i].parentElement;
                break;
            }
        }
        
        if (section) {
            // Aggiorna il titolo
            section.querySelector('h2').textContent = i18next.t('sections.security.title');
            
            // Aggiorna la descrizione
            const paragraphs = section.querySelectorAll('p');
            if (paragraphs.length > 0) {
                paragraphs[0].textContent = i18next.t('sections.security.description');
            }
            
            // Aggiorna i punti elenco
            const listItems = section.querySelectorAll('ul li');
            if (listItems.length >= 5) {
                listItems[0].innerHTML = `<strong>Rate Limiting:</strong> ${i18next.t('sections.security.rateLimiting').split(':')[1].trim()}`;
                listItems[1].innerHTML = `<strong>Input Validation:</strong> ${i18next.t('sections.security.inputValidation').split(':')[1].trim()}`;
                listItems[2].innerHTML = `<strong>Security Headers:</strong> ${i18next.t('sections.security.securityHeaders').split(':')[1].trim()}`;
                listItems[3].innerHTML = `<strong>HTTPS:</strong> ${i18next.t('sections.security.https').split(':')[1].trim()}`;
                listItems[4].innerHTML = `<strong>Monitoring:</strong> ${i18next.t('sections.security.monitoring').split(':')[1].trim()}`;
            }
            
            // Aggiorna il paragrafo di contatto
            if (paragraphs.length > 1) {
                const contactText = i18next.t('sections.security.contact');
                const emailLink = paragraphs[1].querySelector('a').outerHTML;
                paragraphs[1].innerHTML = `${contactText} ${emailLink}.`;
            }
        }
    }
    
    // Funzione per aggiornare il footer
    function updateFooter() {
        const footer = document.querySelector('footer');
        
        if (footer) {
            const paragraphs = footer.querySelectorAll('p');
            
            if (paragraphs.length > 0) {
                const firstParagraph = paragraphs[0];
                const links = firstParagraph.querySelectorAll('a');
                
                if (links.length >= 2) {
                    const developerLink = links[0].outerHTML;
                    const githubLink = links[1].outerHTML;
                    
                    firstParagraph.innerHTML = `${i18next.t('footer.copyright')} ${developerLink} - ${i18next.t('footer.available')} ${githubLink}`;
                }
            }
            
            if (paragraphs.length > 1) {
                const secondParagraph = paragraphs[1];
                const link = secondParagraph.querySelector('a');
                
                if (link) {
                    const githubLink = link.outerHTML;
                    secondParagraph.innerHTML = `${i18next.t('footer.useful')} ${githubLink}!`;
                }
            }
        }
    }
    
    // Funzione per aggiornare gli elementi UI
    function updateUIElements() {
        // Aggiorna i messaggi di caricamento
        document.querySelectorAll('pre').forEach(pre => {
            if (pre.textContent === 'Caricamento...') {
                pre.textContent = i18next.t('ui.loading');
            }
        });
        
        // Aggiorna il testo del selettore di data
        const dateInput = document.getElementById('date-input');
        if (dateInput) {
            dateInput.title = i18next.t('ui.selectDate');
        }
        
        // Aggiorna gli alert
        const originalAlert = window.alert;
        window.alert = function(message) {
            if (message === 'Seleziona una data') {
                originalAlert(i18next.t('ui.selectDate'));
            } else {
                originalAlert(message);
            }
        };
    }
    
    // Aggiungi il selettore di lingua
    function addLanguageSelector() {
        const header = document.querySelector('header');
        
        if (header) {
            const languageSelector = document.createElement('div');
            languageSelector.className = 'language-selector';
            languageSelector.style.marginTop = '15px';
            
            const label = document.createElement('label');
            label.textContent = i18next.t('ui.language') + ': ';
            label.style.color = 'white';
            label.style.marginRight = '10px';
            
            const select = document.createElement('select');
            select.id = 'language-select';
            select.style.padding = '5px';
            select.style.borderRadius = '5px';
            
            const languages = [
                { code: 'en', name: 'English' },
                { code: 'it', name: 'Italiano' },
                { code: 'de', name: 'Deutsch' },
                { code: 'fr', name: 'Français' },
                { code: 'es', name: 'Español' }
            ];
            
            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                
                if (lang.code === i18next.language) {
                    option.selected = true;
                }
                
                select.appendChild(option);
            });
            
            select.addEventListener('change', function() {
                i18next.changeLanguage(this.value, (err, t) => {
                    if (err) return console.error('Error changing language:', err);
                    updateContent();
                    
                    // Aggiorna l'URL con il parametro della lingua
                    const url = new URL(window.location);
                    url.searchParams.set('lng', this.value);
                    window.history.pushState({}, '', url);
                });
            });
            
            languageSelector.appendChild(label);
            languageSelector.appendChild(select);
            
            header.appendChild(languageSelector);
        }
    }
}); 