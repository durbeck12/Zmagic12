import UserManager from '../managers/UserManager.js';
import ProjectManager from '../managers/ProjectManager.js';
import UIManager from '../ui/UIManager.js';

class DashboardModule {
    constructor() {
        this.userManager = new UserManager();
        this.projectManager = new ProjectManager();
        this.uiManager = new UIManager();
        this.currentUser = null;
        this.currentTab = 'projects';
        this.isLoading = false;
        this.ribbonCommands = {
            // Mapeamento de comandos do ribbon para métodos desta classe
            'showNewProjectModal': this.showNewProjectModal.bind(this),
            'switchTab': this.handleTabChangeCommand.bind(this),
            'reloadProjects': this.reloadProjects.bind(this)
        };
    }

    async init() {
        try {
            this.uiManager.showLoading();
            this.isLoading = true;

            // Configurar listener para comunicação com o ribbon
            this.setupRibbonCommunication();

            // Verificar autenticação
            this.currentUser = await this.userManager.getCurrentUser();
            
            if (!this.currentUser) {
                window.location.href = '/login';
                return;
            }

            // Atualizar informações do usuário na UI
            this.uiManager.updateUserInfo(this.currentUser);

            // Atualizar ProjectManager com dados do usuário
            this.projectManager.userData = this.currentUser;
            
            // Passar a referência do UIManager para o ProjectManager
            this.projectManager.setUIManager(this.uiManager);

            // Verificar hash da URL para definir a tab inicial
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);
                if (['projects', 'archived', 'templates'].includes(hash)) {
                    console.log('[DashboardModule] Tab inicial definida pelo hash:', hash);
                    this.currentTab = hash;
                }
            }

            // Carregar projetos iniciais
            await this.loadInitialData();

            // Inicializar listeners de eventos
            this.initEventListeners();

