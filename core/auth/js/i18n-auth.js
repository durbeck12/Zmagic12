/**
 * Sistema de Internacionalização (i18n) para módulos de autenticação
 * Responsável por carregar os arquivos de idioma e traduzir elementos da interface
 */

// Auto-invoking function to avoid polluting global scope
(function() {
    const defaultLanguage = 'pt-PT';
    const supportedLanguages = ['pt-PT', 'en-US', 'fr-FR', 'es-ES', 'de-DE', 'zh-CN'];
    const keysPrefix = 'auth_'; // Prefixo usado nas variáveis globais de idioma
    
    // Verifica se estamos em modo de teste/desenvolvimento
    const isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Configurações do sistema i18n
    const config = {
        debug: isDevMode,
        defaultLanguage: defaultLanguage,
        storageName: 'locale', // Usa o mesmo storage key que o sistema i18n principal
        langVarPrefix: 'auth_' // Prefixo das variáveis globais de idioma (window.auth_pt_PT, etc.)
    };
    
    /**
     * Log condicional (apenas em modo debug)
     */
    function log(...args) {
        if (config.debug) {
            console.log('[i18n-auth]', ...args);
        }
    }
    
    /**
     * Determina qual idioma deve ser usado
     * Prioridade: 1. localStorage, 2. preferência do navegador, 3. idioma padrão
     */
    function determineLanguage() {
        // 1. Verificar localStorage
        const storedLanguage = localStorage.getItem(config.storageName);
        if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
            log(`Usando idioma do localStorage: ${storedLanguage}`);
            return storedLanguage;
        }
        
        // 2. Verificar preferência do navegador
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            // Se tiver exatamente este idioma
            if (supportedLanguages.includes(browserLang)) {
                log(`Usando idioma do navegador: ${browserLang}`);
                return browserLang;
            }
            
            // Verificar se temos correspondência parcial (ex: 'pt-BR' corresponderia com 'pt-PT')
            const baseLang = browserLang.split('-')[0];
            for (const lang of supportedLanguages) {
                if (lang.startsWith(baseLang + '-')) {
                    log(`Usando correspondência parcial de idioma do navegador: ${browserLang} -> ${lang}`);
                    return lang;
                }
            }
        }
        
        // 3. Usar idioma padrão
        log(`Usando idioma padrão: ${config.defaultLanguage}`);
        return config.defaultLanguage;
    }
    
    /**
     * Carrega arquivo de idioma
     */
    function loadLanguageFile(language, callback) {
        // Verificar primeiro se o arquivo já foi carregado
        const langVarName = config.langVarPrefix + language.replace('-', '_');
        
        if (window[langVarName]) {
            log(`Arquivo de idioma já carregado em memória: ${language}`);
            if (callback) callback(language);
            return;
        }
        
        // Criar traduções padrão para fallback
        createFallbackTranslations(language);
        
        // Se não estiver carregado, fazer o carregamento via script
        const script = document.createElement('script');
        // Construir o caminho relativo ao local atual
        const path = determineLangFilePath(language);
        
        let scriptLoaded = false;
        let scriptTimeout = null;
        
        log(`Carregando arquivo de idioma: ${path}`);
        script.src = path;
        script.onload = function() {
            scriptLoaded = true;
            log(`Arquivo de idioma carregado: ${language}`);
            
            // Verificar se a variável foi realmente criada
            if (!window[langVarName]) {
                console.warn(`O arquivo ${path} carregou, mas não definiu a variável ${langVarName}`);
                // Se ainda não definiu, usar o fallback
                ensureFallbackTranslations(language);
            }
            
            if (callback) callback(language);
            
            // Limpar o timeout se existir
            if (scriptTimeout) {
                clearTimeout(scriptTimeout);
            }
        };
        script.onerror = function() {
            console.error(`Erro ao carregar arquivo de idioma: ${language}`);
            ensureFallbackTranslations(language);
            
            if (callback) callback(language);
            
            // Limpar o timeout se existir
            if (scriptTimeout) {
                clearTimeout(scriptTimeout);
            }
        };
        document.head.appendChild(script);
        
        // Timeout de segurança para caso o script não carregue
        scriptTimeout = setTimeout(() => {
            if (!scriptLoaded) {
                console.warn(`Timeout ao carregar o arquivo de idioma: ${language}`);
                ensureFallbackTranslations(language);
                
                if (callback) callback(language);
            }
        }, 5000);
    }
    
    /**
     * Cria traduções básicas de fallback para um idioma
     */
    function createFallbackTranslations(language) {
        const langVarName = config.langVarPrefix + language.replace('-', '_');
        
        // Só criar se não existir ainda
        if (!window[langVarName]) {
            log(`Criando traduções de fallback para ${language}`);
            
            // Criar objeto básico de traduções
            window[langVarName] = {
                "app_name": "ZMagic12",
                "login": {
                    "title": "Login",
                    "email_label": "Email",
                    "password_label": "Password",
                    "submit_button": "Login",
                    "loading": "Loading..."
                },
                "register": {
                    "title": "Register",
                    "submit_button": "Register"
                },
                "recovery": {
                    "title": "Password Recovery",
                    "submit_button": "Send"
                }
            };
        }
    }
    
    /**
     * Garante que temos pelo menos as traduções básicas para um idioma
     */
    function ensureFallbackTranslations(language) {
        const langVarName = config.langVarPrefix + language.replace('-', '_');
        
        // Se a variável não existir, criar com valores básicos
        if (!window[langVarName]) {
            createFallbackTranslations(language);
        }
    }
    
    /**
     * Determina o caminho do arquivo de idioma
     */
    function determineLangFilePath(language) {
        // Obter o caminho base do script atual
        const scripts = document.getElementsByTagName('script');
        let basePath = '';
        
        // Encontrar o script i18n-auth.js atual
        for (const script of scripts) {
            if (script.src.includes('i18n-auth.js')) {
                basePath = script.src.substring(0, script.src.lastIndexOf('/') + 1);
                break;
            }
        }
        
        // Se não encontrou o script, usar caminho relativo como fallback
        if (!basePath) {
            // Verificar se estamos em /core/auth/ ou outro local
            const currentPath = window.location.pathname;
            if (currentPath.includes('/core/auth/')) {
                basePath = '/core/auth/js/';
            } else {
                // Fallback para caminho relativo
                return `js/langs/${language}.js`;
            }
        }
        
        // Retornar caminho para o arquivo de idioma
        return `${basePath}langs/${language}.js`;
    }
    
    /**
     * Traduz todos os elementos com atributo data-i18n
     */
    function translateElements() {
        const currentLang = getCurrentLanguage();
        const langVarName = config.langVarPrefix + currentLang.replace('-', '_');
        const langVar = window[langVarName];
        
        if (!langVar) {
            console.error(`Variável de idioma não encontrada: ${langVarName}`);
            
            // Se a variável não existe, criar valores de fallback antes de tentar carregar
            ensureFallbackTranslations(currentLang);
            
            // Tentar carregar o arquivo novamente
            loadLanguageFile(currentLang, () => {
                // Após carregar, tentar traduzir novamente
                setTimeout(translateElements, 100);
            });
            return;
        }
        
        // Traduzir elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = getTranslationByKey(key, langVar);
            
            if (text !== null) {
                el.textContent = text;
            } else {
                log(`Chave de tradução não encontrada: ${key}`);
            }
        });
        
        // Traduzir atributos com data-i18n-attr
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const attrs = el.getAttribute('data-i18n-attr').split(',');
            
            attrs.forEach(attrPair => {
                const [attr, key] = attrPair.trim().split(':');
                if (attr && key) {
                    const text = getTranslationByKey(key, langVar);
                    if (text !== null) {
                        el.setAttribute(attr, text);
                    } else {
                        log(`Chave de tradução para atributo não encontrada: ${key}`);
                    }
                }
            });
        });
    }
    
    /**
     * Obtém tradução a partir de uma chave aninhada
     * Exemplo: "login.title" -> langVar.login.title
     */
    function getTranslationByKey(key, langVar) {
        const parts = key.split('.');
        let obj = langVar;
        
        for (const part of parts) {
            if (obj && obj[part] !== undefined) {
                obj = obj[part];
            } else {
                return null;
            }
        }
        
        return obj;
    }
    
    /**
     * Obtém o idioma atual
     */
    function getCurrentLanguage() {
        return localStorage.getItem(config.storageName) || config.defaultLanguage;
    }
    
    /**
     * Define o idioma atual
     */
    function setLanguage(language, save = true) {
        if (!supportedLanguages.includes(language)) {
            console.error(`Idioma não suportado: ${language}`);
            return false;
        }
        
        // Salvar preferência no localStorage
        if (save) {
            localStorage.setItem(config.storageName, language);
        }
        
        // Verificar se o arquivo de idioma já foi carregado
        const langVarName = config.langVarPrefix + language.replace('-', '_');
        
        if (window[langVarName]) {
            log(`Idioma já carregado: ${language}`);
            translateElements();
            return true;
        }
        
        // Carregar arquivo de idioma
        loadLanguageFile(language, () => {
            translateElements();
            
            // Disparar evento de mudança de idioma
            document.dispatchEvent(new CustomEvent('auth:languageChanged', {
                detail: { language }
            }));
        });
        
        return true;
    }
    
    /**
     * Traduz um texto específico pela chave
     */
    function translate(key, language = null) {
        const lang = language || getCurrentLanguage();
        const langVarName = config.langVarPrefix + lang.replace('-', '_');
        const langVar = window[langVarName];
        
        if (!langVar) {
            console.error(`Variável de idioma não encontrada: ${langVarName}`);
            // Criar fallback e tentar novamente
            ensureFallbackTranslations(lang);
            return key;
        }
        
        const text = getTranslationByKey(key, langVar);
        return text !== null ? text : key;
    }
    
    /**
     * Configuração inicial
     */
    function init() {
        const currentLanguage = determineLanguage();
        log(`Iniciando com idioma: ${currentLanguage}`);
        
        // Verificar se o arquivo de idioma já foi carregado (pode ter sido incluído via <script>)
        const langVarName = config.langVarPrefix + currentLanguage.replace('-', '_');
        
        if (!window[langVarName]) {
            log(`Carregando arquivo de idioma para ${currentLanguage}`);
            // Se não carregado ainda, fazer o carregamento
            loadLanguageFile(currentLanguage, () => {
                translateElements();
            });
        } else {
            log(`Arquivo de idioma já carregado: ${currentLanguage}`);
            // Se já carregado, traduzir imediatamente
            translateElements();
        }
        
        // Evento para quando o DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                translateElements();
            });
        }
    }
    
    /**
     * Configura o seletor de idiomas (função mantida para compatibilidade, mas não faz nada)
     */
    function setupLanguageSelector() {
        // Função vazia - o seletor de idiomas foi removido das páginas de autenticação
        // A preferência de idioma agora é compartilhada com o sistema principal
    }
    
    // Adicionar funções ao objeto global
    window.Auth_I18n = {
        init,
        setLanguage,
        getCurrentLanguage,
        translate,
        translateElements
    };
    
    // Inicializar automaticamente
    init();
})(); 