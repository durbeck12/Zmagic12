/**
 * Script de diagnóstico para o iframe
 * Este script verifica se o iframe está visível e exibindo o conteúdo corretamente
 * 
 * Modificado para evitar loops infinitos de verificação
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Iniciando diagnóstico único do iframe...');
    
    // Executar apenas uma vez após o carregamento da página
    setTimeout(() => {
        checkAndFixIframe();
        console.log('✅ Diagnóstico inicial do iframe concluído');
    }, 1000);
});

function startIframeCheck() {
    // Função mantida para compatibilidade, mas não configura mais verificação periódica
    console.log('🔍 Executando verificação manual do iframe...');
    checkAndFixIframe();
}

function checkAndFixIframe() {
    const iframe = document.querySelector('#module-iframe');
    const container = document.querySelector('#module-container');
    
    if (!iframe || !container) {
        console.error('❌ Iframe ou container não encontrados!');
        return;
    }
    
    console.log('🔍 Verificando iframe...');
    
    // Verificar visibilidade do container
    const containerDisplay = window.getComputedStyle(container).display;
    const containerVisibility = window.getComputedStyle(container).visibility;
    
    if (containerDisplay === 'none' || containerVisibility === 'hidden') {
        console.warn('⚠️ Container do iframe não está visível!');
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.position = 'absolute';
        container.style.top = 'var(--ribbon-height)';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = 'calc(100vh - var(--ribbon-height))';
        console.log('✅ Corrigida visibilidade do container');
    }
    
    // Verificar visibilidade do iframe
    const iframeDisplay = window.getComputedStyle(iframe).display;
    const iframeVisibility = window.getComputedStyle(iframe).visibility;
    
    if (iframeDisplay === 'none' || iframeVisibility === 'hidden') {
        console.warn('⚠️ Iframe não está visível!');
        iframe.style.display = 'block';
        iframe.style.visibility = 'visible';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        console.log('✅ Corrigida visibilidade do iframe');
    }
    
    // Verificar URL do iframe
    if (!iframe.src || iframe.src === 'about:blank' || iframe.src === 'about:srcdoc') {
        console.warn('⚠️ Iframe sem URL válida!');
        // Definir URL padrão do dashboard
        iframe.src = '/public/components/modules/dashboard/index.html';
        console.log('✅ Definida URL padrão do iframe');
    }
    
    // Verificar dimensões do iframe
    const iframeRect = iframe.getBoundingClientRect();
    if (iframeRect.width === 0 || iframeRect.height === 0) {
        console.warn('⚠️ Iframe com dimensões zero!');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        container.style.width = '100%';
        container.style.height = 'calc(100vh - var(--ribbon-height))';
        console.log('✅ Corrigidas dimensões do iframe');
    }
    
    // Verificar se o iframe está no DOM
    if (!document.body.contains(iframe)) {
        console.error('❌ Iframe não está no DOM!');
        if (container) {
            console.log('🔄 Tentando reinserir o iframe...');
            const newIframe = document.createElement('iframe');
            newIframe.id = 'module-iframe';
            newIframe.style.width = '100%';
            newIframe.style.height = '100%';
            newIframe.style.border = 'none';
            newIframe.style.display = 'block';
            newIframe.style.visibility = 'visible';
            newIframe.src = '/public/components/modules/dashboard/index.html';
            container.appendChild(newIframe);
            console.log('✅ Iframe reinserido no DOM');
        }
    }
    
    console.log('✅ Verificação do iframe concluída', {
        containerVisível: `${containerDisplay} / ${containerVisibility}`,
        iframeVisível: `${iframeDisplay} / ${iframeVisibility}`,
        iframeDimensões: `${iframeRect.width}x${iframeRect.height}`,
        iframeSrc: iframe.src
    });
}

// Exportar funções para uso global
window.debugIframe = {
    checkAndFixIframe,
    startIframeCheck,
    // Função para verificar manualmente quando necessário
    runCheck: function() {
        console.log('🔍 Executando verificação manual do iframe...');
        checkAndFixIframe();
    }
}; 