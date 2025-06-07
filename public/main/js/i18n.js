/**
 * Sistema de Internacionalização (i18n) para o ZMagic12
 * Gere a tradução e mudança de idiomas da aplicação
 */

class I18nManager {
    constructor() {
        // Idioma padrão
        this.defaultLocale = 'pt-PT';
        
        // Idiomas suportados
        this.supportedLocales = ['pt-PT', 'en-US', 'fr-FR', 'es-ES', 'de-DE', 'zh-CN'];
        
        // Objeto que armazenará as strings de tradução
        this.translations = {};
        
        // Controle de scripts carregados
        this.loadedScripts = {};
        
        // Inicializa o idioma
        this.init();
    }
    
    /**
     * Inicializa o sistema de idiomas
     */
    init() {
        // Carrega o idioma do localStorage ou usa o padrão
        this.currentLocale = localStorage.getItem('locale') || this.defaultLocale;
        
        // Verifica se o idioma é suportado
        if (!this.supportedLocales.includes(this.currentLocale)) {
            this.currentLocale = this.defaultLocale;
        }
        
        // Configura o seletor de idiomas, se existir
        this.setupLanguageSelector();
        
        // Atualiza a interface com o idioma atual
        this.updateUI();
    }
    
    /**
     * Configura o seletor de idiomas na interface
     */
    setupLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (!languageSelector) return;
        
        // Limpa o seletor
        languageSelector.innerHTML = '';
        
        // Adiciona as opções de idioma
        this.supportedLocales.forEach(locale => {
            const option = document.createElement('option');
            option.value = locale;
            
            // Usa o nome do idioma no idioma atual
            const localeName = this.getLanguageName(locale);
            option.textContent = localeName;
            
            // Seleciona o idioma atual
            if (locale === this.currentLocale) {
                option.selected = true;
            }
            
            languageSelector.appendChild(option);
        });
        
