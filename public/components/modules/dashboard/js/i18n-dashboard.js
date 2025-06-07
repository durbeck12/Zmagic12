/**
 * Sistema de Internacionalização (i18n) específico para o módulo Dashboard
 * Baseado no sistema i18n dos outros módulos, adaptado para carregar os arquivos
 * de línguas do diretório correto
 */

class DashboardI18nManager {
    constructor() {
        // Idioma padrão
        this.defaultLocale = 'pt-PT';
        
        // Idiomas suportados
        this.supportedLocales = ['pt-PT', 'en-US', 'fr-FR', 'es-ES', 'de-DE', 'zh-CN'];
        
        // Objeto que armazenará as strings de tradução
        this.translations = {};
        
        // Verificar se já existe uma instância global
        if (!window.i18nInstances) window.i18nInstances = [];
        window.i18nInstances.push(this);
        
        this.init();
        console.log('[i18n] Inicializado para dashboard');
    }
    
    /**
     * Inicializa o sistema de idiomas
     */
    init() {
        try {
            // Forçar sincronização com localStorage
            const savedLocale = localStorage.getItem('locale');
            if (savedLocale && this.supportedLocales.includes(savedLocale)) {
                this.currentLocale = savedLocale;
            } else {
                this.currentLocale = this.defaultLocale;
                localStorage.setItem('locale', this.currentLocale);
            }
            
            this.setupLanguageSelector();
            this.setupStorageListener();
            this.updateUI();
            
        } catch (error) {
            console.error('[i18n] Erro na inicialização:', error);
        }
    }
    
    /**
     * Configura o seletor de idiomas na interface
     */
    setupLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (!languageSelector) {
            console.log('[DashboardI18n] Seletor de idiomas não encontrado');
            return;
        }
        
        // Adiciona o evento de mudança de idioma
        languageSelector.addEventListener('change', (event) => {
            this.changeLanguage(event.target.value);
        });
        
