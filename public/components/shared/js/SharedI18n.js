/**
 * Sistema de Internacionalização (i18n) base para o ZMagic12
 * Classe base que implementa funcionalidades compartilhadas entre todos os gerenciadores de i18n
 */

class SharedI18n {
    constructor(options = {}) {
        // Idioma padrão
        this.defaultLocale = options.defaultLocale || 'pt-PT';
        
        // Idiomas suportados
        this.supportedLocales = options.supportedLocales || ['pt-PT', 'en-US', 'fr-FR', 'es-ES', 'de-DE', 'zh-CN'];
        
        // Objeto que armazenará as strings de tradução
        this.translations = {};
        
        // Controle de scripts carregados
        this.loadedScripts = {};
        
        // Caminho para os arquivos de tradução
        this.langPath = options.langPath || 'langs/';
        
        // Prefixo para logs
        this.logPrefix = options.logPrefix || '[I18n]';
        
        // Flag para definir se deve tentar carregar idiomas automaticamente
        this.autoLoadTranslations = options.autoLoadTranslations !== false;
        
        // Controle de carregamentos em andamento
        this.loadingPromises = {};
        
        // Inicializa o idioma
        this.init();
    }
    
    /**
     * Inicializa o sistema de idiomas
     */
    init() {
        try {
            // Carrega o idioma do localStorage ou usa o padrão
            this.currentLocale = localStorage.getItem('locale') || this.defaultLocale;
            
            // Verifica se o idioma é suportado
            if (!this.supportedLocales.includes(this.currentLocale)) {
                console.warn(`${this.logPrefix} Idioma não suportado: ${this.currentLocale}, usando o padrão: ${this.defaultLocale}`);
                this.currentLocale = this.defaultLocale;
            }
            
            // Configura o seletor de idiomas, se existir
            this.setupLanguageSelector();
            
            // Configura o listener para mudanças de idioma em outras partes da aplicação
            this.setupStorageListener();
            
            // Pre-carregar o idioma atual, se configurado para fazer isso
            if (this.autoLoadTranslations) {
                this.loadTranslations(this.currentLocale)
                    .then(() => this.updateUI())
                    .catch(error => console.error(`${this.logPrefix} Erro ao carregar traduções iniciais:`, error));
            } else {
                // Atualiza a interface com o idioma atual usando variáveis já carregadas
                this.updateUI();
            }
            
            console.log(`${this.logPrefix} Sistema inicializado com idioma: ${this.currentLocale}`);
        } catch (error) {
            console.error(`${this.logPrefix} Erro ao inicializar sistema de idiomas:`, error);
        }
    }
    
    /**
     * Configura o seletor de idiomas na interface
     */
    setupLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (!languageSelector) {
            console.log(`${this.logPrefix} Seletor de idiomas não encontrado`);
            return;
        }
        
        // Adiciona o evento de mudança de idioma
        languageSelector.addEventListener('change', (event) => {
            this.changeLanguage(event.target.value);
        });
        
