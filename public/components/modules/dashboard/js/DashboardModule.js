import SupabaseConfig from './utils/SupabaseClient.js';

class DashboardModule {
    constructor() {
        this._errorHandlerPromise = import('./utils/ErrorHandler.js').then(module => module.default);
    }

    /**
     * Inicializa o dashboard
     */
    async initialize() {
        try {
            // ... existing code ...
        } catch (error) {
            const errorHandler = await this._errorHandlerPromise;
            errorHandler.handleError(error, { 
                context: 'dashboard-initialization',
                showToUser: true
            });
            this.uiManager.showError(error);
            return false;
        }
    }

    /**
     * Carrega os projetos do usuário
     */
    async loadUserProjects() {
        try {
            // ... existing code ...
        } catch (error) {
            const errorHandler = await this._errorHandlerPromise;
            errorHandler.handleError(error, { 
                context: 'loading-user-projects',
                showToUser: true
            });
            this.uiManager.showError(error);
            return false;
        }
    }

    /**
     * Carrega um projeto específico
     */
    async loadProject(projectId) {
        try {
            // ... existing code ...
        } catch (error) {
            const errorHandler = await this._errorHandlerPromise;
            errorHandler.handleError(error, { 
                context: 'loading-project',
                showToUser: true,
                metadata: { projectId }
            });
            this.uiManager.showError(error);
            return null;
        }
    }

    /**
     * Manipula erros do dashboard
     * @deprecated Use ErrorHandler.handleError instead
     */
    handleError(error, context = '') {
        console.warn('DashboardModule.handleError is deprecated. Please use ErrorHandler.handleError instead.');
        this._errorHandlerPromise.then(errorHandler => {
            errorHandler.handleError(error, { context, showToUser: true });
        });
        
        // Mantenha comportamento legado para compatibilidade
        console.error(`Dashboard error (${context}):`, error);
        this.uiManager.showError(error.message || 'Ocorreu um erro ao processar sua solicitação.');
    }
} 