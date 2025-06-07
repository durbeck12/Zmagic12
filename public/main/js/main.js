/**
 * Script principal para a página inicial do ZMagic12
 * Inicializa funcionalidades e manipula a interface
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o sistema de i18n (já foi carregado no head)
    // O i18n já é inicializado automaticamente quando seu script é carregado
    
    // Configura os eventos dos links
    setupNavigation();
    
    // Inicializa outros comportamentos da página principal
    initializeFeatureCards();
});

/**
 * Configura a navegação da página
 */
function setupNavigation() {
    // Adiciona rolagem suave para links de ancoragem
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) {
                // Se o href é apenas "#" (como no logo), volta ao topo da página
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Detecta o scroll para efeitos visuais no cabeçalho
    let header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            // Adiciona classe para cabeçalho com fundo mais escuro quando scrollar
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Inicializa os comportamentos dos cards de recursos
 */
function initializeFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        // Adiciona efeito de hover de forma programática para controle adicional
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
        
        // Configura animação ao aparecer os cards no viewport
        observeCardVisibility(card);
    });
}

/**
 * Observa quando um card entra no viewport para adicionar animações
 * @param {HTMLElement} element - Elemento a ser observado
 */
function observeCardVisibility(element) {
    // Cria o observador de interseção
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona uma classe para animar quando o elemento se torna visível
                element.classList.add('visible');
                // Parar de observar depois que o elemento já foi animado
                observer.unobserve(element);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.2 // Gatilho quando 20% do elemento está visível
    });
    
    // Inicia a observação
    observer.observe(element);
} 