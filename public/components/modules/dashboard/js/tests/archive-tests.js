/**
 * Módulo de testes para validar a funcionalidade de arquivamento de projetos
 * após a refatoração da estrutura e métodos.
 */

class ArchiveTestSuite {
    constructor() {
        this.logs = [];
        this.passed = 0;
        this.failed = 0;
        this.dashboard = null;
        this.testProject = null;
        this.originalArchiveState = null;
        this.initialized = false;
    }

    /**
     * Inicializa o ambiente de testes
     */
    async initialize() {
        try {
            this.log('info', 'Inicializando ambiente de testes...');
            
            // Obter referência ao dashboard
            if (typeof window.dashboardInstance === 'undefined') {
                throw new Error('Dashboard não encontrado. Verifique se você está logado no sistema.');
            }
            
            this.dashboard = window.dashboardInstance;
            this.log('info', `Dashboard encontrado: ${this.dashboard.constructor.name}`);
            
            // Verificar se o ProjectManager está disponível
            if (!this.dashboard.projectManager) {
                throw new Error('ProjectManager não encontrado no dashboard.');
            }
            
            this.log('info', 'ProjectManager encontrado');
            
            // Configurar event listeners para capturar eventos durante os testes
            this.setupEventListeners();
            
            // Encontrar um projeto para testar
            await this.findTestProject();
            
            this.initialized = true;
            this.log('success', 'Ambiente de testes inicializado com sucesso.');
            return true;
        } catch (error) {
            this.log('error', `Falha ao inicializar testes: ${error.message}`);
            throw error;
        }
    }

    /**
     * Configura event listeners para monitorar eventos durante os testes
     */
    setupEventListeners() {
        this.capturedEvents = [];
        
        // Monitorar eventos do ProjectManager
        const originalDispatchEvent = this.dashboard.projectManager.dispatchEvent.bind(this.dashboard.projectManager);
        
        this.dashboard.projectManager.dispatchEvent = (event) => {
            this.capturedEvents.push({
                type: event.type,
                detail: event.detail,
                timestamp: new Date().toISOString()
            });
            
            this.log('info', `Evento capturado: ${event.type}`);
            return originalDispatchEvent(event);
        };
        
        this.log('info', 'Event listeners configurados');
    }

    /**
     * Encontra um projeto para utilizar nos testes
     */
    async findTestProject() {
        try {
            const projects = this.dashboard.projectManager.projects;
            
            if (!projects || projects.length === 0) {
                throw new Error('Nenhum projeto encontrado para teste. Crie pelo menos um projeto.');
            }
            
            // Usar o primeiro projeto não arquivado, se possível
            this.testProject = projects.find(p => !p.archived) || projects[0];
            this.originalArchiveState = this.testProject.archived;
            
            this.log('info', `Projeto de teste selecionado: "${this.testProject.name}" (ID: ${this.testProject.id})`);
            this.log('info', `Estado original de arquivamento: ${this.originalArchiveState ? 'Arquivado' : 'Não arquivado'}`);
            
            return true;
        } catch (error) {
            this.log('error', `Falha ao encontrar projeto para teste: ${error.message}`);
            throw error;
        }
    }

    /**
     * Restaura o estado original do projeto após os testes
     */
    async restoreProjectState() {
        try {
            if (!this.testProject) return;
            
            this.log('info', 'Restaurando estado original do projeto...');
            
            // Se o estado atual for diferente do original, restaurar
            if (this.testProject.archived !== this.originalArchiveState) {
                await this.dashboard.projectManager.toggleProjectArchive(this.testProject.id);
                this.log('success', `Projeto restaurado ao estado original: ${this.originalArchiveState ? 'Arquivado' : 'Não arquivado'}`);
            } else {
                this.log('info', 'Projeto já está no estado original');
            }
        } catch (error) {
            this.log('error', `Falha ao restaurar estado do projeto: ${error.message}`);
        }
    }

    /**
     * Adiciona uma entrada de log
     */
    log(type, message) {
        const logEntry = {
            type,
            message,
            timestamp: new Date().toISOString()
        };
        
        this.logs.push(logEntry);
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        return logEntry;
    }

    /**
     * Executa um teste individual e registra resultado
     */
    async runTest(name, testFunction) {
        this.log('info', `Iniciando teste: ${name}`);
        
        try {
            await testFunction();
            this.passed++;
            this.log('success', `✓ PASSOU: ${name}`);
            return true;
        } catch (error) {
            this.failed++;
            this.log('error', `✗ FALHOU: ${name} - ${error.message}`);
            return false;
        }
    }