        // Adiciona o evento de mudança de idioma
        languageSelector.addEventListener('change', (event) => {
            this.changeLanguage(event.target.value);
        });
    }
    
    /**
     * Retorna o nome do idioma no idioma atual
     * @param {string} locale - Código do idioma
     * @returns {string} Nome do idioma
     */
    getLanguageName(locale) {
        // Se ainda não temos traduções, usamos os nomes em inglês
        if (!this.translations[this.currentLocale]) {
            const names = {
                'pt-PT': 'Portuguese (Portugal)',
                'en-US': 'English (US)',
                'fr-FR': 'French (France)',
                'es-ES': 'Spanish (Spain)',
                'de-DE': 'German (Germany)',
                'zh-CN': 'Chinese (Simplified)'
            };
            return names[locale] || locale;
        }
        
        // Usa a tradução do idioma atual
        const key = locale.replace('-', '_');
        return this.translations[this.currentLocale].language[key] || locale;
    }
    
    /**
     * Muda o idioma da aplicação
     * @param {string} locale - Novo idioma
     */
    changeLanguage(locale) {
        // Verifica se o idioma é suportado
        if (!this.supportedLocales.includes(locale)) {
            console.error(`Idioma não suportado: ${locale}`);
            return;
        }
        
        // Atualiza o idioma atual
        this.currentLocale = locale;
        
        // Salva a preferência no localStorage
        localStorage.setItem('locale', locale);
        
        // Atualiza a interface
        this.updateUI();
    }
    
    /**
     * Carrega as traduções para o idioma atual
     * @returns {Promise} Promessa que resolve quando as traduções são carregadas
     */
    async loadTranslations() {
        // Converte formato do locale para o nome do arquivo (pt-PT -> pt-PT.js)
        const localeCode = this.currentLocale;
        
        try {
            // Se já temos as traduções para este idioma, não precisamos carregar novamente
            if (this.translations[localeCode]) {
                return;
            }
            
            // Variável global para este idioma
            const localeVar = localeCode.replace('-', '_');
            
            // Verifica se a variável global para este idioma já está definida
            if (window[localeVar]) {
                this.translations[localeCode] = window[localeVar];
                return;
            }
            
            // Verifica se já tentamos carregar este script antes
            if (this.loadedScripts[localeCode]) {
                console.warn(`Já tentou carregar o script ${localeCode} anteriormente.`);
                return;
            }
            
            // Caso contrário, precisamos carregar o arquivo de idioma
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                
                // Determina o caminho correto baseado na localização atual
                let langPath = '';
                
                // Resolvendo o caminho com base na localização atual
                const path = window.location.pathname;
                if (path.includes('/documentation/')) {
                    // Para páginas na subpasta documentation
                    langPath = '../js/langs/';
                } else {
                    // Para páginas na raiz do site
                    langPath = 'public/main/js/langs/';
                }
                
                console.log(`Carregando arquivo de idioma de: ${langPath}${localeCode}.js`);
                
                // Define o caminho do script
                script.src = `${langPath}${localeCode}.js`;
                script.type = 'text/javascript';
                
                script.onload = () => {
                    // Marca o script como carregado
                    this.loadedScripts[localeCode] = true;
                    
                    // Quando o script carregar, a variável global estará disponível
                    if (window[localeVar]) {
                        console.log(`Variável de idioma ${localeVar} encontrada com sucesso.`);
                        this.translations[localeCode] = window[localeVar];
                        resolve();
                    } else {
                        console.error(`Arquivo de idioma ${localeCode} carregado, mas variável ${localeVar} não encontrada.`);
                        reject(new Error(`Variável de idioma ${localeVar} não encontrada.`));
                    }
                };
                script.onerror = (e) => {
                    console.error(`Falha ao carregar o arquivo de idioma: ${localeCode}`, e);
                    this.loadedScripts[localeCode] = false; // Marca como falha para tentar novamente
                    reject(new Error(`Falha ao carregar o arquivo de idioma: ${localeCode}`));
                };
                document.head.appendChild(script);
            });
        } catch (error) {
            console.error(`Erro ao carregar traduções para ${localeCode}:`, error);
            // Fallback para o idioma padrão se houver erro
            this.currentLocale = this.defaultLocale;
            return Promise.reject(error);
        }
    }
    
    /**
     * Atualiza a interface com o idioma atual
     */
    async updateUI() {
        try {
            // Carrega as traduções
            await this.loadTranslations();
            
            // Atualiza todos os elementos com o atributo data-i18n
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.translate(key);
                
                if (translation) {
                    element.textContent = translation;
                }
            });
            
            // Atualiza os atributos com data-i18n-attr
            const attrElements = document.querySelectorAll('[data-i18n-attr]');
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
            
            // Atualiza seletor de idioma
            this.setupLanguageSelector();
        } catch (error) {
            console.warn("Erro ao actualizar a interface com as traduções:", error);
            // Falha silenciosa para não interromper o carregamento da página
            // Usamos o idioma padrão ou textos originais na interface
        }
    }
    
    /**
     * Traduz uma chave para o idioma atual
     * @param {string} key - Chave de tradução (formato: 'section.key')
     * @returns {string} Texto traduzido ou a própria chave se não encontrado
     */
    translate(key) {
        if (!key) return '';
        
        try {
            // Obtém as traduções para o idioma atual
            const translations = this.translations[this.currentLocale];
            if (!translations) return key;
            
            // Divide a chave por pontos para aceder a objectos aninhados
            const parts = key.split('.');
            let result = translations;
            
            // Navega através dos objetos aninhados
            for (const part of parts) {
                if (result[part] === undefined) {
                    return key; // Retorna a chave se a tradução não for encontrada
                }
                result = result[part];
            }
            
            return result;
        } catch (error) {
            console.error(`Erro ao traduzir "${key}":`, error);
            return key;
        }
    }
}

// Cria uma instância global do gerenciador de i18n
const i18n = new I18nManager();

// Exporta para uso em outros scripts
window.i18n = i18n;

// Qualquer outro código necessário pode ser adicionado aqui 