        // Define o valor do seletor para o idioma atual
        languageSelector.value = this.currentLocale;
        console.log(`${this.logPrefix} Seletor de idiomas configurado para: ${this.currentLocale}`);
    }
    
    /**
     * Configura listener para mudanças no localStorage (para sincronizar idioma entre módulos)
     */
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'locale' && event.newValue !== this.currentLocale) {
                console.log(`${this.logPrefix} Idioma alterado externamente para: ${event.newValue}`);
                this.currentLocale = event.newValue;
                
                // Carregar o novo idioma se necessário
                if (this.autoLoadTranslations) {
                    this.loadTranslations(this.currentLocale)
                        .then(() => this.updateUI())
                        .catch(error => console.error(`${this.logPrefix} Erro ao carregar traduções após mudança externa:`, error));
                } else {
                    this.updateUI();
                }
            }
        });
        
        console.log(`${this.logPrefix} Listener de storage configurado`);
    }
    
    /**
     * Muda o idioma da aplicação
     * @param {string} locale - Novo idioma
     * @returns {Promise} Promessa que resolve quando o idioma é alterado
     */
    changeLanguage(locale) {
        // Verifica se o idioma é suportado
        if (!this.supportedLocales.includes(locale)) {
            console.error(`${this.logPrefix} Idioma não suportado: ${locale}`);
            return Promise.reject(new Error(`Idioma não suportado: ${locale}`));
        }
        
        console.log(`${this.logPrefix} Alterando idioma para: ${locale}`);
        
        // Atualiza o idioma atual
        this.currentLocale = locale;
        
        // Salva a preferência no localStorage
        localStorage.setItem('locale', locale);
        
        // Carregar o novo idioma se necessário e actualizar a interface
        if (this.autoLoadTranslations) {
            return this.loadTranslations(locale)
                .then(() => {
                    this.updateUI();
                    return locale;
                })
                .catch(error => {
                    console.error(`${this.logPrefix} Erro ao carregar traduções após mudança de idioma:`, error);
                    throw error;
                });
        } else {
            // Apenas atualiza a interface com as traduções já carregadas
            this.updateUI();
            return Promise.resolve(locale);
        }
    }
    
    /**
     * Atualiza a interface com o idioma atual
     */
    updateUI() {
        try {
            // Obtém o código do idioma atual
            const localeCode = this.currentLocale;
            const localeVar = localeCode.replace('-', '_');
            
            console.log(`${this.logPrefix} Atualizando interface com idioma: ${localeCode} (${localeVar})`);
            
            // Verifica se as traduções já estão carregadas
            if (window[localeVar] || this.translations[localeCode]) {
                // Usa as traduções do objeto local ou da variável global
                if (!this.translations[localeCode] && window[localeVar]) {
                    this.translations[localeCode] = window[localeVar];
                }
                
                // Atualiza todos os elementos com o atributo data-i18n
                const elements = document.querySelectorAll('[data-i18n]');
                console.log(`${this.logPrefix} Traduzindo ${elements.length} elementos com data-i18n`);
                
                elements.forEach(element => {
                    const key = element.getAttribute('data-i18n');
                    const translation = this.translate(key);
                    
                    if (translation) {
                        element.textContent = translation;
                    }
                });
                
                // Atualiza os atributos com data-i18n-attr
                const attrElements = document.querySelectorAll('[data-i18n-attr]');
                console.log(`${this.logPrefix} Traduzindo ${attrElements.length} elementos com data-i18n-attr`);
                
                attrElements.forEach(element => {
                    const attrSpec = element.getAttribute('data-i18n-attr');
                    if (!attrSpec) return;
                    
                    // Formato: "attr1:key1,attr2:key2"
                    const attrPairs = attrSpec.split(',');
                    attrPairs.forEach(pair => {
                        const [attr, key] = pair.split(':');
                        if (!attr || !key) return;
                        
                        const translation = this.translate(key);
                        if (translation) {
                            element.setAttribute(attr, translation);
                        }
                    });
                });
                
                // Atualiza os atributos title com data-i18n-title
                const titleElements = document.querySelectorAll('[data-i18n-title]');
                console.log(`${this.logPrefix} Traduzindo ${titleElements.length} elementos com data-i18n-title`);
                
                titleElements.forEach(element => {
                    const key = element.getAttribute('data-i18n-title');
                    if (!key) return;
                    
                    const translation = this.translate(key);
                    if (translation) {
                        element.setAttribute('title', translation);
                    }
                });
                
                // Dispara evento personalizado para notificar que as traduções foram atualizadas
                const eventName = this.getTranslationUpdatedEventName();
                document.dispatchEvent(new CustomEvent(eventName, { 
                    detail: { locale: localeCode } 
                }));
                
                console.log(`${this.logPrefix} Interface atualizada com sucesso`);
            } else {
                console.warn(`${this.logPrefix} Traduções para ${localeCode} não encontradas. Verifique se o arquivo foi carregado corretamente.`);
                // Tenta carregar as traduções dinamicamente se autoload estiver ativado
                if (this.autoLoadTranslations) {
                    this.loadTranslations(localeCode).then(() => this.updateUI());
                }
            }
        } catch (error) {
            console.error(`${this.logPrefix} Erro ao actualizar a interface com as traduções:`, error);
        }
    }
    
    /**
     * Carrega as traduções para o idioma especificado
     * @param {string} localeCode - Código do idioma a ser carregado
     * @param {boolean} forceReload - Se true, força o recarregamento mesmo se já estiver carregado
     * @returns {Promise} Promessa que resolve quando as traduções são carregadas
     */
    loadTranslations(localeCode, forceReload = false) {
        // Verifica se o idioma é suportado
        if (!this.supportedLocales.includes(localeCode)) {
            return Promise.reject(new Error(`${this.logPrefix} Idioma não suportado: ${localeCode}`));
        }
        
        // Variável global para este idioma
        const localeVar = localeCode.replace('-', '_');
        
        // Verificar se já existe um carregamento em andamento para este idioma
        if (this.loadingPromises[localeCode]) {
            console.log(`${this.logPrefix} Carregamento de ${localeCode} já em andamento, reusando promessa existente`);
            return this.loadingPromises[localeCode];
        }
        
        // Verifica se as traduções já estão disponíveis e não precisa recarregar
        if (!forceReload && (this.translations[localeCode] || window[localeVar])) {
            console.log(`${this.logPrefix} Traduções para ${localeCode} já disponíveis, usando versão em cache`);
            
            // Se houver na variável global mas não no objeto local, copiar
            if (!this.translations[localeCode] && window[localeVar]) {
                this.translations[localeCode] = window[localeVar];
            }
            
            return Promise.resolve(this.translations[localeCode]);
        }
        
        // Criar nova promessa de carregamento
        this.loadingPromises[localeCode] = new Promise((resolve, reject) => {
            try {
                console.log(`${this.logPrefix} Iniciando carregamento de ${localeCode} ${forceReload ? '(forçado)' : ''}`);
                
                // Se forceReload for true, tenta remover qualquer script existente
                if (forceReload && this.loadedScripts[localeCode]) {
                    const existingScript = document.querySelector(`script[src*="${localeCode}.js"]`);
                    if (existingScript) {
                        existingScript.remove();
                        console.log(`${this.logPrefix} Script anterior de ${localeCode} removido para recarregamento`);
                    }
                    delete this.loadedScripts[localeCode];
                }
                
                // Cria um elemento script para carregar o arquivo
                const script = document.createElement('script');
                script.src = `${this.langPath}${localeCode}.js`;
                script.type = 'text/javascript';
                
                // Adiciona atributos de data para rastreamento
                script.setAttribute('data-i18n-locale', localeCode);
                script.setAttribute('data-i18n-module', this.logPrefix);
                
                // Timeout para se o carregamento demorar muito
                const timeoutId = setTimeout(() => {
                    if (this.loadedScripts[localeCode] !== true) {
                        console.error(`${this.logPrefix} Timeout ao carregar ${localeCode}`);
                        script.onerror(new Error('Timeout ao carregar arquivo de tradução'));
                    }
                }, 10000); // 10 segundos de timeout
                
                script.onload = () => {
                    clearTimeout(timeoutId);
                    this.loadedScripts[localeCode] = true;
                    
                    // Verificar se a variável global foi definida corretamente
                    if (window[localeVar]) {
                        console.log(`${this.logPrefix} Arquivo de idioma ${localeCode} carregado com sucesso.`);
                        this.translations[localeCode] = window[localeVar];
                        
                        // Limpar a promessa de carregamento atual
                        delete this.loadingPromises[localeCode];
                        
                        resolve(this.translations[localeCode]);
                    } else {
                        console.error(`${this.logPrefix} Arquivo de idioma ${localeCode} não definiu a variável ${localeVar}.`);
                        
                        // Limpar a promessa de carregamento atual
                        delete this.loadingPromises[localeCode];
                        
                        reject(new Error(`Variável ${localeVar} não definida após carregar o arquivo.`));
                    }
                };
                
                script.onerror = (e) => {
                    clearTimeout(timeoutId);
                    console.error(`${this.logPrefix} Falha ao carregar o arquivo de idioma ${localeCode}:`, e);
                    this.loadedScripts[localeCode] = false;
                    
                    // Limpar a promessa de carregamento atual
                    delete this.loadingPromises[localeCode];
                    
                    reject(new Error(`Falha ao carregar o arquivo de idioma ${localeCode}`));
                };
                
                document.head.appendChild(script);
            } catch (error) {
                console.error(`${this.logPrefix} Erro ao carregar traduções:`, error);
                
                // Limpar a promessa de carregamento atual
                delete this.loadingPromises[localeCode];
                
                reject(error);
            }
        });
        
        return this.loadingPromises[localeCode];
    }
    
    /**
     * Verifica se um idioma específico já foi carregado
     * @param {string} localeCode - Código do idioma a verificar
     * @returns {boolean} True se o idioma já foi carregado
     */
    isLanguageLoaded(localeCode) {
        const localeVar = localeCode.replace('-', '_');
        return !!(this.translations[localeCode] || window[localeVar]);
    }
    
    /**
     * Recarrega todas as traduções existentes
     * @returns {Promise} Promessa que resolve quando todas as traduções são recarregadas
     */
    reloadAllTranslations() {
        console.log(`${this.logPrefix} Recarregando todas as traduções...`);
        
        // Criar uma lista de promessas para cada idioma carregado
        const reloadPromises = [];
        
        // Recarregar idiomas que já foram carregados antes
        Object.keys(this.loadedScripts).forEach(locale => {
            if (this.loadedScripts[locale]) {
                reloadPromises.push(this.loadTranslations(locale, true));
            }
        });
        
        // Verificar também variáveis globais que podem ter sido carregadas externamente
        this.supportedLocales.forEach(locale => {
            const localeVar = locale.replace('-', '_');
            if (window[localeVar] && !this.loadedScripts[locale]) {
                reloadPromises.push(this.loadTranslations(locale, true));
            }
        });
        
        // Aguardar todas as recargas e depois actualizar a UI
        return Promise.all(reloadPromises)
            .then(() => {
                console.log(`${this.logPrefix} Todas as traduções foram recarregadas com sucesso`);
                this.updateUI();
                return true;
            })
            .catch(error => {
                console.error(`${this.logPrefix} Erro ao recarregar traduções:`, error);
                throw error;
            });
    }
    
    /**
     * Carrega todos os idiomas suportados
     * @returns {Promise} Promessa que resolve quando todos os idiomas são carregados
     */
    loadAllSupportedLanguages() {
        console.log(`${this.logPrefix} Carregando todos os idiomas suportados...`);
        
        // Criar uma lista de promessas para cada idioma suportado
        const loadPromises = this.supportedLocales.map(locale => 
            this.loadTranslations(locale)
                .catch(error => {
                    console.warn(`${this.logPrefix} Erro ao carregar ${locale}:`, error);
                    return null; // Continuar mesmo se um idioma falhar
                })
        );
        
        return Promise.all(loadPromises)
            .then(results => {
                const loaded = results.filter(Boolean).length;
                console.log(`${this.logPrefix} ${loaded} de ${this.supportedLocales.length} idiomas carregados com sucesso`);
                return loaded;
            });
    }
    
    /**
     * Traduz uma chave para o idioma atual
     * @param {string} key - Chave de tradução (formato: "section.key")
     * @returns {string} Texto traduzido ou a própria chave se não encontrada
     */
    translate(key) {
        if (!key) return '';
        
        try {
            // Divide a chave em seções (ex: "header.login" -> ["header", "login"])
            const parts = key.split('.');
            
            // Obtém as traduções para o idioma atual
            let translations = this.translations[this.currentLocale];
            
            // Se não tiver no cache local, verifica a variável global
            if (!translations) {
                const localeVar = this.currentLocale.replace('-', '_');
                if (window[localeVar]) {
                    this.translations[this.currentLocale] = window[localeVar];
                    translations = window[localeVar];
                }
            }
            
            if (!translations) return key;
            
            // Navega pela estrutura de traduções seguindo as partes da chave
            let result = translations;
            for (const part of parts) {
                if (result && result[part] !== undefined) {
                    result = result[part];
                } else {
                    // Se não encontrar a tradução, retorna a chave original
                    return key;
                }
            }
            
            // Se o resultado for um objeto e não uma string, retorna a chave
            if (typeof result === 'object') return key;
            
            return result;
        } catch (error) {
            console.warn(`${this.logPrefix} Erro ao traduzir a chave "${key}":`, error);
            return key;
        }
    }
    
    /**
     * Define o idioma atual
     * @param {string} locale - Código do idioma
     */
    setLanguage(locale) {
        return this.changeLanguage(locale);
    }
    
    /**
     * Traduz dinamicamente elementos criados após a inicialização
     * @param {HTMLElement} element - Elemento DOM a ser traduzido
     */
    translateElement(element) {
        if (!element) return;
        
        try {
            // Traduzir o próprio elemento se tiver data-i18n
            if (element.hasAttribute('data-i18n')) {
                const key = element.getAttribute('data-i18n');
                const translation = this.translate(key);
                if (translation) {
                    element.textContent = translation;
                }
            }
            
            // Traduzir atributos se tiver data-i18n-attr
            if (element.hasAttribute('data-i18n-attr')) {
                const attrSpec = element.getAttribute('data-i18n-attr');
                if (attrSpec) {
                    const attrPairs = attrSpec.split(',');
                    attrPairs.forEach(pair => {
                        const [attr, key] = pair.split(':');
                        if (!attr || !key) return;
                        
                        const translation = this.translate(key);
                        if (translation) {
                            element.setAttribute(attr, translation);
                        }
                    });
                }
            }
            
            // Traduzir atributo title se tiver data-i18n-title
            if (element.hasAttribute('data-i18n-title')) {
                const key = element.getAttribute('data-i18n-title');
                if (key) {
                    const translation = this.translate(key);
                    if (translation) {
                        element.setAttribute('title', translation);
                    }
                }
            }
            
            // Traduzir elementos filhos com data-i18n
            const childrenWithI18n = element.querySelectorAll('[data-i18n]');
            childrenWithI18n.forEach(child => {
                const key = child.getAttribute('data-i18n');
                const translation = this.translate(key);
                if (translation) {
                    child.textContent = translation;
                }
            });
            
            // Traduzir elementos filhos com data-i18n-attr
            const childrenWithI18nAttr = element.querySelectorAll('[data-i18n-attr]');
            childrenWithI18nAttr.forEach(child => {
                const attrSpec = child.getAttribute('data-i18n-attr');
                if (attrSpec) {
                    const attrPairs = attrSpec.split(',');
                    attrPairs.forEach(pair => {
                        const [attr, key] = pair.split(':');
                        if (!attr || !key) return;
                        
                        const translation = this.translate(key);
                        if (translation) {
                            child.setAttribute(attr, translation);
                        }
                    });
                }
            });
            
            // Traduzir elementos filhos com data-i18n-title
            const childrenWithI18nTitle = element.querySelectorAll('[data-i18n-title]');
            childrenWithI18nTitle.forEach(child => {
                const key = child.getAttribute('data-i18n-title');
                if (key) {
                    const translation = this.translate(key);
                    if (translation) {
                        child.setAttribute('title', translation);
                    }
                }
            });
            
            console.log(`${this.logPrefix} Elemento traduzido dinamicamente:`, element);
        } catch (error) {
            console.error(`${this.logPrefix} Erro ao traduzir elemento dinamicamente:`, error);
        }
    }
    
    /**
     * Retorna o nome do evento de atualização de traduções
     * Este método deve ser sobrescrito nas classes filhas
     * @returns {string} Nome do evento
     */
    getTranslationUpdatedEventName() {
        return 'translations:updated';
    }
}

// Exporta a classe para ser usada em módulos
export default SharedI18n; 