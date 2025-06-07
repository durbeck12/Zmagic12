/**
 * Sistema de Autenticação do ZMagic12
 * Gerencia login, registro, modo offline e armazenamento seguro de dados
 */

// Auto-invoking function to avoid polluting global scope
(function() {
    // Verificar se estamos em modo de teste/desenvolvimento
    const isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // URLs e chaves do Supabase
    const SUPABASE_URL = 'https://xjmpohdtonzeafylahmr.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbXBvaGR0b256ZWFmeWxhaG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY3NDUsImV4cCI6MjA1NTgxMjc0NX0.Q6aWS0jKc2-FDkhn5bkr8QUFcdQwkvPpDwfzJYWI1Ek';
    
    // Configuração
    const config = {
        debug: isDevMode,
        supabaseUrl: SUPABASE_URL,
        supabaseKey: SUPABASE_KEY,
        authTokenName: 'zm12_auth_token',
        userDataName: 'zm12_user_data',
        offlineModeName: 'zm12_offline_mode',
        testProjectsName: 'zm12_test_projects',
        securityKey: 'zm12_sec_' + (new Date().getFullYear()),
        defaultRedirect: '/public/components/ribbon/index.html?tab=projects&logged=true',
        testModeRedirect: '/public/components/ribbon/index.html?tab=projects&logged=true&offline=true'
    };
    
    let supabaseClient = null;
    let isConnected = false;
    let isInitialized = false;
    
    /**
     * Log condicional (apenas em modo debug)
     */
    function log(...args) {
        if (config.debug) {
            console.log('[Auth]', ...args);
        }
    }
    
    /**
     * Verifica se o navegador está online
     */
    function isOnline() {
        return navigator.onLine;
    }
    
    /**
     * Função para verificar se o cliente Supabase está disponível
     */
    function verifySupabaseConnection() {
        try {
            // Verificar se o objeto global supabase existe e tem a propriedade auth
            if (typeof window.supabase === 'object' && window.supabase !== null) {
                log('Objeto Supabase global encontrado');
                
                // Verificar se tem a propriedade auth
                if (window.supabase.auth && typeof window.supabase.auth.getSession === 'function') {
                    log('API de autenticação encontrada no objeto global');
                    supabaseClient = window.supabase;
                    isConnected = true;
                    return true;
                } else {
                    log('Objeto Supabase encontrado, mas sem API de autenticação');
                }
            }
            
            // Verificar se a biblioteca está disponível
            if (typeof supabase === 'object' && supabase !== null) {
                log('Biblioteca Supabase encontrada');
                try {
                    // Criar cliente Supabase
                    log('Tentando criar cliente Supabase...');
                    supabaseClient = supabase.createClient(config.supabaseUrl, config.supabaseKey);
                    
                    // Verificar se o cliente criado tem a propriedade auth
                    if (supabaseClient.auth && typeof supabaseClient.auth.getSession === 'function') {
                        log('Cliente Supabase inicializado com sucesso!');
                        window.supabase = supabaseClient; // Tornar global
                        isConnected = true;
                        return true;
                    } else {
                        log('Cliente Supabase criado, mas sem API de autenticação');
                    }
                } catch (err) {
                    console.error('Erro ao criar cliente Supabase:', err);
                }
            }
            
            log('Biblioteca Supabase não disponível ou incompleta');
            isConnected = false;
            return false;
        } catch (e) {
            console.error('Erro ao verificar conexão Supabase:', e);
            isConnected = false;
            return false;
        }
    }
    
    /**
     * Criptografa dados sensíveis
     */
    function encryptData(data) {
        if (!data) return null;
        
        try {
            // Implementação simplificada: Base64 + chave de segurança (apenas para ofuscar)
            // Em produção, considerar usar Web Crypto API para criptografia real
            const dataStr = JSON.stringify(data);
            const encoded = btoa(dataStr + '|' + config.securityKey);
            return encoded;
        } catch (e) {
            console.error('Erro ao criptografar dados:', e);
            return null;
        }
    }
    
    /**
     * Descriptografa dados sensíveis
     */
    function decryptData(encryptedData) {
        if (!encryptedData) return null;
        
        try {
            // Implementação simplificada: Base64 + verificação de chave
            const decoded = atob(encryptedData);
            const parts = decoded.split('|');
            
            if (parts.length !== 2 || parts[1] !== config.securityKey) {
                log('Dados inválidos ou adulterados');
                return null;
            }
            
            return JSON.parse(parts[0]);
        } catch (e) {
            console.error('Erro ao descriptografar dados:', e);
            return null;
        }
    }
    
    /**
     * Armazena dados do usuário de forma segura
     */
    function storeUserData(userData, session = null) {
        if (!userData) return false;
        
        try {
            // Dados para armazenar
            const dataToStore = {
                id: userData.id,
                email: userData.email,
                user_metadata: userData.user_metadata || {},
                app_metadata: userData.app_metadata || {},
                created_at: userData.created_at,
                last_sign_in: new Date().toISOString()
            };
            
            // Se temos dados da sessão, armazenar o token
            if (session && session.access_token) {
                // Armazenar token separadamente (mais seguro que no userData)
                localStorage.setItem(config.authTokenName, encryptData({
                    token: session.access_token,
                    expires_at: session.expires_at,
                    created_at: new Date().toISOString()
                }));
            }
            
            // Armazenar dados do usuário
            localStorage.setItem(config.userDataName, encryptData(dataToStore));
            
            // Para compatibilidade com código existente
            sessionStorage.setItem('currentUser', JSON.stringify(dataToStore));
            
            log('Dados do usuário armazenados com sucesso');
            return true;
        } catch (e) {
            console.error('Erro ao armazenar dados do usuário:', e);
            return false;
        }
    }
    
    /**
     * Recupera dados do usuário armazenados
     */
    function getUserData() {
        try {
            const encryptedData = localStorage.getItem(config.userDataName);
            if (!encryptedData) return null;
            
            return decryptData(encryptedData);
        } catch (e) {
            console.error('Erro ao recuperar dados do usuário:', e);
            return null;
        }
    }
    
    /**
     * Recupera token de autenticação armazenado
     */
    function getAuthToken() {
        try {
            const encryptedToken = localStorage.getItem(config.authTokenName);
            if (!encryptedToken) return null;
            
            const tokenData = decryptData(encryptedToken);
            if (!tokenData || !tokenData.token) return null;
            
            // Verificar se o token expirou
            if (tokenData.expires_at) {
                const expiresAt = new Date(tokenData.expires_at).getTime();
                const now = new Date().getTime();
                
                if (now >= expiresAt) {
                    log('Token expirado');
                    return null;
                }
            }
            
            return tokenData.token;
        } catch (e) {
            console.error('Erro ao recuperar token de autenticação:', e);
            return null;
        }
    }
    
    /**
     * Limpa todos os dados de autenticação
     */
    function clearAuthData() {
        try {
            localStorage.removeItem(config.authTokenName);
            localStorage.removeItem(config.userDataName);
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('supabase.auth.token');
            
            log('Dados de autenticação limpos com sucesso');
            return true;
        } catch (e) {
            console.error('Erro ao limpar dados de autenticação:', e);
            return false;
        }
    }
    
    /**
     * Verifica se o usuário está autenticado
     */
    function isAuthenticated() {
        const token = getAuthToken();
        const userData = getUserData();
        
        return !!token && !!userData;
    }
    
    /**
     * Verifica se estamos em modo offline
     */
    function isOfflineMode() {
        return localStorage.getItem(config.offlineModeName) === 'true';
    }
    
    /**
     * Ativa o modo offline
     */
    function enableOfflineMode() {
        localStorage.setItem(config.offlineModeName, 'true');
        log('Modo offline ativado');
    }
    
    /**
     * Desativa o modo offline
     */
    function disableOfflineMode() {
        localStorage.removeItem(config.offlineModeName);
        log('Modo offline desativado');
    }
    
    /**
     * Cria cliente mock para teste offline
     */
    function createMockClient() {
        log('Criando cliente Supabase mock para teste offline');
        
        const mockClient = {
            _isOfflineMock: true,
            auth: {
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                signInWithPassword: ({ email }) => {
                    log('Login de teste com email:', email);
                    const mockUser = {
                        id: 'offline-user-' + Date.now(),
                        email: email || 'teste@exemplo.com',
                        user_metadata: { name: email ? email.split('@')[0] : 'Usuário Teste' },
                        created_at: new Date().toISOString()
                    };
                    
                    // Armazenar dados mock
                    storeUserData(mockUser, { 
                        access_token: 'mock-token-' + Date.now(),
                        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
                    });
                    
                    // Garantir modo offline
                    enableOfflineMode();
                    
                    return Promise.resolve({
                        data: {
                            user: mockUser,
                            session: { 
                                access_token: 'mock-token-' + Date.now(),
                                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                            }
                        },
                        error: null
                    });
                },
                signOut: () => {
                    clearAuthData();
                    return Promise.resolve({ error: null });
                }
            },
            from: (table) => ({
                select: () => ({
                    eq: () => ({
                        order: () => Promise.resolve({ data: [], error: null })
                    })
                }),
                insert: (data) => Promise.resolve({ data, error: null })
            })
        };
        
        // Tornar disponível globalmente
        window.supabase = mockClient;
        isConnected = true;
        
        return mockClient;
    }
    
    /**
     * Armazena projetos de teste para o modo offline
     */
    function storeTestProjects(user) {
        if (!user || !user.id) return;
        
        // Projetos de teste
        const testProjects = [
            {
                id: 'test-project-1',
                name: 'Projeto de Teste 1',
                description: 'Projeto para teste offline',
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'test-project-2',
                name: 'Projeto de Teste 2',
                description: 'Outro projeto para teste',
                user_id: user.id,
                created_at: new Date(Date.now() - 86400000).toISOString(),
                updated_at: new Date(Date.now() - 43200000).toISOString()
            }
        ];
        
        // Armazenar projetos de teste
        localStorage.setItem(config.testProjectsName, JSON.stringify(testProjects));
        localStorage.setItem('dashboard_projects', JSON.stringify(testProjects));
        
        log('Projetos de teste armazenados');
    }
    
    /**
     * Inicializa o sistema de autenticação
     */
    function init() {
        if (isInitialized) return;
        
        log('Inicializando sistema de autenticação');
        
        try {
            if (isOnline()) {
                log('Dispositivo online, inicializando cliente Supabase...');
                
                // Verificar se a biblioteca Supabase está disponível
                if (verifySupabaseConnection()) {
                    log('Cliente Supabase disponível e conectado');
                    supabaseClient = window.supabase;
                    isConnected = true;
                } else {
                    log('Não foi possível inicializar o cliente Supabase. Usando modo offline.');
                    supabaseClient = createMockClient();
                    enableOfflineMode();
                }
            } else {
                log('Dispositivo offline. Usando modo de teste.');
                supabaseClient = createMockClient();
                enableOfflineMode();
            }
            
            // Configurar elementos de interface
            setupUI();
            
            // Configurar eventos
            setupEvents();
            
            isInitialized = true;
        } catch (error) {
            console.error('Erro ao inicializar sistema de autenticação:', error);
            supabaseClient = createMockClient();
            enableOfflineMode();
            
            // Mostrar erro no console mas não na interface
            log('Erro de inicialização: ' + error.message);
        }
    }
    
    /**
     * Configura elementos de interface
     */
    function setupUI() {
        // Verificar se estamos em uma página de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            // Mostrar formulário (pode estar escondido se ainda estava carregando)
            loginForm.style.display = 'block';
            
            // Esconder loading se existir
            const loadingEl = document.getElementById('loading');
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }
            
            // Verificar sessão atual (se já está logado)
            checkCurrentSession();
        }
    }
    
    /**
     * Configura eventos da interface
     */
    function setupEvents() {
        // Formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }
        
        // Eventos de conexão
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
    }
    
    /**
     * Verifica se existe uma sessão ativa
     */
    function checkCurrentSession() {
        if (!supabaseClient || !supabaseClient.auth) {
            log('Cliente Supabase não disponível para verificar sessão');
            return;
        }
        
        // Verificar se temos dados guardados
        const userData = getUserData();
        const authToken = getAuthToken();
        
        if (userData && authToken) {
            log('Dados de autenticação encontrados localmente:', userData.email);
            
            // Mostrar container de usuário logado e esconder formulário
            showLoggedUserContainer(userData.email);
            
            // Configurar os botões
            setupLoggedUserActions(userData);
        }
        
        // Verificar sessão no Supabase (não redirecionamos automaticamente)
        try {
            supabaseClient.auth.getSession()
                .then(response => {
                    if (response.data && response.data.session) {
                        log('Sessão Supabase ativa:', response.data.session.user.email);
                        
                        // Mostrar container de usuário logado e esconder formulário
                        const email = response.data.session.user.email;
                        showLoggedUserContainer(email);
                        
                        // Configurar os botões
                        setupLoggedUserActions(response.data.session.user);
                    } else {
                        log('Nenhuma sessão Supabase ativa');
                    }
                })
                .catch(err => {
                    console.error('Erro ao verificar sessão Supabase:', err);
                });
        } catch (err) {
            console.error('Erro ao acessar API de autenticação:', err);
        }
    }
    
    /**
     * Mostra o container de usuário logado
     */
    function showLoggedUserContainer(email) {
        // Mostrar container de usuário logado
        const loggedUserContainer = document.getElementById('logged-user-container');
        if (loggedUserContainer) {
            loggedUserContainer.style.display = 'block';
            
            // Definir o email do usuário
            const emailSpan = document.getElementById('logged-user-email');
            if (emailSpan) {
                emailSpan.textContent = email;
            }
        }
        
        // Esconder formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.style.display = 'none';
        }
    }
    
    /**
     * Configura ações para o usuário já logado
     */
    function setupLoggedUserActions(user) {
        // Botão de continuar com a sessão
        const continueBtn = document.getElementById('continue-session-btn');
        if (continueBtn) {
            continueBtn.onclick = function() {
                processSuccessfulLogin(user, isOfflineMode());
            };
        }
        
        // Botão de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = function() {
                if (window.AuthManager && typeof window.AuthManager.logout === 'function') {
                    window.AuthManager.logout().then(() => {
                        // Esconder container de usuário logado
                        const loggedUserContainer = document.getElementById('logged-user-container');
                        if (loggedUserContainer) {
                            loggedUserContainer.style.display = 'none';
                        }
                        
                        // Mostrar formulário de login
                        const loginForm = document.getElementById('login-form');
                        if (loginForm) {
                            loginForm.style.display = 'block';
                        }
                        
                        // Limpar campo de email
                        const emailField = document.getElementById('email');
                        if (emailField) {
                            emailField.value = '';
                        }
                    });
                }
            };
        }
    }
    
    /**
     * Manipula o envio do formulário de login
     */
    function handleLoginSubmit(e) {
        e.preventDefault();
        
        showLoading();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Verificar se estamos em modo offline
        if (!isOnline()) {
            log('Login em modo offline');
            processTestModeLogin(email);
            return;
        }
        
        // Verificar se o cliente Supabase está disponível
        if (!supabaseClient || !supabaseClient.auth) {
            log('Cliente Supabase não disponível. Usando modo de teste.');
            processTestModeLogin(email);
            return;
        }
        
        try {
            // Definir timeout para evitar espera infinita
            const loginTimeout = setTimeout(() => {
                log('Timeout de login atingido');
                showErrorMessage(Auth_I18n.translate('login.timeout_reached'));
                
                // Perguntar se deseja continuar em modo offline
                if (confirm(Auth_I18n.translate('login.offline_confirm'))) {
                    processTestModeLogin(email);
                } else {
                    hideLoading();
                }
            }, 8000);
            
            // Tentar login
            supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            })
            .then(({ data, error }) => {
                // Limpar timeout
                clearTimeout(loginTimeout);
                
                if (error) {
                    log('Erro de login:', error);
                    
                    if (error.message === 'Invalid login credentials') {
                        showErrorMessage(Auth_I18n.translate('login.error_invalid_credentials'));
                    } else if (error.message === 'User account is not active') {
                        showErrorMessage(Auth_I18n.translate('login.error_account_inactive') || 'Sua conta está inativa. Entre em contato com o suporte.');
                    } else {
                        showErrorMessage(Auth_I18n.translate('login.error_generic') + ': ' + error.message);
                    }
                    
                    hideLoading();
                } else {
                    log('Login bem-sucedido!', data);
                    
                    // Salvar dados
                    if (data && data.user) {
                        // Armazenar dados do usuário
                        storeUserData(data.user, data.session);
                        
                        // Desativar modo offline se estava ativo
                        if (isOfflineMode()) {
                            disableOfflineMode();
                        }
                        
                        // Disparar evento de login bem-sucedido
                        document.dispatchEvent(new CustomEvent('login:success', { 
                            detail: { user: data.user }
                        }));
                        
                        // Redirecionar para o dashboard
                        processSuccessfulLogin(data.user);
                    } else {
                        console.error('Login bem-sucedido mas sem dados de usuário');
                        showErrorMessage(Auth_I18n.translate('login.error_user_data'));
                        hideLoading();
                    }
                }
            })
            .catch(err => {
                // Limpar timeout
                clearTimeout(loginTimeout);
                
                console.error('Erro ao processar login:', err);
                showErrorMessage(Auth_I18n.translate('login.error_connecting'));
                
                // Oferecer modo de teste
                if (confirm(Auth_I18n.translate('login.offline_confirm'))) {
                    processTestModeLogin(email);
                } else {
                    hideLoading();
                }
            });
        } catch (err) {
            console.error('Erro ao processar login:', err);
            showErrorMessage(Auth_I18n.translate('login.error_generic'));
            hideLoading();
        }
    }
    
    /**
     * Manipula o login em modo teste/offline
     */
    function handleTestModeLogin() {
        const email = document.getElementById('email').value || 'teste@exemplo.com';
        processTestModeLogin(email);
    }
    
    /**
     * Processa login no modo de teste/offline
     */
    function processTestModeLogin(email) {
        log('Processando login de teste');
        showLoading();
        
        // Se não temos cliente Supabase, criar um mock
        if (!supabaseClient || !supabaseClient._isOfflineMock) {
            supabaseClient = createMockClient();
        }
        
        // Ativar modo offline
        enableOfflineMode();
        
        // Simular login
        supabaseClient.auth.signInWithPassword({ email })
            .then(({ data }) => {
                log('Login de teste bem-sucedido');
                
                // Criar alguns projetos de teste
                storeTestProjects(data.user);
                
                // Disparar evento de login bem-sucedido
                document.dispatchEvent(new CustomEvent('login:success', { 
                    detail: { user: data.user, offline: true }
                }));
                
                // Redirecionar para o dashboard
                processSuccessfulLogin(data.user, true);
            })
            .catch(err => {
                console.error('Erro no login de teste:', err);
                hideLoading();
                showErrorMessage(Auth_I18n.translate('login.error_test_mode'));
            });
    }
    
    /**
     * Processa login bem-sucedido e redireciona
     */
    function processSuccessfulLogin(user, isOffline = false) {
        log('Processando login bem-sucedido', isOffline ? '(offline)' : '');
        
        // Mostrar mensagem de sucesso
        showSuccessMessage();
        
        // Esconder formulário
        hideLoginForm();
        
        setTimeout(() => {
            // Navegar para a página principal com parâmetros
            window.location.href = isOffline ? config.testModeRedirect : config.defaultRedirect;
        }, 1000);
    }
    
    /**
     * Manipula evento de online
     */
    function handleOnline() {
        log('Conexão restabelecida');
        // Verificar novamente a sessão atual quando a conexão for restabelecida
        checkCurrentSession();
    }
    
    /**
     * Manipula evento de offline
     */
    function handleOffline() {
        log('Conexão perdida');
        // Nenhuma ação específica quando estiver offline
    }
    
    /**
     * Mostra mensagem de erro
     */
    function showErrorMessage(message) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    /**
     * Mostra mensagem de sucesso
     */
    function showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
        }
    }
    
    /**
     * Mostra interface de carregamento
     */
    function showLoading() {
        // Esconder formulário
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.style.display = 'none';
        }
        
        // Mostrar ou criar elemento de loading
        let loadingEl = document.getElementById('loading');
        
        if (!loadingEl) {
            loadingEl = document.createElement('div');
            loadingEl.id = 'loading';
            loadingEl.className = 'loading-indicator';
            
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            loadingEl.appendChild(spinner);
            
            const loadingText = document.createElement('span');
            loadingText.textContent = Auth_I18n.translate('login.loading');
            loadingEl.appendChild(loadingText);
            
            // Adicionar à página
            const container = document.querySelector('.auth-container');
            if (container) {
                container.appendChild(loadingEl);
            } else {
                document.body.appendChild(loadingEl);
            }
        }
        
        loadingEl.style.display = 'flex';
    }
    
    /**
     * Esconde interface de carregamento
     */
    function hideLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
        
        // Mostrar formulário
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.style.display = 'block';
        }
    }
    
    /**
     * Esconde formulário de login
     */
    function hideLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.style.display = 'none';
        }
    }
    
    // Métodos expostos globalmente
    window.AuthManager = {
        init,
        isAuthenticated,
        isOfflineMode,
        getUserData,
        getAuthToken,
        logout: function() {
            if (supabaseClient && supabaseClient.auth) {
                return supabaseClient.auth.signOut()
                    .then(() => {
                        clearAuthData();
                        return { success: true };
                    })
                    .catch(error => {
                        console.error('Erro ao fazer logout:', error);
                        return { success: false, error };
                    });
            } else {
                clearAuthData();
                return Promise.resolve({ success: true });
            }
        }
    };
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 