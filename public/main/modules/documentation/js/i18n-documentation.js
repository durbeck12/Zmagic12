/**
 * Sistema de Internacionalização (i18n) específico para o módulo Documentation
 * Baseado no sistema i18n principal, mas adaptado para carregar os arquivos
 * de línguas do diretório correto
 */

class DocumentationI18nManager {
    constructor() {
        // Idioma padrão
        this.defaultLocale = 'pt-PT';
        
        // Idiomas suportados
        this.supportedLocales = ['pt-PT', 'en-US', 'fr-FR', 'es-ES', 'de-DE', 'zh-CN'];
        
        // Objeto que armazenará as strings de tradução
        this.translations = {};
        
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
        
        // Adiciona o evento de mudança de idioma
        languageSelector.addEventListener('change', (event) => {
            this.changeLanguage(event.target.value);
        });
        
        // Define o valor do seletor para o idioma atual
        languageSelector.value = this.currentLocale;
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
     * Atualiza a interface com o idioma atual
     */
    updateUI() {
        try {
            // Obtém o código do idioma atual
            const localeCode = this.currentLocale;
            const localeVar = localeCode.replace('-', '_');
            
            // Usa as traduções já carregadas via tags <script>
            if (window[localeVar]) {
                this.translations[localeCode] = window[localeVar];
                
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
            } else {
                console.warn(`Traduções para ${localeCode} não encontradas. Verifique se o arquivo foi carregado corretamente.`);
            }
        } catch (error) {
            console.error("Erro ao actualizar a interface com as traduções:", error);
        }
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
            const translations = this.translations[this.currentLocale];
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
            console.warn(`Erro ao traduzir a chave "${key}":`, error);
            return key;
        }
    }
    
    /**
     * Define o idioma atual
     * @param {string} locale - Código do idioma
     */
    setLanguage(locale) {
        this.changeLanguage(locale);
    }
}

// Cria uma instância global do gerenciador de idiomas
window.documentationI18n = new DocumentationI18nManager(); 