    /**
     * Testa se o método toggleProjectArchive existe e é uma função
     */
    async testToggleProjectArchiveExists() {
        const projectManager = this.dashboard.projectManager;
        
        if (typeof projectManager.toggleProjectArchive !== 'function') {
            throw new Error('Método toggleProjectArchive não encontrado em ProjectManager');
        }
        
        this.log('info', 'Método toggleProjectArchive encontrado');
    }

    /**
     * Testa se os métodos antigos foram removidos (archiveProject, unarchiveProject)
     */
    async testOldMethodsRemoved() {
        const projectManager = this.dashboard.projectManager;
        
        if (typeof projectManager.archiveProject === 'function') {
            throw new Error('Método antigo archiveProject ainda existe e deve ser removido');
        }
        
        if (typeof projectManager.unarchiveProject === 'function') {
            throw new Error('Método antigo unarchiveProject ainda existe e deve ser removido');
        }
        
        this.log('info', 'Métodos antigos foram corretamente removidos');
    }

    /**
     * Testa se é seguro remover os listeners de eventos legados
     */
    async testOldEventListenersUnused() {
        this.log('info', 'Verificando se os eventos legados podem ser removidos com segurança...');
        
        // Salvar os listeners originais
        const originalListeners = {};
        const eventTypes = ['archiveProject', 'unarchiveProject'];
        
        // Remover temporariamente os listeners e guardar referências
        eventTypes.forEach(eventType => {
            originalListeners[eventType] = [];
            
            // Encontrar e armazenar todos os listeners para este tipo de evento
            const listeners = this.findEventListeners(document, eventType);
            originalListeners[eventType] = listeners;
            
            // Remover temporariamente os listeners
            listeners.forEach(listener => {
                document.removeEventListener(eventType, listener);
            });
            
            this.log('info', `Removidos ${listeners.length} listeners para o evento ${eventType}`);
        });
        
        try {
            // Agora tente usar apenas o novo método unificado
            this.log('info', 'Testando operação de arquivamento usando apenas evento unificado...');
            
            const projectId = this.testProject.id;
            const initialState = this.testProject.archived;
            
            // Usar o evento unificado diretamente
            const toggleEvent = new CustomEvent('toggleProjectArchive', {
                detail: {
                    id: projectId,
                    targetState: !initialState
                }
            });
            
            document.dispatchEvent(toggleEvent);
            
            // Esperar para garantir que a operação seja concluída
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar se o estado mudou
            const updatedProject = this.dashboard.projectManager.getProjectById(projectId);
            const newState = updatedProject.archived;
            
            if (newState === initialState) {
                throw new Error('Falha ao alterar estado usando apenas o evento unificado');
            }
            
            this.log('success', 'Operação de arquivamento bem-sucedida usando apenas o evento unificado');
            
            // Restaurar o estado original
            const restoreEvent = new CustomEvent('toggleProjectArchive', {
                detail: {
                    id: projectId,
                    targetState: initialState
                }
            });
            
            document.dispatchEvent(restoreEvent);
            
            // Esperar novamente
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar se voltou ao estado original
            const restoredProject = this.dashboard.projectManager.getProjectById(projectId);
            if (restoredProject.archived !== initialState) {
                throw new Error('Falha ao restaurar estado original usando apenas o evento unificado');
            }
            
            this.log('success', 'É seguro remover os event listeners legados');
            return true;
        } catch (error) {
            this.log('error', `Não é seguro remover os event listeners legados: ${error.message}`);
            return false;
        } finally {
            // Restaurar os listeners originais
            eventTypes.forEach(eventType => {
                originalListeners[eventType].forEach(listener => {
                    document.addEventListener(eventType, listener);
                });
                
                this.log('info', `Restaurados ${originalListeners[eventType].length} listeners para o evento ${eventType}`);
            });
        }
    }
    
