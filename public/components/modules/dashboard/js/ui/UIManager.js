class UIManager {
    constructor() {
        this.elements = {
            projectsContainer: document.getElementById('projects-container'),
            archivedContainer: document.getElementById('archived-container'),
            templatesContainer: document.getElementById('templates-container'),
            userName: document.getElementById('user-name'),
            userAvatar: document.getElementById('user-avatar'),
            tabButtons: document.querySelectorAll('.tab-button'),
            tabContents: document.querySelectorAll('.tab-content'),
            loadingOverlay: document.getElementById('loading-overlay'),
            newProjectModal: document.getElementById('new-project-modal'),
            editProjectModal: document.getElementById('edit-project-modal'),
            newProjectBtn: document.getElementById('newProjectBtn')
        };
        this.currentTab = 'projects';
        this.initEventListeners();
        
        // Registrar para eventos de tradução atualizada
        this.setupI18nListeners();
        console.log('[UIManager] Construtor inicializado');

        // Propriedade para rastrear mensagens recentes para evitar duplicatas
        this._recentMessages = {};

        // Propriedade para gerenciar mensagens e prevenir duplicações
        this._messageQueue = [];
        this._processingQueue = false;
        this._messageTimestamps = {};
    }
    
    /**
     * Configura os listeners para eventos de tradução
     */
    setupI18nListeners() {
        // Registra para eventos de atualização de tradução
        document.addEventListener('dashboard:translations:updated', (event) => {
            console.log('[UIManager] Evento de atualização de traduções recebido:', event.detail);
            
            // Atualizar elementos dinâmicos que podem não ter sido capturados pelo sistema i18n geral
            this.updateDynamicTranslations();
        });
        
        console.log('[UIManager] Listeners de i18n configurados');
    }
    
    /**
     * Atualiza as traduções de elementos dinâmicos
     */
    updateDynamicTranslations() {
        try {
            // Verificar se o gerenciador de i18n está disponível
            if (!window.dashboardI18n) {
                console.warn('[UIManager] Gerenciador de i18n não encontrado');
                return;
            }
            
            console.log('[UIManager] Atualizando traduções de elementos dinâmicos');
            
            // Atualizar mensagens de estado vazio
            this.updateEmptyStateMessages();
            
            // Traduzir cards de projeto que estão na tela
            this.translateProjectCards();
            
            // Traduzir modais que possam estar abertos
            this.translateOpenModals();
            
            console.log('[UIManager] Traduções dinâmicas atualizadas');
        } catch (error) {
            console.error('[UIManager] Erro ao atualizar traduções dinâmicas:', error);
        }
    }
    
    /**
     * Atualiza as mensagens de estado vazio com base no idioma atual
     */
    updateEmptyStateMessages() {
        try {
            // Para cada tipo de container
            ['projects', 'archived', 'templates'].forEach(containerType => {
                const container = this.getContainerForType(containerType);
                if (!container) return;
                
                // Se o container estiver vazio, atualize a mensagem
                if (container.querySelector('.empty-state')) {
                    const emptyMessage = this.getEmptyStateMessage(containerType);
                    const emptyStateElement = container.querySelector('.empty-state p');
                    if (emptyStateElement) {
                        emptyStateElement.textContent = emptyMessage;
                    }
                }
            });
            
            console.log('[UIManager] Mensagens de estado vazio atualizadas');
        } catch (error) {
            console.error('[UIManager] Erro ao atualizar mensagens de estado vazio:', error);
        }
    }
    
    /**
     * Traduz os cards de projeto que estão atualmente na tela
     */
    translateProjectCards() {
        try {
            // Obter todos os cards de projeto na tela
            const projectCards = document.querySelectorAll('.project-card');
            console.log(`[UIManager] Traduzindo ${projectCards.length} cards de projeto`);
            
            projectCards.forEach(card => {
                // Obter elementos traduzíveis
                const dateLabels = card.querySelectorAll('.date-label');
                const actionButtons = card.querySelectorAll('.card-action');
                
                // Traduzir labels de data
                dateLabels.forEach(label => {
                    const type = label.getAttribute('data-label-type');
                    if (type === 'created') {
                        const containerType = this.getContainerTypeFromCard(card);
                        label.textContent = window.dashboardI18n.translate(`dashboard.${containerType}.created_at`) + ':';
                    } else if (type === 'modified') {
                        const containerType = this.getContainerTypeFromCard(card);
                        label.textContent = window.dashboardI18n.translate(`dashboard.${containerType}.last_modified`) + ':';
                    }
                });
                
                // Traduzir botões de ação
                actionButtons.forEach(button => {
                    const action = button.getAttribute('data-action');
                    const containerType = this.getContainerTypeFromCard(card);
                    
                    if (action && containerType) {
                        const translationKey = `dashboard.${containerType}.${action}`;
                        const translation = window.dashboardI18n.translate(translationKey);
                        if (translation !== translationKey) {
                            button.setAttribute('title', translation);
                            
                            // Se tiver um span dentro do botão, atualizar texto também
                            const span = button.querySelector('span');
                            if (span) {
                                span.textContent = translation;
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error('[UIManager] Erro ao traduzir cards de projeto:', error);
        }
    }
    
    /**
     * Traduz modais que possam estar abertos
     */
    translateOpenModals() {
        try {
            // Verificar se há modais abertos
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            console.log(`[UIManager] Traduzindo ${openModals.length} modais abertos`);
            
            openModals.forEach(modal => {
                // Usar o gerenciador i18n para traduzir o modal inteiro
                if (window.dashboardI18n && typeof window.dashboardI18n.translateElement === 'function') {
                    window.dashboardI18n.translateElement(modal);
                }
            });
        } catch (error) {
            console.error('[UIManager] Erro ao traduzir modais abertos:', error);
        }
    }

    initEventListeners() {
        console.log('Inicializando event listeners do UIManager');
        
        // Event listener para o botão de novo projeto
        if (this.elements.newProjectBtn) {
            this.elements.newProjectBtn.addEventListener('click', () => {
                console.log('Botão de novo projeto clicado');
                this.showNewProjectModal();
            });
        }

        // Event listeners para as tabs
        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                console.log('Tab clicada:', tabName);
                this.switchTab(tabName);
            });
        });

        // Event listener para mudança de tab via evento
        document.addEventListener('switchTab', (event) => {
            console.log('Evento switchTab recebido:', event.detail);
            this.switchTab(event.detail);
        });

        // Event listener para recarregar projetos ativos
        document.addEventListener('reloadActiveProjects', (event) => {
            console.log('Evento reloadActiveProjects recebido');
            // Apenas atualizamos a UI com dados que já temos, 
            // o carregamento real dos dados ocorre no DashboardModule
            if (this.currentTab === 'projects') {
                this.switchTab('projects');
            }
        });

        // Event listener para forçar recarregamento de todas as listas
        document.addEventListener('forceReloadAllProjects', (event) => {
            console.log('[RELOAD] Evento forceReloadAllProjects recebido - recarregando todas as listas');
            
            // Disparar eventos para recarregar todas as listas
            document.dispatchEvent(new CustomEvent('reloadActiveProjects'));
            document.dispatchEvent(new CustomEvent('reloadArchivedProjects'));
            document.dispatchEvent(new CustomEvent('reloadTemplates'));
            
            // Forçar atualização visual também
            console.log('[RELOAD] Forçando atualização visual da tab atual:', this.currentTab);
            this.switchTab(this.currentTab);
        });

        // Event listener para atualização de projeto
        document.addEventListener('projectUpdated', (event) => {
            console.log('Evento projectUpdated recebido:', event.detail);
            const updatedProject = event.detail;
            
            // Atualizar a UI
            this.updateProjectInUI(updatedProject);
            
            // Fechar o modal de edição
            this.hideEditProjectModal();
            
            // Disparar evento para recarregar projetos (em vez de tentar carregar diretamente)
            console.log('Disparando evento para recarregar projetos ativos');
            document.dispatchEvent(new CustomEvent('reloadActiveProjects'));
        });

        // Event listener para criação de projeto
        document.addEventListener('projectCreated', async (event) => {
            console.log('[DEBUG] Evento projectCreated recebido:', event.detail);
            
            // Nova verificação de estrutura
            if (!event.detail?.project?.id) {
                console.error('Dados do evento inválidos:', event.detail);
                return;
            }

            // Adicionar timeout para sincronização
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Forçar atualização da tab
            this.switchTab('projects');
            
            // Novo timeout para garantir renderização
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Mostrar modal com dados atualizados
            this.showEditProjectModal(event.detail.project);
        });

        // Event listener para exclusão de projeto
        document.addEventListener('projectDeleted', (event) => {
            console.log('Evento projectDeleted recebido:', event.detail);
            const { id } = event.detail;
            this.removeProjectFromUI(id);
        });

        document.addEventListener('projectArchiveToggled', (event) => {
            const project = event.detail;
            if (!project) {
                console.error('Project data is missing in projectArchiveToggled event');
                return;
            }
            
            // Remover da UI atual
            this.removeProjectFromUI(project.id);
            
            // Sempre recarregar ambas as listas para manter sincronizado
            if (project.archived_proj) {
                document.dispatchEvent(new CustomEvent('reloadArchivedProjects'));
                document.dispatchEvent(new CustomEvent('reloadActiveProjects'));
            } else {
                document.dispatchEvent(new CustomEvent('reloadActiveProjects'));
                document.dispatchEvent(new CustomEvent('reloadArchivedProjects'));
            }
        });

        document.addEventListener('projectTemplateToggled', (event) => {
            const project = event.detail;
            // Lógica similar ao toggle de arquivo
            this.removeProjectFromUI(project.id);
        });

        // Event listener para novo projeto a partir de template
        document.addEventListener('showNewFromTemplate', (event) => {
            console.log('Evento showNewFromTemplate recebido:', event.detail);
            const { newProject, templateProject } = event.detail;
            this.showNewFromTemplateModal(newProject, templateProject);
        });
    }

    getContainerForType(containerType) {
        switch (containerType) {
            case 'projects':
                return this.elements.projectsContainer;
            case 'archived':
                return this.elements.archivedContainer;
            case 'templates':
                return this.elements.templatesContainer;
            default:
                return this.elements.projectsContainer;
        }
    }

    removeProjectFromUI(projectId) {
        console.log('Removendo projeto da UI:', projectId);
        
        const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
        if (projectCard) {
            projectCard.remove();
            console.log('Projeto removido com sucesso da UI');
        } else {
            console.log('Card do projeto não encontrado para remoção');
        }
    }

    updateUserInfo(user) {
        if (this.elements.userName) {
            this.elements.userName.textContent = user.name;
        }
    }

    renderProjects(projects, tabName = null) {
        const containerType = tabName || this.currentTab;
        let container;
        
        switch (containerType) {
            case 'projects':
                container = this.elements.projectsContainer;
                break;
            case 'archived':
                container = this.elements.archivedContainer;
                break;
            case 'templates':
                container = this.elements.templatesContainer;
                break;
            default:
                container = this.elements.projectsContainer;
        }
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (projects.length === 0) {
            this.showEmptyState(this.getEmptyStateMessage(containerType), container);
            return;
        }

        projects.forEach(project => {
            const card = this.createProjectCard(project, containerType);
            container.appendChild(card);
        });
    }

    getEmptyStateMessage(containerType) {
        switch (containerType) {
            case 'projects':
                return window.dashboardI18n ? 
                    window.dashboardI18n.translate('dashboard.projects.empty_state') : 
                    'Você ainda não tem projetos. Clique em "Novo Projeto" para começar.';
            case 'archived':
                return window.dashboardI18n ? 
                    window.dashboardI18n.translate('dashboard.archived.empty_state') : 
                    'Você não tem projetos arquivados.';
            case 'templates':
                return window.dashboardI18n ? 
                    window.dashboardI18n.translate('dashboard.templates.empty_state') : 
                    'Você ainda não tem templates. Você pode criar um template ou salvar um projeto existente como template.';
            default:
                return '';
        }
    }

    // Helper para obter a imagem padrão do projeto ou o ícone específico baseado no tipo
    getProjectImage(containerType, projectName) {
        // Caminho para a imagem SVG padrão
        const defaultImagePath = 'images/default_project_image.svg';
        
        // Retornar a tag img com a imagem padrão
        return `<img src="${defaultImagePath}" alt="${projectName || 'Projeto'}" class="default-project-image">`;
    }
    
    // Helper para obter o ícone do projeto baseado no tipo (mantido para compatibilidade)
    getProjectIcon(containerType) {
        if (containerType === 'templates') {
            return '<i class="fas fa-clipboard-list project-icon"></i>';
        } else if (containerType === 'archived') {
            return '<i class="fas fa-archive project-icon"></i>';
        } else {
            return '<i class="fas fa-file-alt project-icon"></i>';
        }
    }

    createProjectCard(project, containerType) {
        console.log('Criando card para projeto:', project.id, 'Tipo:', containerType);
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = project.id;
        
        let actionButtons = '';
        
        // Definir botões de ação baseado no tipo de container
        switch (containerType) {
            case 'projects':
                actionButtons = `
                    <button class="project-action edit-action" title="Editar" data-i18n-title="dashboard.project_card.edit_button_title">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="project-action archive-action" title="Arquivar" data-i18n-title="dashboard.project_card.archive_button_title">
                        <i class="fas fa-archive"></i>
                    </button>
                    <button class="project-action delete-action" title="Excluir" data-i18n-title="dashboard.project_card.delete_button_title">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                break;
            case 'archived':
                actionButtons = `
                    <button class="project-action unarchive-action" title="Desarquivar" data-i18n-title="dashboard.project_card.unarchive_button_title">
                        <i class="fas fa-box-open"></i>
                    </button>
                    <button class="project-action delete-action" title="Excluir" data-i18n-title="dashboard.project_card.delete_button_title">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                break;
            case 'templates':
                actionButtons = `
                    <button class="project-action use-template-action" title="Usar Template" data-i18n-title="dashboard.project_card.use_template_button_title">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="project-action edit-action" title="Editar" data-i18n-title="dashboard.project_card.edit_button_title">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="project-action delete-action" title="Excluir" data-i18n-title="dashboard.project_card.delete_button_title">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                break;
        }

        // Verificar se o projeto tem uma imagem na coluna image_proj
        let projectImageHTML = '';
        
        if (project.image_proj && project.image_proj.length > 0) {
            try {
                // Para imagens em formato bytea
                console.log('Projeto tem imagem, tentando exibir');
                
                // Verificar se a imagem já está em formato base64 ou se é um SVG
                if (project.image_proj.startsWith('\\x3c3f78')) {
                    // É um SVG codificado em hex, converter para base64
                    projectImageHTML = `<img src="data:image/svg+xml;base64,${this.hexToBase64(project.image_proj)}" alt="${project.internal_name}" onerror="this.onerror=null; this.style.display='none'; this.parentNode.innerHTML='<i class=\\'fas fa-file-alt project-icon\\'></i>';">`;
                } else {
                    // Usar diretamente como base64 PNG
                    projectImageHTML = `<img src="data:image/png;base64,${project.image_proj}" alt="${project.internal_name}" onerror="this.onerror=null; this.style.display='none'; this.parentNode.innerHTML='<i class=\\'fas fa-file-alt project-icon\\'></i>';">`;
                }
            } catch (e) {
                console.error('Erro ao processar imagem do projeto:', e);
                // Fallback para imagem padrão se houver erro
                projectImageHTML = this.getProjectImage(containerType, project.internal_name);
            }
        } else {
            // Usar imagem padrão se não houver imagem definida
            projectImageHTML = this.getProjectImage(containerType, project.internal_name);
        }
        
        // Formatar as datas
        const createdDate = this.formatDate(project.created_at);
        const updatedDate = this.formatDate(project.updated_at);
        
        card.innerHTML = `
            <div class="project-card-content">
                <div class="project-image">
                    ${projectImageHTML}
                </div>
                <div class="project-info">
                    <h3 class="project-name">${project.internal_name}</h3>
                    <p class="project-description">${project.internal_description || '<span data-i18n="dashboard.project_card.no_description">Sem descrição</span>'}</p>
                    <div class="project-edit-button">
                        <button class="edit-project-btn" data-command="editProject" data-project-id="${project.id}" data-i18n="dashboard.project_card.edit_button">
                            Editar Projeto
                        </button>
                    </div>
                </div>
                <div class="project-dates-actions">
                    <div class="project-dates">
                        <div class="date-item">
                            <span class="date-label" data-i18n="dashboard.project_card.created_label">Criado:</span>
                            <span class="date-value">${createdDate}</span>
                        </div>
                        <div class="date-item">
                            <span class="date-label" data-i18n="dashboard.project_card.updated_label">Atualizado:</span>
                            <span class="date-value">${updatedDate}</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        ${actionButtons}
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar event listeners para os botões de ação
        this.attachProjectCardEventListeners(card, project, containerType);
        
        // Adicionar event listener para o botão de editar projeto
        const editProjectBtn = card.querySelector('.edit-project-btn');
        if (editProjectBtn) {
            editProjectBtn.addEventListener('click', (event) => {
                event.preventDefault();
                console.log('Botão de edição do projeto clicado:', project.id);
                
                // Abrir a edição em uma nova janela
                const editUrl = `/project-editor.html?id=${project.id}`;
                window.open(editUrl, '_blank');
            });
        }
        
        // Aplicar traduções ao card
        if (window.dashboardI18n && typeof window.dashboardI18n.translateElement === 'function') {
            window.dashboardI18n.translateElement(card);
        }
        
        console.log('Card criado com sucesso para projeto:', project.id);
        return card;
    }
    
    // Helper para converter hex para base64
    hexToBase64(hexString) {
        try {
            // Remover prefixo '\x' se existir
            if (hexString.startsWith('\\x')) {
                hexString = hexString.substring(2);
            }
            
            // Converter hex para string binária
            let binaryString = '';
            for (let i = 0; i < hexString.length; i += 2) {
                binaryString += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
            }
            
            // Converter para base64
            return btoa(binaryString);
        } catch (e) {
            console.error('Erro ao converter hex para base64:', e);
            return '';
        }
    }

    attachProjectCardEventListeners(card, project, containerType) {
        console.log('Anexando event listeners ao card do projeto:', project.id);
        
        // Implementar listeners para botões de ação como edit, delete, archive, etc.
        const editButton = card.querySelector('.edit-action');
        const deleteButton = card.querySelector('.delete-action');
        const archiveButton = card.querySelector('.archive-action');
        const unarchiveButton = card.querySelector('.unarchive-action');
        const useTemplateButton = card.querySelector('.use-template-action');
        
        if (editButton) {
            editButton.addEventListener('click', () => {
                console.log('Botão de edição clicado para projeto:', project.id);
                this.showEditProjectModal(project);
            });
        }
        
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                console.log('Botão de exclusão clicado para projeto:', project.id);
                this.showDeleteConfirmationModal(project);
            });
        }
        
        if (archiveButton) {
            archiveButton.addEventListener('click', () => {
                console.log('Botão de arquivamento clicado para projeto:', project.id);
                const event = new CustomEvent('archiveProject', { detail: project });
                document.dispatchEvent(event);
            });
        }
        
        if (unarchiveButton) {
            unarchiveButton.addEventListener('click', () => {
                console.log('Botão de desarquivamento clicado para projeto:', project.id);
                const event = new CustomEvent('unarchiveProject', { detail: project });
                document.dispatchEvent(event);
            });
        }
        
        if (useTemplateButton) {
            useTemplateButton.addEventListener('click', () => {
                console.log('Botão de usar template clicado para projeto:', project.id);
                const event = new CustomEvent('useTemplate', { detail: project });
                document.dispatchEvent(event);
            });
        }
    }

    switchTab(tabName) {
        console.log('Alterando para a tab:', tabName);
        this.currentTab = tabName; // Garantir que o currentTab seja atualizado
        
        this.elements.tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        this.elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'Não disponível';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showEmptyState(message, container) {
        const targetContainer = container || this.elements.projectsContainer;
        if (!targetContainer) return;
        
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-folder-open"></i>
            <p>${message}</p>
        `;
        targetContainer.appendChild(emptyState);
    }

    showError(message, key = null) {
        console.error(message);
        
        // Se foi fornecida uma chave de tradução, usar o sistema i18n
        let displayMessage = message;
        if (key && window.dashboardI18n) {
            const translation = window.dashboardI18n.translate(key);
            if (translation !== key) {
                displayMessage = translation;
            }
        }
        
        // Criar e mostrar o elemento de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = displayMessage;
        document.body.appendChild(errorDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
            }
        }, 5000);
    }

    showSuccess(message, key = null) {
        console.log('[SUCCESS_MESSAGE] Recebido:', message, 'Chave:', key);
        
        // Verificar e validar parâmetros
        if (!message && !key) {
            console.warn('[SUCCESS_MESSAGE] Chamada sem mensagem e sem chave de tradução');
            return;
        }
        
        // Gerar identificação única baseada prioritariamente na chave de tradução
        const messageId = key || message;
        
        // Verificar se já exibimos esta mensagem recentemente (nos últimos 3 segundos)
        const now = Date.now();
        const lastTime = this._messageTimestamps[messageId] || 0;
        const timeDiff = now - lastTime;
        
        if (timeDiff < 3000) {
            console.log(`[SUCCESS_MESSAGE] Ignorando mensagem duplicada recente (${timeDiff}ms): "${messageId}"`);
            return;
        }
        
        // Registrar timestamp dessa mensagem
        this._messageTimestamps[messageId] = now;
        
        // Determinar a mensagem a ser exibida
        let displayMessage = message;
        let translationSource = 'original';
        
        // Tentar obter a tradução se houver uma chave e o sistema i18n estiver disponível
        if (key && window.dashboardI18n) {
            console.log(`[SUCCESS_MESSAGE] Buscando tradução para chave: "${key}"`);
            const translation = window.dashboardI18n.translate(key);
            
            // Verificar se a tradução foi encontrada (diferente da chave original)
            if (translation !== key) {
                displayMessage = translation;
                translationSource = 'tradução';
                console.log(`[SUCCESS_MESSAGE] Usando tradução: "${displayMessage}"`);
            } 
            // Se não houver tradução e a mensagem original estiver vazia, usar fallbacks específicos
            else if (!message || message === '') {
                // Fallbacks para casos especiais
                if (key === 'dashboard.success.project_archived') {
                    displayMessage = 'Projeto arquivado com sucesso';
                    translationSource = 'fallback-archived';
                } else if (key === 'dashboard.success.project_unarchived') {
                    displayMessage = 'Projeto desarquivado com sucesso';
                    translationSource = 'fallback-unarchived';
                } else if (key === 'dashboard.success.projects_updated') {
                    displayMessage = 'Projetos atualizados com sucesso';
                    translationSource = 'fallback-updated';
                } else {
                    // Construir uma mensagem genérica baseada na chave
                    const keyParts = key.split('.');
                    const lastPart = keyParts[keyParts.length - 1];
                    displayMessage = `Operação "${lastPart}" concluída`;
                    translationSource = 'fallback-genérico';
                }
                console.log(`[SUCCESS_MESSAGE] Usando fallback: "${displayMessage}" (${translationSource})`);
            }
        }
        
        // Verificar se temos uma mensagem para exibir
        if (!displayMessage) {
            console.warn('[SUCCESS_MESSAGE] Sem mensagem para exibir após processamento');
            return;
        }
        
        // Log completo da mensagem que será exibida
        console.log(`[SUCCESS_MESSAGE] Enfileirando mensagem: "${displayMessage}" (fonte: ${translationSource})`);
        
        // Adicionar à fila de mensagens
        this._messageQueue.push(displayMessage);
        
        // Iniciar processamento se não estiver em andamento
        if (!this._processingQueue) {
            this._processNextMessage();
        }
    }
    
    // Método para processar a fila de mensagens uma por uma
    _processNextMessage() {
        if (this._messageQueue.length === 0) {
            console.log('[SUCCESS_MESSAGE] Fila de mensagens processada completamente');
            this._processingQueue = false;
            return;
        }
        
        this._processingQueue = true;
        const message = this._messageQueue.shift();
        
        // Log detalhado sobre a mensagem que está sendo exibida e o estado da fila
        console.log(`[SUCCESS_MESSAGE] Exibindo mensagem: "${message}" (${this._messageQueue.length} restantes na fila)`);
        
        // Criar e mostrar o elemento
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        // Adicionar ID único para acompanhamento
        const messageId = 'msg-' + Date.now();
        successDiv.id = messageId;
        document.body.appendChild(successDiv);
        
        console.log(`[SUCCESS_MESSAGE] Elemento criado com ID: ${messageId}`);
        
        // Remover após 5 segundos e processar próxima mensagem
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
            document.body.removeChild(successDiv);
                console.log(`[SUCCESS_MESSAGE] Elemento removido: ${messageId}`);
            } else {
                console.warn(`[SUCCESS_MESSAGE] Elemento já não existe: ${messageId}`);
            }
            
            // Processar próxima mensagem após um pequeno intervalo
            setTimeout(() => {
                console.log('[SUCCESS_MESSAGE] Processando próxima mensagem na fila');
                this._processNextMessage();
            }, 300);
        }, 5000);
    }

    showLoading() {
        if (!this.elements.loadingOverlay) {
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p data-i18n="dashboard.loading">Carregando...</p>
                </div>
            `;
            document.body.appendChild(overlay);
            this.elements.loadingOverlay = overlay;
            
            // Aplicar traduções ao overlay
            if (window.dashboardI18n && typeof window.dashboardI18n.translateElement === 'function') {
                window.dashboardI18n.translateElement(overlay);
            }
        }
        this.elements.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'none';
        }
    }

    updateActiveTab(tabName) {
        this.currentTab = tabName;
        
        this.elements.tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        this.elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    }

    showNewProjectModal() {
        console.log('[MODAL] Abrindo modal de novo projeto');
        
        // Sempre recriar o modal para garantir que os handlers estejam corretos
        if (this.elements.newProjectModal) {
            this.elements.newProjectModal.remove();
            this.elements.newProjectModal = null;
        }
        
        const modal = document.createElement('div');
        modal.id = 'new-project-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-i18n="dashboard.new_project_modal.title">Novo Projeto</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="new-project-form">
                        <div class="form-group">
                            <label for="project-name" data-i18n="dashboard.new_project_modal.name_label">Nome do Projeto</label>
                            <input type="text" id="project-name" name="project-name" required>
                        </div>
                        <div class="form-group">
                            <label for="project-description" data-i18n="dashboard.new_project_modal.description_label">Descrição</label>
                            <textarea id="project-description" name="project-description" rows="4"></textarea>
                        </div>
                        <div class="form-group" style="display: grid; grid-template-columns: 15px 1fr; align-items: center; gap: 10px; padding: 8px 0;">
                            <div style="justify-self: start">
                                <input type="checkbox" id="project-template" name="project-template">
                            </div>
                            <label for="project-template" style="text-align: left; margin: 0" data-i18n="dashboard.new_project_modal.create_as_template">Criar como template</label>
                        </div>
                        <div class="modal-footer" style="display: flex; justify-content: center; align-items: center; gap: 1rem;">
                            <button type="button" class="btn btn-secondary cancel-button" data-i18n="dashboard.new_project_modal.cancel_button" style="min-width: 120px; padding: 8px 16px; font-size: 14px;">Cancelar</button>
                            <button type="submit" class="btn btn-primary" data-i18n="dashboard.new_project_modal.create_button" style="min-width: 120px; padding: 8px 16px; font-size: 14px;">Criar Projeto</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.elements.newProjectModal = modal;

        // Adicionar event listeners do modal
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            console.log('[MODAL] Fechando modal via botão X');
            this.hideNewProjectModal();
        });
        
        // Adicionar event listener para o botão cancelar
        const cancelButton = modal.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            console.log('[MODAL] Fechando modal via botão Cancelar');
            this.hideNewProjectModal();
        });

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('[MODAL] Fechando modal via clique fora');
                this.hideNewProjectModal();
            }
        });

        // Prevenir fechamento ao clicar dentro do modal
        modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Aplicar traduções ao modal
        if (window.dashboardI18n && typeof window.dashboardI18n.translateElement === 'function') {
            window.dashboardI18n.translateElement(modal);
        }

        // Manipular submissão do formulário
        const form = modal.querySelector('#new-project-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('[MODAL] Formulário de novo projeto submetido');
            
            const projectName = form.querySelector('#project-name').value.trim();
            const projectDescription = form.querySelector('#project-description').value.trim();
            const isTemplate = form.querySelector('#project-template').checked;
            
            if (!projectName) {
                console.error('[MODAL] Nome do projeto não pode ser vazio');
                this.showError('Nome do projeto é obrigatório');
                return;
            }
            
            const projectData = {
                internal_name: projectName,
                internal_description: projectDescription,
                template_proj: isTemplate
            };
            
            console.log('[MODAL] Dados do novo projeto:', projectData);
            this.handleNewProject(projectData);
        });
        
        // Exibir o modal
        this.elements.newProjectModal.style.display = 'flex';
        
        // Focar no campo de nome para melhor UX
        setTimeout(() => {
            const nameInput = this.elements.newProjectModal.querySelector('#project-name');
            if (nameInput) nameInput.focus();
        }, 100);
    }

    hideNewProjectModal() {
        console.log('[MODAL] Ocultando modal de novo projeto');
        if (this.elements.newProjectModal) {
            this.elements.newProjectModal.style.display = 'none';
            // Limpar formulário
            const form = this.elements.newProjectModal.querySelector('#new-project-form');
            if (form) form.reset();
        }
    }

    async handleNewProject(projectData) {
        try {
            console.log('[MODAL] Criando novo projeto com dados:', projectData);
            // Mostrar indicador de carregamento
            this.showLoading();
            
            // Disparar evento customizado para ser capturado pelo ProjectManager
            const event = new CustomEvent('newProject', { detail: projectData });
            document.dispatchEvent(event);
            this.hideNewProjectModal();
            
            // Aguardar um pouco e disparar um evento para recarregar projetos
            setTimeout(() => {
                console.log('[MODAL] Disparando evento para recarregar projetos');
                document.dispatchEvent(new CustomEvent('reloadActiveProjects', {}));
            }, 300);
        } catch (error) {
            console.error('[MODAL] Erro ao criar novo projeto:', error);
            this.showError('Erro ao criar novo projeto. Por favor, tente novamente.');
        } finally {
            // Esconder indicador de carregamento
            this.hideLoading();
        }
    }

    showEditProjectModal(project) {
        console.log('Abrindo modal de edição para projeto:', project);
        
        if (!this.elements.editProjectModal) {
            const modal = document.createElement('div');
            modal.id = 'edit-project-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 data-i18n="dashboard.edit_project_modal.title">Editar Projeto</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-project-form">
                            <div class="form-group">
                                <label for="edit-project-name" data-i18n="dashboard.edit_project_modal.name_label">Nome do Projeto</label>
                                <input type="text" id="edit-project-name" name="project-name" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-project-description" data-i18n="dashboard.edit_project_modal.description_label">Descrição</label>
                                <textarea id="edit-project-description" name="project-description" rows="4"></textarea>
                            </div>
                            <div class="modal-footer" style="display: flex; justify-content: center; align-items: center; gap: 1rem;">
                                <button type="button" class="btn btn-secondary close-modal cancel-button" data-i18n="dashboard.edit_project_modal.cancel_button" style="min-width: 120px; padding: 8px 16px; font-size: 14px; height: 60px; box-sizing: border-box;">Cancelar</button>
                                <button type="button" class="btn btn-info save-as-template" data-i18n="dashboard.projects.make_template" style="min-width: 120px; padding: 8px 16px; font-size: 14px; height: 60px; box-sizing: border-box;">Copiar para Templates</button>
                                <button type="submit" class="btn btn-primary" data-i18n="dashboard.edit_project_modal.save_button" style="min-width: 120px; padding: 8px 16px; font-size: 14px; height: 60px; box-sizing: border-box;">Salvar Alterações</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            this.elements.editProjectModal = modal;

            // Adicionar event listeners do modal
            const closeButtons = modal.querySelectorAll('.close-modal');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => this.hideEditProjectModal());
            });

            // Fechar modal ao clicar fora
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideEditProjectModal();
                }
            });

            // Prevenir fechamento ao clicar dentro do modal
            modal.querySelector('.modal-content').addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Manipular submissão do formulário
            const form = modal.querySelector('#edit-project-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const projectData = {
                    id: form.dataset.projectId,
                    internal_name: formData.get('project-name'),
                    internal_description: formData.get('project-description')
                };
                console.log('Enviando dados de edição:', projectData);
                this.handleEditProject(projectData);
            });

            // Adicionar handler para o botão "Copiar para Templates"
            const saveAsTemplateBtn = modal.querySelector('.save-as-template');
            saveAsTemplateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = form.dataset.projectId;
                console.log('Copiando projeto para templates:', projectId);
                this.handleSaveAsTemplate(projectId);
            });
            
            // Aplicar traduções ao modal
            if (window.dashboardI18n && typeof window.dashboardI18n.translateElement === 'function') {
                window.dashboardI18n.translateElement(modal);
            }
        }

        // Preencher o formulário com os dados mais recentes do projeto
        const form = this.elements.editProjectModal.querySelector('#edit-project-form');
        form.dataset.projectId = project.id;
        form.querySelector('#edit-project-name').value = project.internal_name;
        form.querySelector('#edit-project-description').value = project.internal_description || '';

        // Verificar se o projeto já é um template e ocultar o botão se for
        const saveAsTemplateBtn = this.elements.editProjectModal.querySelector('.save-as-template');
        if (project.template_proj) {
            saveAsTemplateBtn.style.display = 'none';
        } else {
            saveAsTemplateBtn.style.display = 'inline-block';
        }

        this.elements.editProjectModal.style.display = 'flex';
    }

    hideEditProjectModal() {
        console.log('Fechando modal de edição');
        if (this.elements.editProjectModal) {
            this.elements.editProjectModal.style.display = 'none';
            // Limpar formulário
            const form = this.elements.editProjectModal.querySelector('#edit-project-form');
            if (form) {
                form.reset();
                delete form.dataset.projectId;
            }
        }
    }

    async handleEditProject(projectData) {
        console.log('Processando edição do projeto:', projectData);
        try {
            // Disparar evento customizado para ser capturado pelo ProjectManager
            const event = new CustomEvent('editProject', { detail: projectData });
            document.dispatchEvent(event);
            
            // Não fechar o modal imediatamente, aguardar resposta do ProjectManager
            // O modal será fechado quando recebermos o evento projectUpdated
        } catch (error) {
            console.error('Erro ao editar projeto:', error);
            this.showError('Erro ao editar projeto. Por favor, tente novamente.');
        }
    }

    updateProjectInUI(updatedProject) {
        console.log('[UIManager] Atualizando projeto na UI:', updatedProject?.id);
        
        if (!updatedProject || !updatedProject.id) {
            console.error('[UIManager] Dados do projeto inválidos:', updatedProject);
            return;
        }

        // 1. Atualizar o card do projeto em todos os containers
        const containers = ['projects-container', 'archived-container', 'templates-container'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                const existingCard = container.querySelector(`[data-project-id="${updatedProject.id}"]`);
                if (existingCard) {
                    console.log(`[UIManager] Atualizando card no container: ${containerId}`);
                    this.updateProjectCard(existingCard, updatedProject);
                } else {
                    console.log(`[UIManager] Projeto não encontrado no container: ${containerId}`);
                }
            }
        });
        
        // 2. Atualizar dados no modal se estiver aberto
        this.updateProjectModal(updatedProject);
    }

    updateProjectCard(card, updatedProject) {
        console.log('Atualizando card para projeto:', updatedProject.id);
        
        const nameElement = card.querySelector('.project-name');
        const descriptionElement = card.querySelector('.project-description');
        const dateElements = card.querySelectorAll('.date-value');
        const imageContainer = card.querySelector('.project-image');
        
        if (nameElement) nameElement.textContent = updatedProject.internal_name;
        if (descriptionElement) descriptionElement.textContent = updatedProject.internal_description || 'Sem descrição';
        
        // Atualizar imagem do projeto
        if (imageContainer) {
            if (updatedProject.image_proj && updatedProject.image_proj.length > 0) {
                try {
                    // Verificar se é um SVG ou imagem normal
                    let imgSrc = '';
                    if (updatedProject.image_proj.startsWith('\\x3c3f78')) {
                        // É um SVG codificado em hex
                        imgSrc = `data:image/svg+xml;base64,${this.hexToBase64(updatedProject.image_proj)}`;
                    } else {
                        // Usar diretamente como base64 PNG
                        imgSrc = `data:image/png;base64,${updatedProject.image_proj}`;
                    }
                    
                    // Verificar se já tem uma imagem ou precisamos criar uma nova
                    let imgElement = imageContainer.querySelector('img');
                    
                    if (imgElement) {
                        // Atualizar a imagem existente
                        imgElement.src = imgSrc;
                        imgElement.alt = updatedProject.internal_name;
                        imgElement.classList.remove('default-project-image');
                    } else {
                        // Criar novo elemento de imagem
                        imageContainer.innerHTML = `<img src="${imgSrc}" alt="${updatedProject.internal_name}" onerror="this.onerror=null; this.style.display='none'; this.parentNode.innerHTML='<i class=\\'fas fa-file-alt project-icon\\'></i>';">`;
                    }
                } catch (e) {
                    console.error('Erro ao atualizar imagem do projeto:', e);
                    // Usar imagem padrão como fallback
                    const containerType = this.getContainerTypeFromCard(card);
                    imageContainer.innerHTML = this.getProjectImage(containerType, updatedProject.internal_name);
                }
            } else {
                // Sem imagem definida, usar a imagem padrão
                const containerType = this.getContainerTypeFromCard(card);
                imageContainer.innerHTML = this.getProjectImage(containerType, updatedProject.internal_name);
            }
        }
        
        // Atualizar as datas
        if (dateElements.length >= 2) {
            dateElements[0].textContent = this.formatDate(updatedProject.created_at);
            dateElements[1].textContent = this.formatDate(updatedProject.updated_at);
        }
        
        console.log('Card atualizado com sucesso para projeto:', updatedProject.id);
    }
    
    /**
     * Obtém o tipo de container a partir de um card de projeto
     * @param {HTMLElement} card - O elemento DOM do card
     * @returns {string} - O tipo de container (projects, archived, templates)
     */
    getContainerTypeFromCard(card) {
        // Verificar se o card tem o atributo data-container-type
        if (card.hasAttribute('data-container-type')) {
            return card.getAttribute('data-container-type');
        }
        
        // Verificar em qual container o card está
        const projectsContainer = this.elements.projectsContainer;
        const archivedContainer = this.elements.archivedContainer;
        const templatesContainer = this.elements.templatesContainer;
        
        if (projectsContainer && projectsContainer.contains(card)) {
            return 'projects';
        } else if (archivedContainer && archivedContainer.contains(card)) {
            return 'archived';
        } else if (templatesContainer && templatesContainer.contains(card)) {
            return 'templates';
        }
        
        // Tipo padrão se não conseguir determinar
        return 'projects';
    }

    updateProjectModal(project) {
        console.log('Verificando se modal de edição está aberto para:', project.id);
        
        if (this.elements.editProjectModal && 
            this.elements.editProjectModal.style.display === 'flex') {
            
            const form = this.elements.editProjectModal.querySelector('#edit-project-form');
            if (form && form.dataset.projectId === project.id) {
                console.log('Atualizando dados no modal de edição');
                
                // Atualizar campos do formulário
                const nameInput = form.querySelector('#edit-project-name');
                const descriptionInput = form.querySelector('#edit-project-description');
                
                if (nameInput) {
                    nameInput.value = project.internal_name;
                    // Trigger change event para atualizar validações
                    nameInput.dispatchEvent(new Event('change'));
                }
                
                if (descriptionInput) {
                    descriptionInput.value = project.internal_description || '';
                    // Trigger change event para atualizar validações
                    descriptionInput.dispatchEvent(new Event('change'));
                }

                // Atualizar dataset com dados mais recentes
                form.dataset.projectId = project.id;
                form.dataset.lastUpdate = project.updated_at;
            }
        }
    }

    addProjectToUI(project) {
        console.log('Adicionando novo projeto à UI:', project);
        
        // Determinar o container correto baseado no tipo do projeto
        let container;
        if (project.template_proj) {
            container = document.getElementById('templates-container');
        } else if (project.archived_proj) {
            container = document.getElementById('archived-container');
        } else {
            container = document.getElementById('projects-container');
        }

        if (!container) {
            console.error('Container não encontrado para o projeto:', project);
            return;
        }

        // Criar e adicionar o card do projeto
        const card = this.createProjectCard(project, this.getContainerType(container.id));
        container.insertBefore(card, container.firstChild);
        
        console.log('Novo projeto adicionado com sucesso à UI');
    }

    getContainerType(containerId) {
        switch (containerId) {
            case 'projects-container':
                return 'projects';
            case 'archived-container':
                return 'archived';
            case 'templates-container':
                return 'templates';
            default:
                return 'projects';
        }
    }

    async showNewFromTemplateModal(newProject, templateProject) {
        console.log('[TEMPLATE_MODAL] Abrindo modal para novo projeto:', newProject?.id);
        
        // Validação básica
        if (!newProject?.id) {
            console.error('[TEMPLATE_MODAL] ERRO: ID do projeto inválido:', newProject);
            this.showError('Projeto inválido. Tente novamente.');
            return;
        }

        if (!templateProject?.id) {
            console.error('[TEMPLATE_MODAL] ERRO: Template inválido:', templateProject);
            this.showError('Template inválido. Tente novamente.');
            return;
        }

        try {
            // Criar um novo modal para cada uso (evita problemas com modais existentes)
            const modal = document.createElement('div');
            modal.id = 'template-edit-modal';
            modal.className = 'modal';
            
            // HTML do modal com dados já preenchidos
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 data-i18n="dashboard.new_from_template.title">Novo Projeto a partir de Template</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="template-edit-form">
                            <input type="hidden" id="template-project-id" value="${newProject.id}">
                            <div class="form-group">
                                <label for="template-project-name" data-i18n="dashboard.new_from_template.name_label">Nome do Projeto</label>
                                <input type="text" id="template-project-name" name="project-name" 
                                    value="${newProject.internal_name}" required>
                            </div>
                            <div class="form-group">
                                <label for="template-project-description" data-i18n="dashboard.new_from_template.description_label">Descrição</label>
                                <textarea id="template-project-description" name="project-description" 
                                    rows="4">${newProject.internal_description || ''}</textarea>
                            </div>
                            <div class="modal-footer" style="display: flex; justify-content: center; align-items: center; gap: 1rem;">
                                <button type="button" class="btn btn-secondary close-modal" data-i18n="dashboard.new_from_template.cancel_button" style="min-width: 120px; padding: 8px 16px; font-size: 14px; height: 60px; box-sizing: border-box;">Cancelar</button>
                                <button type="submit" class="btn btn-primary" data-i18n="dashboard.new_from_template.create_button" style="min-width: 120px; padding: 8px 16px; font-size: 14px; height: 60px; box-sizing: border-box;">Salvar Projeto</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            // Adicionar à página
            document.body.appendChild(modal);
            console.log('[TEMPLATE_MODAL] Modal criado e adicionado ao DOM');
            
            // Event listeners
            const closeButtons = modal.querySelectorAll('.close-modal');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('[TEMPLATE_MODAL] Cancelando e excluindo projeto:', newProject.id);
                    modal.remove();
                    
                    // 1. Excluir o projeto se cancelado (adicionado flag 'silent')
                    document.dispatchEvent(new CustomEvent('deleteProject', { 
                        detail: { id: newProject.id, silent: true } 
                    }));
                    
                    // 2. Mudar para a tab Templates
                    console.log('[TEMPLATE_MODAL] Mudando para tab Templates após cancelamento');
                    document.dispatchEvent(new CustomEvent('switchTab', {
                        detail: 'templates'
                    }));
                });
            });
            
            // Fechar ao clicar fora
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log('[TEMPLATE_MODAL] Clique fora, cancelando e excluindo projeto:', newProject.id);
                    modal.remove();
                    
                    // 1. Excluir o projeto se cancelado (adicionado flag 'silent')
                    document.dispatchEvent(new CustomEvent('deleteProject', { 
                        detail: { id: newProject.id, silent: true } 
                    }));
                    
                    // 2. Mudar para a tab Templates
                    console.log('[TEMPLATE_MODAL] Mudando para tab Templates após cancelamento');
                    document.dispatchEvent(new CustomEvent('switchTab', {
                        detail: 'templates'
                    }));
                }
            });
            
            // Prevenir fechamento ao clicar dentro
            modal.querySelector('.modal-content').addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            // Aplicar traduções ao modal
            if (window.dashboardI18n && typeof window.dashboardI18n.translateElement === 'function') {
                window.dashboardI18n.translateElement(modal);
            }
            
            // Submissão do formulário
            const form = modal.querySelector('#template-edit-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('[TEMPLATE_MODAL] Formulário submetido para projeto:', newProject.id);
                
                const projectId = form.querySelector('#template-project-id').value;
                const projectName = form.querySelector('#template-project-name').value;
                const projectDescription = form.querySelector('#template-project-description').value;
                
                if (!projectName.trim()) {
                    console.error('[TEMPLATE_MODAL] Nome do projeto vazio');
                    this.showError('O nome do projeto não pode estar vazio');
                    return;
                }
                
                const projectData = {
                    id: projectId,
                    internal_name: projectName.trim(),
                    internal_description: projectDescription.trim()
                };
                
                console.log('[TEMPLATE_MODAL] Dados para atualização:', projectData);
                
                // 1. Fechar o modal de edição
                modal.remove();
                
                // 2. Salvar as alterações
                this.handleEditProject(projectData);
                
                // 3. Mostrar modal de confirmação
                console.log('[TEMPLATE_MODAL] Mostrando confirmação de projeto criado');
                this.showProjectCreatedModal(projectName.trim());
            });
            
            // Exibir o modal
            console.log('[TEMPLATE_MODAL] Exibindo modal');
            modal.style.display = 'flex';
            
        } catch (error) {
            console.error('[TEMPLATE_MODAL] Erro ao mostrar modal:', error);
            this.showError('Erro ao exibir formulário de edição. Tente novamente.');
        }
    }

    showProjectCreatedModal(projectName) {
        console.log('[CONFIRMATION_MODAL] Exibindo confirmação de projeto criado:', projectName);
        
        try {
            // Criar modal de confirmação
            const modal = document.createElement('div');
            modal.id = 'project-created-modal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 data-i18n="dashboard.project_created_modal.title">Projeto Criado</h2>
                    </div>
                    <div class="modal-body">
                        <p><span data-i18n="dashboard.project_created_modal.message">O projeto</span> <strong>${projectName}</strong> <span data-i18n="dashboard.project_created_modal.message_end">foi criado com sucesso e está disponível na aba "Meus Projetos".</span></p>
                        <div class="modal-footer" style="display: flex; justify-content: center; align-items: center; gap: 1rem;">
                            <button type="button" class="btn btn-primary ok-button" data-i18n="dashboard.project_created_modal.ok_button" style="min-width: 120px; padding: 8px 16px; font-size: 14px; height: 60px; box-sizing: border-box;">OK</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Configurar o botão OK
            const okButton = modal.querySelector('.ok-button');
            okButton.addEventListener('click', () => {
                console.log('[CONFIRMATION_MODAL] Botão OK clicado, atualizando e mudando para Meus Projetos');
                
                // Fechar o modal
                modal.remove();
                
                // SOLUÇÃO MAIS AGRESSIVA: Recarregar a página completamente
                // Isso garante que todos os dados serão atualizados do zero
                window.location.href = window.location.href.split('#')[0] + '#projects';
                window.location.reload();
            });
            
            // Aplicar traduções ao modal
            if (window.dashboardI18n && typeof window.dashboardI18n.translateElement === 'function') {
                window.dashboardI18n.translateElement(modal);
            }
            
            // Exibir o modal
            modal.style.display = 'flex';
            
        } catch (error) {
            console.error('[CONFIRMATION_MODAL] Erro ao exibir confirmação:', error);
            // Falhar graciosamente indo direto para os projetos
            window.location.href = window.location.href.split('#')[0] + '#projects';
            window.location.reload();
        }
    }

    // Adicionar o novo método para lidar com a cópia para template
    async handleSaveAsTemplate(projectId) {
        console.log('Salvando projeto como template:', projectId);
        try {
            // Disparar evento customizado para ser capturado pelo ProjectManager
            const event = new CustomEvent('copyToTemplate', { detail: { projectId } });
            document.dispatchEvent(event);
            
            // Fechar o modal imediatamente
            this.hideEditProjectModal();
            
            // Mostrar mensagem de sucesso
            this.showSuccess('Projeto copiado para Templates com sucesso', 'dashboard.success.project_copied');
        } catch (error) {
            console.error('Erro ao copiar projeto para templates:', error);
            this.showError('Erro ao copiar projeto para templates. Por favor, tente novamente.');
        }
    }

    // Novo método para mostrar modal de confirmação de exclusão
    showDeleteConfirmationModal(project) {
        console.log('[DELETE_MODAL] Exibindo confirmação para excluir projeto:', project.id);
        
        try {
            // Criar modal de confirmação
            const modal = document.createElement('div');
            modal.id = 'delete-confirmation-modal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 data-i18n="dashboard.delete_modal.title">Confirmar Exclusão</h2>
                    </div>
                    <div class="modal-body">
                        <p><span data-i18n="dashboard.delete_modal.confirm_text">Tem certeza que deseja excluir o projeto</span> <strong>${project.internal_name}</strong>?</p>
                        <p class="warning" data-i18n="dashboard.delete_modal.warning">Esta ação não pode ser desfeita.</p>
                        <div class="modal-footer" style="display: flex; justify-content: space-between; margin-top: 20px;">
                            <button type="button" class="btn btn-secondary cancel-button" data-i18n="dashboard.delete_modal.cancel_button">Cancelar</button>
                            <button type="button" class="btn btn-danger confirm-button" data-i18n="dashboard.delete_modal.delete_button">Excluir Projeto</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Configurar botões
            const cancelButton = modal.querySelector('.cancel-button');
            const confirmButton = modal.querySelector('.confirm-button');
            
            // Fechar modal ao cancelar
            cancelButton.addEventListener('click', () => {
                console.log('[DELETE_MODAL] Exclusão cancelada');
                modal.remove();
            });
            
            // Confirmar exclusão
            confirmButton.addEventListener('click', () => {
                console.log('[DELETE_MODAL] Exclusão confirmada para projeto:', project.id);
                modal.remove();
                
                // Disparar evento de exclusão
                document.dispatchEvent(new CustomEvent('deleteProject', { 
                    detail: { id: project.id } 
                }));
            });
            
            // Fechar ao clicar fora
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log('[DELETE_MODAL] Clique fora, cancelando exclusão');
                    modal.remove();
                }
            });
            
            // Exibir o modal
            modal.style.display = 'flex';
            
            // Aplicar traduções ao modal
            if (window.dashboardI18n && typeof window.dashboardI18n.translateElement === 'function') {
                window.dashboardI18n.translateElement(modal);
            }
            
        } catch (error) {
            console.error('[DELETE_MODAL] Erro ao exibir modal de confirmação:', error);
            // Fallback para o confirm padrão em caso de erro
            if (confirm('Tem certeza que deseja excluir este projeto?')) {
                document.dispatchEvent(new CustomEvent('deleteProject', { 
                    detail: { id: project.id } 
                }));
            }
        }
    }
}

export default UIManager; 