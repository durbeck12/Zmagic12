/**
 * Ribbon Internationalization Module
 * Adaptado para a estrutura HTML existente
 */
class RibbonI18n {
    constructor() {
        this.currentLang = 'pt-PT';
        this.availableLangs = ['en-US', 'de-DE', 'es-ES', 'fr-FR', 'pt-PT', 'zh-CN'];
        this.initListeners();
    }

    // Inicializa os listeners para alteração de idioma
    initListeners() {
        // Aguarda o DOM estar pronto
        document.addEventListener('DOMContentLoaded', () => {
            const langSelector = document.getElementById('language-select');
            if (langSelector) {
                // Define o valor inicial do seletor
                langSelector.value = this.currentLang;
                
                // Adiciona listener para alterações
                langSelector.addEventListener('change', (e) => {
                    this.setLanguage(e.target.value);
                });
            }
            
            // Atualiza os textos iniciais
            this.updateRibbonText();
        });
    }

    // Altera o idioma
    setLanguage(langCode) {
        if (this.availableLangs.includes(langCode) && this.currentLang !== langCode) {
            this.currentLang = langCode;
            this.updateRibbonText();
            
            // Dispara evento para outros componentes
            const event = new CustomEvent('ribbonLanguageChanged', {
                detail: { language: langCode }
            });
            document.dispatchEvent(event);
            
            // Salva a preferência no localStorage
            localStorage.setItem('ribbon_language', langCode);
            
            return true;
        }
        return false;
    }

    // Atualiza todos os textos na ribbon
    updateRibbonText() {
        // Carrega traduções
        const translations = window[`ribbon_${this.currentLang.replace('-', '_')}`] || window.ribbon_en_US;
        if (!translations || !translations.ribbon || !translations.ribbon.tabs) {
            console.error(`Traduções não encontradas para ${this.currentLang}`);
            return;
        }

        // Efeito visual
        const ribbonContainer = document.querySelector('.ribbon-container');
        if (ribbonContainer) {
            ribbonContainer.style.opacity = '0.7';
            setTimeout(() => ribbonContainer.style.opacity = '1', 200);
        }

        // Atualiza abas
        document.querySelectorAll('.ribbon-tabs .ribbon-tab').forEach(tab => {
            const tabId = tab.getAttribute('data-tab');
            if (tabId && translations.ribbon.tabs[tabId]) {
                const tabLabel = tab.querySelector('.tab-label') || tab;
                tabLabel.textContent = translations.ribbon.tabs[tabId].label;
            }
        });

        // Atualiza grupos e botões
        Object.keys(translations.ribbon.tabs).forEach(tabId => {
            const tabContent = document.getElementById(`${tabId}-tab-content`);
            if (!tabContent) return;

            const tabTranslations = translations.ribbon.tabs[tabId];
            
            // Atualiza títulos dos grupos
            tabContent.querySelectorAll('.ribbon-group').forEach(group => {
                const groupId = group.getAttribute('data-group-id');
                const titleElement = group.querySelector('.ribbon-group-title');
                
                if (titleElement && groupId && tabTranslations.groups && tabTranslations.groups[groupId]) {
                    titleElement.textContent = tabTranslations.groups[groupId].title;
                }
            });

            // Atualiza textos dos botões
            tabContent.querySelectorAll('.ribbon-button').forEach(button => {
                const buttonId = button.id;
                const textElement = button.querySelector('.ribbon-button-text');
                
                if (textElement && buttonId) {
                    // Percorre todos os grupos procurando este botão
                    Object.keys(tabTranslations.groups || {}).forEach(groupId => {
                        const group = tabTranslations.groups[groupId];
                        if (group.buttons && group.buttons[buttonId]) {
                            textElement.textContent = group.buttons[buttonId].label;
                        }
                    });
                }
            });
        });
    }
}

// Inicializa quando o script carrega
window.RibbonI18n = new RibbonI18n();

// Recupera a preferência de idioma salva, se existir
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('ribbon_language');
    if (savedLang && window.RibbonI18n) {
        window.RibbonI18n.setLanguage(savedLang);
    }
});
