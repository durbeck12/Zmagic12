/**
 * Documentação do ZMagic12
 * Script para gerenciar navegação e interações na página de documentação
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Documentation module loaded');
    
    // Inicializa a navegação
    initDocumentationNav();
    
    // Inicializa interação com vídeos
    initVideoPlaceholders();
    
    // Inicializa busca na documentação
    initDocumentationSearch();
    
    // Check if documentation i18n is loaded, if not, provide a fallback
    if (!window.documentationI18n) {
        console.warn("DocumentationI18n module not loaded, using fallback");
        // Create a minimal fallback i18n object
        window.documentationI18n = {
            setLanguage: function() { 
                console.warn("setLanguage called but documentationI18n is not fully loaded"); 
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
            // Use our documentation-specific i18n manager
            documentationI18n.setLanguage(selectedLanguage);
        });
        
        // Set the initial language based on localStorage or default to pt-PT
        const currentLanguage = localStorage.getItem('locale') || 'pt-PT';
        languageSelector.value = currentLanguage;
    }
});

/**
 * Inicializa a navegação entre seções da documentação
 */
function initDocumentationNav() {
    // Seleciona os links de navegação
    const navLinks = document.querySelectorAll('.documentation-nav a');
    
    // Adiciona o listener para cada link de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adiciona a classe active ao link clicado
            this.classList.add('active');
            
            // Obtém o id da seção a ser exibida
            const targetId = this.getAttribute('href').substring(1);
            
            // Oculta todas as seções
            const allSections = document.querySelectorAll('.doc-section');
            allSections.forEach(section => section.classList.remove('active'));
            
            // Exibe a seção alvo
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Scroll suave para o topo da seção em dispositivos móveis
                if (window.innerWidth < 992) {
                    const docContent = document.querySelector('.documentation-content');
                    docContent.scrollTop = 0;
                    
                    // Scroll para o topo em mobile
                    window.scrollTo({
                        top: document.querySelector('.documentation-content').offsetTop - 60,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Atualiza URL com o hash
            window.history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Navegação entre seções (próximo/anterior)
    const navButtons = document.querySelectorAll('.doc-navigation a');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtém o id da seção alvo
            const targetId = this.getAttribute('href').substring(1);
            
            // Clica no link correspondente na barra lateral
            const targetLink = document.querySelector(`.documentation-nav a[href="#${targetId}"]`);
            if (targetLink) {
                targetLink.click();
            }
        });
    });
    
    // Verifica se há hash na URL e navega para a seção correspondente
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.documentation-nav a[href="#${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

/**
 * Inicializa a interação com os placeholders de vídeo
 */
function initVideoPlaceholders() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            
            // Aqui você pode implementar a lógica para exibir o vídeo
            // Por exemplo, criar um iframe do YouTube ou Vimeo
            // Por enquanto, apenas exibiremos um alerta
            alert(`Reproduzindo vídeo: ${videoId}`);
            
            // Exemplo de como seria a implementação com um vídeo do YouTube:
            /*
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.width = '100%';
            iframe.height = '400';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            
            this.innerHTML = '';
            this.appendChild(iframe);
            this.style.padding = '0';
            */
        });
    });
}

/**
 * Inicializa a funcionalidade de busca na documentação
 */
function initDocumentationSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-button');
    
    // Função para realizar a busca
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            return;
        }
        
        // Obtém todas as seções da documentação
        const sections = document.querySelectorAll('.doc-section');
        let firstMatchFound = false;
        
        // Para cada seção, verifica se há correspondência
        sections.forEach(section => {
            const sectionContent = section.textContent.toLowerCase();
            
            if (sectionContent.includes(searchTerm)) {
                // Se ainda não encontrou uma correspondência, navegue para esta seção
                if (!firstMatchFound) {
                    const sectionId = section.id;
                    const targetLink = document.querySelector(`.documentation-nav a[href="#${sectionId}"]`);
                    if (targetLink) {
                        targetLink.click();
                        firstMatchFound = true;
                    }
                }
                
                // Destaca os resultados da busca (implementação simples)
                // Aqui você pode implementar uma lógica mais sofisticada para destacar os resultados
                section.querySelectorAll('p, li, h1, h2, h3').forEach(element => {
                    const originalText = element.textContent;
                    const lowerText = originalText.toLowerCase();
                    
                    if (lowerText.includes(searchTerm)) {
                        // Destaca o termo de busca com uma cor de fundo
                        // Isso é uma implementação simples; uma abordagem melhor seria usar uma biblioteca de highlight
                        const highlightedText = originalText.replace(
                            new RegExp(searchTerm, 'gi'),
                            match => `<span class="search-highlight" style="background-color: yellow;">${match}</span>`
                        );
                        element.innerHTML = highlightedText;
                    }
                });
            }
        });
        
        // Se não encontrou nenhuma correspondência, exibe uma mensagem
        if (!firstMatchFound) {
            alert('Nenhum resultado encontrado para: ' + searchTerm);
        }
    }
    
    // Evento de clique no botão de busca
    searchButton.addEventListener('click', performSearch);
    
    // Evento de tecla Enter no campo de busca
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
} 