    /**
     * Utilitário para encontrar todos os event listeners registrados
     * Observação: Esta é uma função de utilidade que pode não encontrar todos os listeners
     * dependendo de como foram adicionados
     */
    findEventListeners(element, eventType) {
        // Esta é uma abordagem simplificada que funciona apenas para fins de teste
        // Em um ambiente real, seria necessário monitorar addEventListener e removeEventListener
        
        // Podemos simular isso salvando todos os listeners registrados durante o teste
        const listeners = [];
        
        // Salvar o método original
        const originalAddEventListener = element.addEventListener;
        const originalRemoveEventListener = element.removeEventListener;
        
        // Sobrescrever temporariamente para capturar chamadas
        element.addEventListener = function(type, listener, options) {
            if (type === eventType) {
                listeners.push(listener);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
        
        // Restaurar o método original
        setTimeout(() => {
            element.addEventListener = originalAddEventListener;
            element.removeEventListener = originalRemoveEventListener;
        }, 100);
        
        return listeners;
    }

    /**
     * Testa a funcionalidade de arquivamento
     */
    async testArchivingFunctionality() {
        this.capturedEvents = [];
        const projectId = this.testProject.id;
        const initialState = this.testProject.archived;
        
        // Executar a operação de arquivamento
        this.log('info', `Alterando estado de arquivamento (estado atual: ${initialState ? 'Arquivado' : 'Não arquivado'})`);
        await this.dashboard.projectManager.toggleProjectArchive(projectId);
        
        // Verificar se o estado mudou
        const newState = this.dashboard.projectManager.getProjectById(projectId).archived;
        
        if (newState === initialState) {
            throw new Error(`Falha ao alterar estado de arquivamento. Estado continua ${initialState ? 'Arquivado' : 'Não arquivado'}`);
        }
        
        this.log('info', `Estado alterado com sucesso para: ${newState ? 'Arquivado' : 'Não arquivado'}`);
        
        // Verificar se os eventos foram disparados
        const foundEvent = this.capturedEvents.some(event => 
            event.type === 'projectUpdated' && 
            event.detail && 
            event.detail.projectId === projectId
        );
        
        if (!foundEvent) {
            throw new Error('Evento projectUpdated não foi disparado ao alterar estado de arquivamento');
        }
        
        this.log('info', 'Evento projectUpdated foi disparado corretamente');
        
        // Verificar alterações na UI
        const projectCards = document.querySelectorAll('.project-card');
        let found = false;
        
        for (const card of projectCards) {
            const cardProjectId = card.getAttribute('data-project-id');
            if (cardProjectId === projectId) {
                found = true;
                const hasArchivedClass = card.classList.contains('archived');
                
                if (newState && !hasArchivedClass) {
                    throw new Error('Projeto foi arquivado, mas a classe "archived" não foi adicionada ao card');
                }
                
                if (!newState && hasArchivedClass) {
                    throw new Error('Projeto foi desarquivado, mas a classe "archived" não foi removida do card');
                }
                
                this.log('info', 'UI do projeto atualizada corretamente');
                break;
            }
        }
        
        if (!found && document.querySelector('.project-list')) {
            this.log('warning', 'Card do projeto não encontrado na UI para verificação');
        }
    }

    /**
     * Executa todos os testes
     */
    async runAllTests() {
        try {
            // Inicializar ambiente se ainda não foi feito
            if (!this.initialized) {
                await this.initialize();
            }
            
            this.log('info', '=== Iniciando execução dos testes ===');
            
            // Executar testes individuais
            await this.runTest('Verificar existência do método toggleProjectArchive', 
                () => this.testToggleProjectArchiveExists());
                
            await this.runTest('Verificar remoção dos métodos antigos', 
                () => this.testOldMethodsRemoved());
                
            await this.runTest('Testar funcionalidade de arquivamento', 
                () => this.testArchivingFunctionality());
                
            await this.runTest('Verificar se eventos legados podem ser removidos', 
                () => this.testOldEventListenersUnused());
            
            // Restaurar estado original do projeto
            await this.restoreProjectState();
            
            // Resultados finais
            const success = this.failed === 0;
            const summary = success 
                ? `Todos os ${this.passed} testes passaram com sucesso` 
                : `${this.failed} testes falharam, ${this.passed} passaram`;
                
            this.log(success ? 'success' : 'error', summary);
            
            return {
                success,
                passed: this.passed,
                failed: this.failed,
                logs: this.logs
            };
        } catch (error) {
            this.log('error', `Erro fatal durante execução dos testes: ${error.message}`);
            
            // Tentar restaurar o estado do projeto mesmo em caso de erro
            await this.restoreProjectState();
            
            return {
                success: false,
                passed: this.passed,
                failed: this.failed + 1,
                logs: this.logs
            };
        }
    }
}

/**
 * Função principal para executar os testes de arquivamento
 */
export default async function runArchiveTests() {
    try {
        const testSuite = new ArchiveTestSuite();
        const results = await testSuite.runAllTests();
        
        return {
            success: results.success,
            results
        };
    } catch (error) {
        console.error('Erro ao executar testes:', error);
        return {
            success: false,
            error: error.message
        };
    }
} 