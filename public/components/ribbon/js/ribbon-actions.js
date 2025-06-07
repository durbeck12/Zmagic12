/**
 * Ribbon Actions
 * Este arquivo contém implementações para ações específicas da ribbon.
 * As ações aqui definidas são mapeadas para os botões da ribbon via propriedade 'action' na configuração.
 */

class RibbonActions {
    constructor() {
        console.log('[RIBBON-ACTIONS] Inicializando ações da ribbon');
        this.bindEvents();
    }

    /**
     * Configura os listeners de eventos para as ações da ribbon
     */
    bindEvents() {
        // Escutar por eventos de ação do ribbon
        document.addEventListener('ribbon:action', (event) => {
            const { action, buttonId } = event.detail;
            this.handleAction(action, buttonId);
        });
    }

    /**
     * Manipula as ações da ribbon baseado no nome da ação
     * @param {string} action - Nome da ação a ser executada
     * @param {string} buttonId - ID do botão que disparou a ação
     */
    handleAction(action, buttonId) {
        console.log(`[RIBBON-ACTIONS] Manipulando ação: ${action}, botão: ${buttonId}`);
        
        // Verificar qual ação foi solicitada
        switch (action) {
            case 'exitAccount':
                this.exitAccount();
                break;
            // Adicionar outros casos aqui conforme necessário
            default:
                console.log(`[RIBBON-ACTIONS] Ação não implementada: ${action}`);
        }
    }

    /**
     * Executa o logout do sistema
     * Esta função é chamada quando o botão de logout é clicado
     */
    exitAccount() {
        console.log('[RIBBON-ACTIONS] Executando ação de logout (exitAccount)');
        
        try {
            // Verificar se o AuthManager está disponível
            if (window.AuthManager && typeof window.AuthManager.logout === 'function') {
                console.log('[RIBBON-ACTIONS] AuthManager encontrado, executando logout');
                
                // Executar o logout através do AuthManager
                window.AuthManager.logout()
                    .then(() => {
                        console.log('[RIBBON-ACTIONS] Logout realizado com sucesso');
                        
                        // Redirecionar para a página de login
                        window.location.href = '/core/auth/login.html';
                    })
                    .catch(error => {
                        console.error('[RIBBON-ACTIONS] Erro ao executar logout:', error);
                        alert('Erro ao fazer logout. Por favor, tente novamente.');
                    });
            } else {
                console.error('[RIBBON-ACTIONS] AuthManager não disponível para logout');
                
                // Tentar abordagem alternativa: limpar localStorage e redirecionar
                localStorage.removeItem('userData');
                localStorage.removeItem('authToken');
                localStorage.removeItem('supabase.auth.token');
                
                // Redirecionar para a página de login
                window.location.href = '/core/auth/login.html';
            }
        } catch (error) {
            console.error('[RIBBON-ACTIONS] Erro ao processar ação de logout:', error);
            
            // Em caso de erro, tentar redirecionar para login
            window.location.href = '/core/auth/login.html';
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('[RIBBON-ACTIONS] DOM carregado, inicializando RibbonActions');
    window.ribbonActions = new RibbonActions();
}); 