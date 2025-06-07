/**
 * RibbonController
 * Responsável por gerenciar a interface do ribbon e interações
 */
class RibbonController {
    /**
     * Inicializa o controlador do ribbon
     * @param {HTMLElement} container - Elemento onde o ribbon será renderizado
     */
    constructor() {
        this.container = document.getElementById('ribbon-content-container');
        this.ribbonManager = new RibbonManager();
        this.renderer = new RibbonRenderer(this.container);
        this.activeTab = null;
        this.moduleIframe = document.getElementById('module-iframe');
        
        if (!this.moduleIframe) {
            console.error('[RIBBON-CONTROLLER] Elemento iframe não encontrado! ID esperado: module-iframe');
        } else {
            console.log('[RIBBON-CONTROLLER] Elemento iframe encontrado com sucesso');
            
            // Verificar se o iframe já tem um src definido
            if (this.moduleIframe.src && this.moduleIframe.src !== 'about:blank') {
                console.log('[RIBBON-CONTROLLER] Iframe já possui um src definido:', this.moduleIframe.src);
            }
        }

        // Inicializar o ribbon
        this.init();
    }

    /**
     * Inicializa o controlador
     */
    init() {
        console.log('[RIBBON-CONTROLLER] Inicializando controller');
        
        // Renderizar a interface do ribbon
        this.renderRibbon();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Configurar comunicação com módulos
        this.setupModuleCommunication();
        
        // Ativa a aba padrão definida nas configurações
        const defaultTab = RibbonConfig.settings.defaultActiveTab;
        console.log('[RIBBON-CONTROLLER] Ativando aba padrão:', defaultTab);
        
        // Verificar se a aba existe na configuração
        if (RibbonConfig.getTabById(defaultTab)) {
            this.activateTab(defaultTab);
        } else {
            console.error('[RIBBON-CONTROLLER] Aba padrão não encontrada na configuração:', defaultTab);
        }
    }

    /**
     * Renderiza o ribbon usando o renderer
     */
    renderRibbon() {
        this.renderer.render();
    }

    /**
     * Configura os event listeners para interações com o ribbon
     */
    setupEventListeners() {
        // Evento para mudança de abas
        document.addEventListener('ribbon:tabchange', (event) => {
            const tabId = event.detail.tabId;
            console.log('[RIBBON-CONTROLLER] Evento ribbon:tabchange recebido para tab:', tabId);
            this.activateTab(tabId);
        });

        // Evento para ações dos botões
        document.addEventListener('ribbon:action', (event) => {
            const { buttonId, action } = event.detail;
            console.log('[RIBBON-CONTROLLER] Evento ribbon:action recebido:', buttonId, action);
            this.handleButtonAction(buttonId, action);
        });
    }

    /**
     * Configura a comunicação com módulos carregados no iframe
     */
    setupModuleCommunication() {
        console.log('[RIBBON-CONTROLLER] Configurando comunicação com módulos');
        
        window.addEventListener('message', (event) => {
            console.log('[RIBBON-CONTROLLER] Mensagem recebida do módulo:', event.data);
            
            if (event.data && event.data.type === 'MODULE_READY') {
                this.handleModuleReady(event.data.module);
            }
            
            if (event.data && event.data.type === 'REQUEST_USER_DATA') {
                this.sendUserDataToModule();
            }
            
            if (event.data && event.data.type === 'LOAD_MODULE') {
                this.loadModuleInIframe(event.data.module);
            }
        });
    }

    /**
     * Ativa uma aba específica
     * @param {string} tabId - ID da aba a ser ativada
     */
    activateTab(tabId) {
        console.log(`[RIBBON-CONTROLLER] Ativando tab: ${tabId}`);
        
        // Verificar se o usuário está ativo
        this.verifyUserActive().then(isActive => {
            if (!isActive) return;
            
            // Verificar se a aba existe na configuração
            const tab = RibbonConfig.getTabById(tabId);
            if (!tab) {
                console.error(`[RIBBON-CONTROLLER] Tab não encontrada na configuração: ${tabId}`);
                return;
            }
            
            this.activeTab = tabId;
            this.renderer.activateTab(tabId);
            
            // Obter a URL do conteúdo da aba
            const contentUrl = RibbonConfig.getTabContentUrl(tabId);
            console.log(`[RIBBON-CONTROLLER] URL do conteúdo para tab ${tabId}: ${contentUrl}`);
            
            // Carregar o conteúdo no iframe se uma URL for fornecida
            if (contentUrl && this.moduleIframe) {
                console.log(`[RIBBON-CONTROLLER] Carregando conteúdo: ${contentUrl}`);
                this.moduleIframe.src = contentUrl;
            }
        });
    }
    