            // Se estivermos na tab 'projects', verificar se precisamos forçar uma atualização
            // Isso é especialmente útil após a criação de um novo projeto
            if (this.currentTab === 'projects') {
                // Esperar um momento para garantir que a UI esteja pronta
                setTimeout(async () => {
                    console.log('[DashboardModule] Verificando se é necessário forçar atualização...');
                    
                    // Recarregar a lista de projetos do servidor (ignorando o cache)
                    try {
                        this.uiManager.showLoading();
                        const freshProjects = await this.projectManager.loadUserProjects(this.currentUser.id, true);
                        console.log('[DashboardModule] Atualizando UI com dados frescos do servidor:', freshProjects.length);
                        this.uiManager.renderProjects(freshProjects, 'projects');
                        this.uiManager.hideLoading();
                    } catch (error) {
                        console.error('[DashboardModule] Erro ao atualizar projetos:', error);
                        this.uiManager.hideLoading();
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            this.uiManager.showError('Erro ao carregar o dashboard. Por favor, recarregue a página.', 'dashboard.error.load_dashboard');
        } finally {
            this.isLoading = false;
            this.uiManager.hideLoading();
        }
    }

    async loadInitialData() {
        try {
            this.uiManager.showLoading();
            
            let data = [];
            // Carregar dados de acordo com a tab atual (que pode ter sido definida pelo hash)
            switch (this.currentTab) {
                case 'projects':
                    data = await this.projectManager.loadUserProjects(this.currentUser.id);
                    break;
                case 'archived':
                    data = await this.projectManager.loadArchivedProjects(this.currentUser.id);
                    break;
                case 'templates':
                    data = await this.projectManager.loadTemplates(this.currentUser.id);
                    break;
                default:
                    data = await this.projectManager.loadUserProjects(this.currentUser.id);
                    break;
            }
            
            // Atualizar a UI para mostrar a tab correta
            this.uiManager.updateActiveTab(this.currentTab);
            this.uiManager.renderProjects(data, this.currentTab);
            
            console.log(`[DashboardModule] Dados iniciais carregados para tab '${this.currentTab}': ${data.length} itens`);
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.uiManager.showError('Erro ao carregar projetos.', 'dashboard.error.load_projects');
            throw error; // Propagar erro para tratamento superior
        } finally {
            this.uiManager.hideLoading();
        }
    }

    initEventListeners() {
        // Listener para mudança de tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                if (this.isLoading) return; // Prevenir múltiplos cliques durante carregamento
                
                const tabName = button.dataset.tab;
                await this.handleTabChange(tabName);
            });
        });

        // Listener para criação de novo projeto
        document.getElementById('newProjectBtn')?.addEventListener('click', () => {
            if (!this.isLoading) {
                this.uiManager.showNewProjectModal();
            }
        });

        // Listener para recarregar projetos ativos
        document.addEventListener('reloadActiveProjects', async () => {
            try {
                console.log('[DashboardModule] Recarregando projetos ativos do servidor...');
                this.uiManager.showLoading();
                
                // Recarregar projetos do servidor
                const projects = await this.projectManager.loadUserProjects(this.currentUser.id, true); // true para forçar recarga
                console.log('[DashboardModule] Projetos carregados do servidor:', projects.length);
                
                // Recarregar os projetos, mas não forçar a troca de tab
                // Apenas atualizar os dados na tab 'projects' se ela estiver ativa
                if (this.currentTab === 'projects') {
                    console.log('[DashboardModule] Atualizando UI com projetos ativos');
                    this.uiManager.renderProjects(projects, 'projects');
                } else {
                    console.log('[DashboardModule] Tab atual é', this.currentTab, ', não atualizando UI de projetos');
                }
                
                this.uiManager.hideLoading();
            } catch (error) {
                console.error('[DashboardModule] Erro ao recarregar projetos ativos:', error);
                this.uiManager.hideLoading();
                this.uiManager.showError('Erro ao carregar projetos. Tente novamente.');
            }
        });

        document.addEventListener('reloadArchivedProjects', async () => {
            try {
                const archivedProjects = await this.projectManager.loadArchivedProjects(this.currentUser.id);
                if (this.currentTab === 'archived') {
                    this.uiManager.renderProjects(archivedProjects, 'archived');
                }
            } catch (error) {
                console.error('Error reloading archived projects:', error);
            }
        });

        // Adicionar um handler para forçar a recarga de todas as listas
        document.addEventListener('forceReloadAllProjects', async () => {
            try {
                console.log('[DashboardModule] Forçando recarga de todas as listas do servidor...');
                this.uiManager.showLoading();
                
                // Carregar todos os tipos de projetos do servidor
                const activeProjects = await this.projectManager.loadUserProjects(this.currentUser.id, true);
                const archivedProjects = await this.projectManager.loadArchivedProjects(this.currentUser.id, true);
                const templates = await this.projectManager.loadTemplates(this.currentUser.id, true);
                
                console.log('[DashboardModule] Recarga completa:', {
                    active: activeProjects.length,
                    archived: archivedProjects.length,
                    templates: templates.length
                });
                
                // Atualizar a UI baseado na tab atual
                switch (this.currentTab) {
                    case 'projects':
                        this.uiManager.renderProjects(activeProjects, 'projects');
                        break;
                    case 'archived':
                        this.uiManager.renderProjects(archivedProjects, 'archived');
                        break;
                    case 'templates':
                        this.uiManager.renderProjects(templates, 'templates');
                        break;
                }
                
                this.uiManager.hideLoading();
                this.uiManager.showSuccess('', 'dashboard.success.projects_updated');
            } catch (error) {
                console.error('[DashboardModule] Erro ao forçar recarga de todas as listas:', error);
                this.uiManager.hideLoading();
                this.uiManager.showError('Erro ao recarregar projetos. Tente novamente.');
            }
        });

        // Adicionar event listener para loadUserProjects
        document.addEventListener('loadUserProjects', async (event) => {
            try {
                console.log('[DashboardModule] Evento loadUserProjects recebido:', event.detail);
                this.uiManager.showLoading();
                
                // Obter o parâmetro forceReload do evento
                const forceReload = event.detail?.forceReload === true;
                
                // Carregar projetos com o parâmetro forceReload
                const projects = await this.projectManager.loadUserProjects(this.currentUser.id, forceReload);
                console.log(`[DashboardModule] ${projects.length} projetos carregados ${forceReload ? '(forçando recarga)' : '(do cache)'}`);
                
                // Atualizar UI se a tab atual for 'projects'
                if (this.currentTab === 'projects') {
                    console.log('[DashboardModule] Atualizando UI com projetos carregados');
                    this.uiManager.renderProjects(projects, 'projects');
                } else {
                    console.log('[DashboardModule] Tab atual é', this.currentTab, ', não atualizando UI');
                }
                
                this.uiManager.hideLoading();
            } catch (error) {
                console.error('[DashboardModule] Erro ao carregar projetos:', error);
                this.uiManager.hideLoading();
                this.uiManager.showError('Erro ao carregar projetos. Tente novamente.');
            }
        });

        document.addEventListener('projectArchiveToggled', async (event) => {
            console.log('[DashboardModule] Evento projectArchiveToggled recebido:', event.detail);
            
            // Mostrar indicador de carregamento
            this.uiManager.showLoading();
            
            try {
                // Forçar recarga dos projetos ativos e arquivados para garantir dados atualizados
                console.log('[DashboardModule] Recarregando listas de projetos após alteração de estado de arquivo');
                
                // Determinar se o projeto foi arquivado ou desarquivado
                const wasArchived = event.detail.archived_proj;
                
                // Recarregar projetos ativos
                const activeProjects = await this.projectManager.loadUserProjects(this.currentUser.id, true);
                console.log(`[DashboardModule] ${activeProjects.length} projetos ativos carregados`);
                
                // Recarregar projetos arquivados
                const archivedProjects = await this.projectManager.loadArchivedProjects(this.currentUser.id, true);
                console.log(`[DashboardModule] ${archivedProjects.length} projetos arquivados carregados`);
                
                // Atualizar UI conforme a categoria afetada
                if (wasArchived) {
                    // Projeto foi arquivado
                    if (this.currentTab === 'projects') {
                        this.uiManager.renderProjects(activeProjects, 'projects');
                    } else if (this.currentTab === 'archived') {
                        this.uiManager.renderProjects(archivedProjects, 'archived');
                    }
                } else {
                    // Projeto foi desarquivado
                    if (this.currentTab === 'projects') {
                        this.uiManager.renderProjects(activeProjects, 'projects');
                    } else if (this.currentTab === 'archived') {
                        this.uiManager.renderProjects(archivedProjects, 'archived');
                    }
                }
            } catch (error) {
                console.error('[DashboardModule] Erro ao processar mudança de estado de arquivo:', error);
                this.uiManager.showError('Erro ao atualizar listas de projetos');
            } finally {
                // Esconder indicador de carregamento
                this.uiManager.hideLoading();
            }
        });

        // Listener para editar projeto por ID (usado pelo sistema de comandos)
        document.addEventListener('editProjectById', async (event) => {
            try {
                console.log('[DashboardModule] Evento editProjectById recebido:', event.detail);
                
                if (!event.detail?.id) {
                    console.error('[DashboardModule] ID do projeto não fornecido');
                    return;
                }
                
                const projectId = event.detail.id;
                
                // Buscar o projeto em todos os containers
                let project = null;
                
                // Tentar encontrar nos projetos ativos
                const activeProjects = await this.projectManager.loadUserProjects(this.currentUser.id);
                project = activeProjects.find(p => p.id === projectId);
                
                // Se não encontrou, tentar em projetos arquivados
                if (!project) {
                    const archivedProjects = await this.projectManager.loadArchivedProjects(this.currentUser.id);
                    project = archivedProjects.find(p => p.id === projectId);
                }
                
                // Se ainda não encontrou, tentar em templates
                if (!project) {
                    const templates = await this.projectManager.loadTemplates(this.currentUser.id);
                    project = templates.find(p => p.id === projectId);
                }
                
                // Se encontrou, mostrar o modal de edição
                if (project) {
                    console.log('[DashboardModule] Projeto encontrado, mostrando modal de edição');
                    this.uiManager.showEditProjectModal(project);
                } else {
                    console.error('[DashboardModule] Projeto não encontrado:', projectId);
                    this.uiManager.showError('Projeto não encontrado');
                }
            } catch (error) {
                console.error('[DashboardModule] Erro ao processar editProjectById:', error);
                this.uiManager.showError('Erro ao processar comando de edição');
            }
        });
    }

    /**
     * Configura a comunicação com o ribbon
     */
    setupRibbonCommunication() {
        console.log('[DashboardModule] Configurando comunicação com o ribbon');
        
        // Flag para controlar se já notificamos o ribbon
        this.ribbonNotified = false;
        
        // Escutar mensagens do ribbon
        window.addEventListener('message', (event) => {
            console.log('[DashboardModule] Mensagem recebida:', event.data);
            
            // Verificar se é um comando do ribbon
            if (event.data && event.data.type === 'RIBBON_COMMAND') {
                const { command, params } = event.data;
                this.handleRibbonCommand(command, params);
            }
            
            // Notificar o ribbon que o módulo está pronto, mas apenas se ainda não notificamos
            // e se recebemos a mensagem RIBBON_READY
            if (event.data && event.data.type === 'RIBBON_READY' && !this.ribbonNotified) {
                this.ribbonNotified = true; // Marcar que já notificamos o ribbon
                
                // Enviar mensagem de que o módulo está pronto
                window.parent.postMessage({
                    type: 'MODULE_READY',
                    module: 'dashboard'
                }, '*');
                console.log('[DashboardModule] Notificação MODULE_READY enviada para o ribbon (resposta ao RIBBON_READY)');
            }
        });
        
        // Notificar o ribbon que o módulo está pronto inicialmente (apenas uma vez)
        if (window.parent && !this.ribbonNotified) {
            this.ribbonNotified = true; // Marcar que já notificamos o ribbon
            
            window.parent.postMessage({
                type: 'MODULE_READY',
                module: 'dashboard'
            }, '*');
            console.log('[DashboardModule] Notificação MODULE_READY enviada para o ribbon (inicial)');
        }
    }
    
    /**
     * Manipula um comando recebido do ribbon
     * @param {string} command - O comando a ser executado
     * @param {Object} params - Parâmetros para o comando
     */
    handleRibbonCommand(command, params = {}) {
        console.log(`[DashboardModule] Recebido comando do ribbon: ${command}`, params);
        
        // Verificar se existe um método para lidar com este comando
        if (this.ribbonCommands[command]) {
            try {
                // Executar o método correspondente ao comando
                this.ribbonCommands[command](params);
                console.log(`[DashboardModule] Comando '${command}' executado com sucesso`);
            } catch (error) {
                console.error(`[DashboardModule] Erro ao executar comando '${command}':`, error);
            }
        } else {
            console.warn(`[DashboardModule] Comando não reconhecido: ${command}`);
        }
    }
    
    /**
     * Exibe o modal de novo projeto
     */
    showNewProjectModal() {
        console.log('[DashboardModule] Executando comando showNewProjectModal');
        if (!this.isLoading) {
            this.uiManager.showNewProjectModal();
        }
    }
    
    /**
     * Troca para uma tab específica
     * @param {Object} params - Parâmetros do comando, deve conter { tab: 'nome_da_tab' }
     */
    handleTabChangeCommand(params) {
        const tabName = params.tab;
        if (tabName && ['projects', 'archived', 'templates'].includes(tabName)) {
            console.log(`[DashboardModule] Trocando para tab: ${tabName} via comando do ribbon`);
            this.handleTabChange(tabName);
        } else {
            console.warn(`[DashboardModule] Nome de tab inválido: ${tabName}`);
        }
    }
    
    /**
     * Recarrega os projetos do usuário
     * @param {Object} params - Parâmetros do comando, pode conter { forceReload: true }
     */
    reloadProjects(params = {}) {
        const forceReload = params.forceReload === true;
        console.log(`[DashboardModule] Recarregando projetos (forceReload: ${forceReload})`);
        
        // Disparar evento para recarregar os projetos
        document.dispatchEvent(new CustomEvent('loadUserProjects', { 
            detail: { forceReload } 
        }));
    }

    async handleTabChange(tabName) {
        if (this.currentTab === tabName) return;
        
        try {
            this.isLoading = true;
            this.uiManager.showLoading();
            this.uiManager.updateActiveTab(tabName);
            
            let data = [];
            switch (tabName) {
                case 'projects':
                    data = await this.projectManager.loadUserProjects(this.currentUser.id);
                    break;
                case 'archived':
                    data = await this.projectManager.loadArchivedProjects(this.currentUser.id);
                    break;
                case 'templates':
                    data = await this.projectManager.loadTemplates(this.currentUser.id);
                    break;
                default:
                    throw new Error('Tab inválida');
            }
            
            this.currentTab = tabName;
            this.uiManager.renderProjects(data, tabName);
        } catch (error) {
            console.error(`Error loading ${tabName}:`, error);
            this.uiManager.showError(`Erro ao carregar ${tabName}.`);
        } finally {
            this.isLoading = false;
            this.uiManager.hideLoading();
        }
    }
}

export default DashboardModule; 