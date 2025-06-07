document.addEventListener('DOMContentLoaded', function() {
    console.log('Marketplace module loaded');
    
    // Check if marketplace i18n is loaded, if not, provide a fallback
    if (!window.marketplaceI18n) {
        console.warn("MarketplaceI18n module not loaded, using fallback");
        // Create a minimal fallback i18n object
        window.marketplaceI18n = {
            setLanguage: function() { 
                console.warn("setLanguage called but marketplaceI18n is not fully loaded"); 
            },
            translate: function(key) {
                // Simple fallback to return the last part of the key
                return key.split('.').pop();
            }
        };
    }
    
    // Initialize language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;
            // Use our marketplace-specific i18n manager
            marketplaceI18n.setLanguage(selectedLanguage);
        });
        
        // Set the initial language based on localStorage or default to pt-PT
        const currentLanguage = localStorage.getItem('locale') || 'pt-PT';
        languageSelector.value = currentLanguage;
    }
    
    // Make search button functional (currently just a placeholder)
    const searchButton = document.querySelector('.marketplace-search button');
    const searchInput = document.querySelector('.marketplace-search input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('Search term:', searchTerm);
                // Will be implemented in future when marketplace is fully developed
                alert(marketplaceI18n.translate('marketplace.coming_soon.message'));
            }
        });
        
        // Allow search with Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
}); 