    /**
     * Verifica se o usuário está ativo
     * @returns {Promise<boolean>} - Retorna true se o usuário estiver ativo ou não houver verificação
     */
    async verifyUserActive() {
        try {
            if (!window.supabase) return true;
            
            const { data: userData } = await window.supabase.auth.getUser();
            if (!userData || !userData.user) return true;
            
            const { data: profileData, error } = await window.supabase
                .from('profiles')
                .select('is_active')
                .eq('id', userData.user.id)
                .single();
                
            if (error) {
                console.error('[RIBBON-CONTROLLER] Erro ao verificar status do usuário:', error.message);
                return true;
            }
            
            if (profileData && profileData.is_active === false) {
                console.log('[RIBBON-CONTROLLER] Usuário inativo, redirecionando para login');
                window.location.href = '/core/auth/login.html';
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('[RIBBON-CONTROLLER] Erro ao verificar status do usuário:', error);
            return true;
        }
    }

    /**
     * Manipula uma ação de botão
     * @param {string} buttonId - ID do botão clicado
     * @param {string} action - Ação associada ao botão
     */
    handleButtonAction(buttonId, action) {
        console.log(`[RIBBON-CONTROLLER] Ação de botão: ${buttonId}, ação: ${action}`);
        
        // Buscar informações do botão na configuração
        const button = RibbonConfig.getButtonById(buttonId);
        
        if (button) {
            // Verificar se o botão tem uma propriedade moduleCommand
            if (button.moduleCommand) {
                console.log(`[RIBBON-CONTROLLER] Botão possui moduleCommand: ${button.moduleCommand}`);
                // Enviar o comando para o módulo atual
                this.sendCommandToModule(button.moduleCommand, button.moduleParams || {});
            }
            
            // Verificar se o botão tem um manipulador personalizado
            if (typeof button.handler === 'function') {
                console.log(`[RIBBON-CONTROLLER] Executando handler personalizado para o botão: ${buttonId}`);
                try {
                    button.handler();
                } catch (error) {
                    console.error(`[RIBBON-CONTROLLER] Erro ao executar handler do botão:`, error);
                }
            }
        }
        
        // Delegar a ação para o RibbonManager
        this.ribbonManager.dispatchAction(buttonId, action);
        
        // Notificar a aplicação sobre a ação
        const event = new CustomEvent('app:action', {
            detail: { buttonId, action }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Envia um comando para o módulo carregado no iframe
     * @param {string} command - O comando a ser executado no módulo
     * @param {Object} params - Parâmetros adicionais para o comando
     * @returns {boolean} - True se o comando foi enviado com sucesso
     */
    sendCommandToModule(command, params = {}) {
        console.log(`[RIBBON-CONTROLLER] Enviando comando para módulo: ${command}`, params);
        
        if (!this.moduleIframe || !this.moduleIframe.contentWindow) {
            console.error('[RIBBON-CONTROLLER] Não é possível enviar comando: iframe ou contentWindow não disponível');
            return false;
        }
        
        try {
            // Enviar mensagem para o iframe com o comando
            this.moduleIframe.contentWindow.postMessage({
                type: 'RIBBON_COMMAND',
                command: command,
                params: params
            }, '*');
            
            console.log(`[RIBBON-CONTROLLER] Comando enviado para o módulo: ${command}`);
            return true;
        } catch (error) {
            console.error('[RIBBON-CONTROLLER] Erro ao enviar comando para o módulo:', error);
            return false;
        }
    }

    /**
     * Manipula quando um módulo sinaliza que está pronto
     * @param {string} moduleName - Nome do módulo que está pronto
     */
    handleModuleReady(moduleName) {
        console.log(`[RIBBON-CONTROLLER] Módulo ${moduleName} está pronto`);
        
        // Não enviar novamente RIBBON_READY, pois já recebemos MODULE_READY
        // Apenas enviar dados do usuário para o módulo
        if (this.moduleIframe && this.moduleIframe.contentWindow) {
            // Enviar dados do usuário para o módulo
            this.sendUserDataToModule();
        }
    }
    
    /**
     * Envia dados do usuário para o módulo no iframe
     */
    sendUserDataToModule() {
        console.log('[RIBBON-CONTROLLER] Enviando dados do usuário para o módulo');
        
        if (!this.moduleIframe || !this.moduleIframe.contentWindow) {
            console.error('[RIBBON-CONTROLLER] Iframe do módulo não encontrado');
            return;
        }
        
        // Obter o elemento de informações do usuário
        const userInfoElement = document.getElementById('user-info');
        const userEmail = userInfoElement ? userInfoElement.textContent : 'test@example.com';
        
        // Dados do usuário básicos para enviar ao módulo
        const userData = {
            id: 'test-user',
            email: userEmail,
            name: userEmail.split('@')[0],
            avatar_url: null
        };
        
        // Enviar os dados do usuário para o módulo
        try {
            this.moduleIframe.contentWindow.postMessage({
                type: 'USER_DATA',
                userData: userData
            }, '*');
            console.log('[RIBBON-CONTROLLER] Dados do usuário enviados com sucesso');
        } catch (e) {
            console.error('[RIBBON-CONTROLLER] Erro ao enviar dados do usuário:', e);
        }
    }
    
    /**
     * Carrega um módulo no iframe
     * @param {string} modulePath - Caminho para o módulo
     */
    loadModuleInIframe(modulePath) {
        if (this.moduleIframe) {
            console.log('[RIBBON-CONTROLLER] Carregando módulo no iframe:', modulePath);
            
            // Exibir o iframe caso esteja oculto
            this.moduleIframe.style.display = 'block';
            this.moduleIframe.style.visibility = 'visible';
            
            // Exibir o container do iframe
            const moduleContainer = document.getElementById('module-container');
            if (moduleContainer) {
                moduleContainer.style.display = 'block';
                moduleContainer.style.visibility = 'visible';
                console.log('[RIBBON-CONTROLLER] Container do iframe definido como visível');
            }
            
            // Adicionar eventos para monitorar o carregamento
            this.moduleIframe.onload = () => {
                console.log(`[RIBBON-CONTROLLER] Módulo carregado com sucesso: ${modulePath}`);
                
                // Verificar a visibilidade após o carregamento
                setTimeout(() => {
                    console.log(`[RIBBON-CONTROLLER] Status do iframe após carregamento:`, {
                        display: window.getComputedStyle(this.moduleIframe).display,
                        visibility: window.getComputedStyle(this.moduleIframe).visibility,
                        height: window.getComputedStyle(this.moduleIframe).height,
                        width: window.getComputedStyle(this.moduleIframe).width,
                        src: this.moduleIframe.src
                    });
                    
                    // Forçar a visibilidade novamente
                    this.moduleIframe.style.display = 'block';
                    this.moduleIframe.style.visibility = 'visible';
                }, 200);
            };
            
            this.moduleIframe.onerror = (error) => {
                console.error(`[RIBBON-CONTROLLER] Erro ao carregar módulo: ${error}`);
            };
            
            // Carregar o módulo
            this.moduleIframe.src = modulePath;
        } else {
            console.error('[RIBBON-CONTROLLER] Iframe não encontrado para carregar módulo:', modulePath);
        }
    }
}

// Inicializar o controlador quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('[RIBBON-CONTROLLER] DOM carregado, inicializando RibbonController');
    window.ribbonController = new RibbonController();
});

/**
 * Handle user login event
 * @param {CustomEvent} event - The login event with user data
 */
function handleUserLogin(event) {
    console.log('[RIBBON-CONTROLLER] User login event received');
    
    if (event.detail && event.detail.user) {
        const user = event.detail.user;
        console.log('[RIBBON-CONTROLLER] User logged in:', user.email);
        
        // Update the user info in the ribbon
        const userInfoElement = document.getElementById('user-info');
        if (userInfoElement) {
            userInfoElement.textContent = user.email;
            userInfoElement.style.display = 'inline-block';
            userInfoElement.style.visibility = 'visible';
            userInfoElement.style.opacity = '1';
        }
        
        // Send the user data to any loaded module
        const moduleIframe = document.getElementById('module-iframe');
        if (moduleIframe && moduleIframe.contentWindow) {
            moduleIframe.contentWindow.postMessage({
                type: 'USER_DATA',
                userData: {
                    id: user.id,
                    email: user.email,
                    name: user.email.split('@')[0],
                    avatar_url: null
                }
            }, '*');
        }
    }
} 