        // Define o valor do seletor para o idioma atual
        languageSelector.value = this.currentLocale;
        console.log(`[DashboardI18n] Seletor de idiomas configurado para: ${this.currentLocale}`);
    }
    
    /**
     * Configura listener para mudanças no localStorage (para sincronizar idioma entre módulos)
     */
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'locale' && event.newValue !== this.currentLocale) {
                console.log(`[i18n] Idioma alterado externamente para: ${event.newValue}`);
                this.currentLocale = event.newValue;
                localStorage.setItem('locale', this.currentLocale); // Garantir consistência
                this.updateUI();
                
                // Disparar evento global para sincronizar todos os módulos
                document.dispatchEvent(new CustomEvent('languageChanged', {
                    detail: { locale: this.currentLocale }
                }));
            }
        });
        
        // Adicionar listener para eventos globais de mudança de idioma
        document.addEventListener('languageChanged', (event) => {
            if (event.detail.locale !== this.currentLocale) {
                this.currentLocale = event.detail.locale;
                this.updateUI();
            }
        });
        
        console.log('[DashboardI18n] Listener de storage configurado');
    }
    
    /**
     * Muda o idioma da aplicação
     * @param {string} locale - Novo idioma
     */
    changeLanguage(locale) {
        // Verifica se o idioma é suportado
        if (!this.supportedLocales.includes(locale)) {
            console.error(`[DashboardI18n] Idioma não suportado: ${locale}`);
            return;
        }
        
        console.log(`[DashboardI18n] Alterando idioma para: ${locale}`);
        
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
            
            console.log(`[DashboardI18n] Atualizando interface com idioma: ${localeCode} (${localeVar})`);
            
            // Usa as traduções já carregadas via tags <script>
            if (window[localeVar]) {
                this.translations[localeCode] = window[localeVar];
                
                // Atualiza todos os elementos com o atributo data-i18n
                const elements = document.querySelectorAll('[data-i18n]');
                console.log(`[DashboardI18n] Traduzindo ${elements.length} elementos com data-i18n`);
                
                elements.forEach(element => {
                    const key = element.getAttribute('data-i18n');
                    const translation = this.translate(key);
                    
                    if (translation) {
                        element.textContent = translation;
                    }
                });
                
                // Atualiza os atributos com data-i18n-attr
                const attrElements = document.querySelectorAll('[data-i18n-attr]');
                console.log(`[DashboardI18n] Traduzindo ${attrElements.length} elementos com data-i18n-attr`);
                
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
                console.log(`[DashboardI18n] Traduzindo ${titleElements.length} elementos com data-i18n-title`);
                
                titleElements.forEach(element => {
                    const key = element.getAttribute('data-i18n-title');
                    if (!key) return;
                    
                    const translation = this.translate(key);
                    if (translation) {
                        element.setAttribute('title', translation);
                    }
                });
                
                // Dispara evento personalizado para notificar que as traduções foram atualizadas
                document.dispatchEvent(new CustomEvent('dashboard:translations:updated', { 
                    detail: { locale: localeCode } 
                }));
                
                console.log('[DashboardI18n] Interface atualizada com sucesso');
            } else {
                console.warn(`[DashboardI18n] Traduções para ${localeCode} não encontradas. Verifique se o arquivo foi carregado corretamente.`);
            }
        } catch (error) {
            console.error("[DashboardI18n] Erro ao atualizar a interface com as traduções:", error);
        }
    }
    
    /**
     * Traduz uma chave para o idioma atual
     * @param {string} key - Chave de tradução (formato: "section.key")
     * @returns {string} Texto traduzido ou a própria chave se não encontrada
     */
    translate(key) {
        if (!key) {
            console.warn('[DashboardI18n] Tentativa de tradução com chave vazia');
            return '';
        }
        
        try {
            // Log de depuração
            console.log(`[DashboardI18n] Traduzindo chave: "${key}" para idioma: ${this.currentLocale}`);
            
            // Divide a chave em seções (ex: "header.login" -> ["header", "login"])
            const parts = key.split('.');
            
            // Obtém as traduções para o idioma atual
            const translations = this.translations[this.currentLocale];
            if (!translations) {
                console.warn(`[DashboardI18n] Traduções não encontradas para idioma: ${this.currentLocale}`);
                
                // Verificar se temos as traduções na variável global
                const localeVar = this.currentLocale.replace('-', '_');
                if (window[localeVar]) {
                    console.log(`[DashboardI18n] Usando traduções da variável global: ${localeVar}`);
                    this.translations[this.currentLocale] = window[localeVar];
                    // Tentar novamente
                    return this.translate(key);
                }
                
                return key;
            }
            
            // Navega pela estrutura de traduções seguindo as partes da chave
            let result = translations;
            let navigationPath = '';
            
            for (const part of parts) {
                navigationPath += (navigationPath ? '.' : '') + part;
                
                if (result && result[part] !== undefined) {
                    result = result[part];
                } else {
                    console.warn(`[DashboardI18n] Tradução não encontrada para caminho: ${navigationPath}`);
                    return key;
                }
            }
            
            // Se o resultado for um objeto e não uma string, retorna a chave
            if (typeof result === 'object') {
                console.warn(`[DashboardI18n] Resultado da tradução é um objeto e não um texto: ${key}`);
                return key;
            }
            
            console.log(`[DashboardI18n] Tradução encontrada: "${result}" para chave: "${key}"`);
            return result;
        } catch (error) {
            console.error(`[DashboardI18n] Erro ao traduzir a chave "${key}":`, error);
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
            
            // Traduzir atributo title se tiver data-i18n-title
            if (element.hasAttribute('data-i18n-title')) {
                const key = element.getAttribute('data-i18n-title');
                const translation = this.translate(key);
                if (translation) {
                    element.setAttribute('title', translation);
                }
            }
            
            // Traduzir elementos filhos
            const childrenWithI18n = element.querySelectorAll('[data-i18n]');
            childrenWithI18n.forEach(child => {
                const key = child.getAttribute('data-i18n');
                const translation = this.translate(key);
                if (translation) {
                    child.textContent = translation;
                }
            });
            
            // Traduzir atributos de elementos filhos
            const childrenWithI18nAttr = element.querySelectorAll('[data-i18n-attr]');
            childrenWithI18nAttr.forEach(child => {
                const attrSpec = child.getAttribute('data-i18n-attr');
                if (!attrSpec) return;
                
                const attrPairs = attrSpec.split(',');
                attrPairs.forEach(pair => {
                    const [attr, key] = pair.split(':');
                    if (!attr || !key) return;
                    
                    const translation = this.translate(key);
                    if (translation) {
                        child.setAttribute(attr, translation);
                    }
                });
            });
            
            // Traduzir atributos title de elementos filhos
            const childrenWithI18nTitle = element.querySelectorAll('[data-i18n-title]');
            childrenWithI18nTitle.forEach(child => {
                const key = child.getAttribute('data-i18n-title');
                if (!key) return;
                
                const translation = this.translate(key);
                if (translation) {
                    child.setAttribute('title', translation);
                }
            });
            
            console.log('[DashboardI18n] Elemento traduzido dinamicamente:', element);
        } catch (error) {
            console.error('[DashboardI18n] Erro ao traduzir elemento dinamicamente:', error);
        }
    }
}

// Cria uma instância global do gerenciador de idiomas
window.dashboardI18n = new DashboardI18nManager(); 