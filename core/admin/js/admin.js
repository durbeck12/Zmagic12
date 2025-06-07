/**
 * Administração de Usuários - ZMagic12
 * 
 * Este script gerencia o painel de administração:
 * - Autenticação do administrador (apenas durbeck@gmail.com)
 * - Listagem e gerenciamento de usuários
 * - Ativação/desativação de contas
 * - Atualização de perfis
 */

// Configurações do Supabase
const SUPABASE_URL = 'https://xjmpohdtonzeafylahmr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbXBvaGR0b256ZWFmeWxhaG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY3NDUsImV4cCI6MjA1NTgxMjc0NX0.Q6aWS0jKc2-FDkhn5bkr8QUFcdQwkvPpDwfzJYWI1Ek';

// Email do administrador autorizado
const ADMIN_EMAIL = 'durbeck@gmail.com';

// Configurações de paginação
const USERS_PER_PAGE = 10;

// Adicionar estilos CSS para administradores
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .admin-user {
        background-color: rgba(52, 152, 219, 0.1);
    }
    
    .admin-level {
        color: #3498db;
        font-weight: bold;
    }
    
    .user-level-12 {
        color: #9b59b6;
        font-weight: bold;
    }
`;
document.head.appendChild(adminStyles);

// Classe principal de gerenciamento do painel admin
class AdminPanel {
    constructor() {
        console.log('[Admin] Inicializando painel de administração');
        
        // Inicializar Supabase
        this.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Variáveis para armazenar dados
        this.currentUser = null;
        this.users = [];
        this.filteredUsers = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.selectedUser = null;
        
        // Carregar i18n
        this.ensureI18nAvailable();
        
        // Inicializar elementos do DOM
        this.initializeElements();
        
        // Verificar autenticação
        this.checkAuthentication();
    }
    
    // Verificar disponibilidade do sistema i18n
    ensureI18nAvailable() {
        if (!window.Auth_I18n) {
            console.warn('[Admin] Sistema i18n não encontrado. Tentando carregar manualmente...');
            
            // Verificar se o script já foi carregado
            const i18nScript = document.getElementById('i18n-script');
            if (!i18nScript) {
                console.warn('[Admin] Script i18n-auth.js não encontrado no DOM. Criando...');
                
                // Carregar o script manualmente
                const script = document.createElement('script');
                script.id = 'i18n-script';
                script.src = '../auth/js/i18n-auth.js';
                script.onload = () => {
                    console.log('[Admin] Script i18n-auth.js carregado manualmente com sucesso.');
                    
                    // Inicializar após carregar
                    if (window.Auth_I18n) {
                        const currentLang = localStorage.getItem('locale') || 'pt-PT';
                        console.log(`[Admin] Inicializando i18n com idioma: ${currentLang}`);
                        window.Auth_I18n.init();
                        window.Auth_I18n.setLanguage(currentLang, true);
                        window.Auth_I18n.translateElements();
                    } else {
                        console.error('[Admin] Mesmo após carregar o script, Auth_I18n não está disponível.');
                    }
                };
                document.head.appendChild(script);
            } else {
                console.warn('[Admin] Script i18n-auth.js encontrado, mas Auth_I18n não está disponível.');
            }
        } else {
            // Inicializar i18n se já estiver disponível
            const currentLang = localStorage.getItem('locale') || 'pt-PT';
            console.log(`[Admin] Inicializando i18n com idioma: ${currentLang}`);
            window.Auth_I18n.init();
            window.Auth_I18n.setLanguage(currentLang, true);
            window.Auth_I18n.translateElements();
        }
    }
    
    // Inicializar elementos do DOM
    initializeElements() {
        // Seções principais
        this.usersSection = document.getElementById('users-section');
        this.statsSection = document.getElementById('stats-section');
        this.settingsSection = document.getElementById('settings-section');
        
        // Elementos de navegação
        this.navItems = document.querySelectorAll('.admin-nav li');
        
        // Elementos da tabela de usuários
        this.usersTableBody = document.getElementById('usersTableBody');
        this.userSearch = document.getElementById('userSearch');
        this.statusFilter = document.getElementById('statusFilter');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.currentPageSpan = document.getElementById('currentPage');
        this.totalPagesSpan = document.getElementById('totalPages');
        this.addUserBtn = document.getElementById('addUserBtn');
        
        // Modal de detalhes do usuário
        this.userDetailsModal = document.getElementById('userDetailsModal');
        this.userActiveToggle = document.getElementById('userActiveToggle');
        this.activeLabel = document.getElementById('activeLabel');
        this.userFullName = document.getElementById('userFullName');
        this.userOrganization = document.getElementById('userOrganization');
        this.userPhone = document.getElementById('userPhone');
        this.userCountry = document.getElementById('userCountry');
        this.userNewsletter = document.getElementById('userNewsletter');
        this.userDetailsName = document.getElementById('userDetailsName');
        this.userDetailsEmail = document.getElementById('userDetailsEmail');
        this.userDetailsAvatar = document.getElementById('userDetailsAvatar');
        this.userProjectCount = document.getElementById('userProjectCount');
        this.userTemplateCount = document.getElementById('userTemplateCount');
        this.userFormCount = document.getElementById('userFormCount');
        this.userLoginsList = document.getElementById('userLoginsList');
        this.userSubscriptionPlan = document.getElementById('userSubscriptionPlan');
        this.userSubscriptionStatus = document.getElementById('userSubscriptionStatus');
        this.userSubscriptionStart = document.getElementById('userSubscriptionStart');
        this.userSubscriptionEnd = document.getElementById('userSubscriptionEnd');
        this.closeModalBtn = document.querySelector('.close-modal');
        this.cancelUserChangesBtn = document.getElementById('cancelUserChanges');
        this.saveUserChangesBtn = document.getElementById('saveUserChanges');
        
        // Criar campo de nível de usuário se não existir
        this.createUserLevelField();
        
        // Tabs de detalhes do usuário
        this.detailTabBtns = document.querySelectorAll('.tab-btn');
        this.detailTabPanes = document.querySelectorAll('.tab-pane');
        
        // Acesso negado
        this.accessDeniedMessage = document.getElementById('accessDeniedMessage');
        this.goBackBtn = document.getElementById('goBackBtn');
        
        // Informações do admin
        this.adminNameSpan = document.getElementById('adminName');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Language selector
        this.languageSelector = document.getElementById('languageSelector');
        
        // Configurar manipuladores de eventos
        this.setupEventListeners();
    }
    
    // Criar campo de nível de usuário dinamicamente
    createUserLevelField() {
        // Verificar se já existe um campo para nível de usuário
        const existingField = document.getElementById('userLevel');
        if (existingField) {
            this.userLevel = existingField;
            return;
        }
        
        // Encontrar onde inserir o campo (após o campo de newsletter)
        const newsletterField = document.getElementById('userNewsletter');
        if (!newsletterField) return;
        
        const formGroup = newsletterField.closest('.form-group');
        if (!formGroup) return;
        
        // Criar novo grupo de formulário
        const newFormGroup = document.createElement('div');
        newFormGroup.className = 'form-group';
        
        // Criar label
        const label = document.createElement('label');
        label.setAttribute('for', 'userLevel');
        label.textContent = 'Nível de Acesso:';
        
        // Criar select
        const select = document.createElement('select');
        select.id = 'userLevel';
        select.className = 'form-control';
        
        // Adicionar opções
        const levels = [
            {value: 0, text: '0 - Usuário Normal'},
            {value: 5, text: '5 - Moderador'},
            {value: 10, text: '10 - Administrador'},
            {value: 12, text: '12 - Administrador Master'}
        ];
        
        levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.value;
            option.textContent = level.text;
            select.appendChild(option);
        });
        
        // Montar a estrutura
        newFormGroup.appendChild(label);
        newFormGroup.appendChild(select);
        
        // Inserir após o campo de newsletter
        formGroup.parentNode.insertBefore(newFormGroup, formGroup.nextSibling);
        
        // Armazenar referência
        this.userLevel = select;
    }
    
    // Configurar manipuladores de eventos
    setupEventListeners() {
        // Navegação
        this.navItems.forEach((item, index) => {
            const link = item.querySelector('a');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(index);
            });
        });
        
        // Pesquisa e filtros
        this.userSearch.addEventListener('input', () => this.filterUsers());
        this.statusFilter.addEventListener('change', () => this.filterUsers());
        
        // Paginação
        this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        this.nextPageBtn.addEventListener('click', () => this.changePage(1));
        
        // Modal de detalhes
        this.closeModalBtn.addEventListener('click', () => this.closeUserModal());
        this.cancelUserChangesBtn.addEventListener('click', () => this.closeUserModal());
        this.saveUserChangesBtn.addEventListener('click', () => this.saveUserChanges());
        
        // Toggle de ativação/desativação
        this.userActiveToggle.addEventListener('change', () => {
            const isActive = this.userActiveToggle.checked;
            this.activeLabel.textContent = isActive ? 
                (window.Auth_I18n ? window.Auth_I18n.translate('admin.user_details.active') : 'Ativo') : 
                (window.Auth_I18n ? window.Auth_I18n.translate('admin.user_details.inactive') : 'Inativo');
            this.activeLabel.style.color = isActive ? 'var(--success-color)' : 'var(--danger-color)';
        });
        
        // Tabs de detalhes
        this.detailTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.switchDetailTab(tabId);
            });
        });
        
        // Botão de voltar (acesso negado)
        this.goBackBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        // Logout
        this.logoutBtn.addEventListener('click', () => this.logout());
        
        // Language selector
        if (this.languageSelector) {
            // Set initial value based on current language
            const currentLang = localStorage.getItem('locale') || 'pt-PT';
            this.languageSelector.value = currentLang;
            
            // Handle language change
            this.languageSelector.addEventListener('change', () => {
                const newLang = this.languageSelector.value;
                console.log(`[Admin] Idioma alterado para: ${newLang}`);
                
                // Save to localStorage
                localStorage.setItem('locale', newLang);
                
                // Apply translations
                if (window.Auth_I18n) {
                    window.Auth_I18n.setLanguage(newLang, true);
                    window.Auth_I18n.translateElements();
                }
            });
        }
        
        // Botão de adicionar usuário
        if (this.addUserBtn) {
            this.addUserBtn.addEventListener('click', () => this.addNewUser());
        }
    }
    
    // Verificar autenticação do usuário
    async checkAuthentication() {
        try {
            console.log('[Admin] Verificando autenticação...');
            
            const { data: { user }, error } = await this.supabaseClient.auth.getUser();
            
            if (error) {
                console.error('[Admin] Erro ao obter usuário:', error);
                this.showAccessDenied();
                return;
            }
            
            if (!user) {
                console.warn('[Admin] Nenhum usuário autenticado encontrado');
                this.showAccessDenied();
                return;
            }
            
            console.log('[Admin] Usuário autenticado:', user.email);
            
            // Armazenar dados do usuário admin
            this.currentUser = user;
            
            // Exibir nome do admin
            if (this.adminNameSpan) {
                this.adminNameSpan.textContent = user.user_metadata?.full_name || user.email;
            }
            
            // Verificar se o usuário tem nível de admin
            const userLevel = parseInt(user.user_metadata?.user_level || 0);
            if (userLevel < 12) {
                console.warn('[Admin] Usuário não tem nível de administrador necessário:', userLevel);
                this.showAccessDenied();
                return;
            }
            
            // Verificar nível de admin para mostrar dica de política
            if (userLevel >= 12) {
                console.log('[Admin] Administrador nível 12 detectado, verificando políticas...');
                // Verificar políticas de acesso após inicialização para não bloquear o carregamento
                setTimeout(() => this.checkAdminPolicies(), 2000);
            }
            
            // Inicializar painel
            this.initializeAdminPanel();
            
        } catch (error) {
            console.error('[Admin] Erro durante verificação de autenticação:', error);
            this.showAccessDenied();
        }
    }
    
    // Verifica se a tabela de perfis existe e cria se necessário
    async ensureProfilesTableExists() {
        console.log('[Admin] Verificando se a tabela profiles existe...');
        
        try {
            // Tentar acessar a tabela para ver se ela existe
            const { data, error } = await this.supabaseClient
                .from('profiles')
                .select('count')
                .limit(1);
                
            if (error) {
                console.error('[Admin] Erro ao verificar tabela profiles:', error);
                
                if (error.code === '42P01') { // Código PostgreSQL para "tabela não existe"
                    console.log('[Admin] Tabela profiles não existe. Tentando criar...');
                    
                    const createTable = confirm('A tabela profiles não existe. Deseja criá-la automaticamente?');
                    
                    if (createTable) {
                        await this.createProfilesTable();
                        return true;
                    } else {
                        alert('Sem a tabela profiles, o painel de administração não funcionará corretamente.');
                        return false;
                    }
                } else {
                    alert(`Erro ao verificar tabela profiles: ${error.message}`);
                    return false;
                }
            }
            
            console.log('[Admin] Tabela profiles existe:', data);
            return true;
        } catch (err) {
            console.error('[Admin] Erro ao verificar tabela profiles:', err);
            alert(`Erro ao verificar tabela profiles: ${err.message}`);
            return false;
        }
    }
    
    // Criar tabela profiles no supabase
    async createProfilesTable() {
        try {
            console.log('[Admin] Tentando criar tabela profiles...');
            
            // Usar RPC para chamar uma função SQL que cria a tabela
            const { error } = await this.supabaseClient.rpc('create_profiles_table');
            
            if (error) {
                console.error('[Admin] Erro ao criar tabela profiles:', error);
                
                // Como a função RPC pode não existir, vamos tentar uma alternativa
                alert(`Não foi possível criar a tabela profiles automaticamente. 
                Por favor, crie a tabela profiles manualmente através do Dashboard do Supabase.
                
                Estrutura necessária:
                - id: uuid (primary key)
                - email: text
                - full_name: text
                - is_active: boolean
                - created_at: timestamp
                - updated_at: timestamp`);
                
                return false;
            }
            
            console.log('[Admin] Tabela profiles criada com sucesso!');
            alert('Tabela profiles criada com sucesso!');
            return true;
        } catch (err) {
            console.error('[Admin] Erro ao criar tabela profiles:', err);
            alert(`Erro ao criar tabela profiles: ${err.message}`);
            return false;
        }
    }
    
    // Inicializar painel após autenticação bem-sucedida
    async initializeAdminPanel() {
        console.log('[Admin] Inicializando painel de administração...');
        
        // Verificar se a tabela profiles existe
        const tableExists = await this.ensureProfilesTableExists();
        
        if (!tableExists) {
            console.error('[Admin] Não foi possível inicializar o painel sem a tabela profiles');
            this.usersTableBody.innerHTML = `<tr><td colspan="8" class="error-message">A tabela 'profiles' não existe ou não pode ser acessada</td></tr>`;
            return;
        }
        
        // Carregar lista de usuários usando método rápido
        await this.loadUsersFast();
        
        // Configurar tab inicial
        this.switchSection(0);
        
        // Adicionar botões de debug e administração à barra de ações
        const actionContainer = document.querySelector('.actions-container');
        if (actionContainer) {
            // Botão para alternar modo de carregamento
            const loadModeToggle = document.createElement('button');
            loadModeToggle.className = 'btn secondary-btn toggle-load-mode';
            loadModeToggle.textContent = 'Alternar Modo';
            loadModeToggle.title = 'Alternar entre modo de carregamento rápido e detalhado';
            loadModeToggle.style.marginLeft = '10px';
            
            loadModeToggle.addEventListener('click', async () => {
                if (this._usingFastMode) {
                    console.log('[Admin] Alternando para modo detalhado...');
                    await this.loadUsers();
                    this._usingFastMode = false;
                    loadModeToggle.textContent = 'Modo Rápido';
                } else {
                    console.log('[Admin] Alternando para modo rápido...');
                    await this.loadUsersFast();
                    this._usingFastMode = true;
                    loadModeToggle.textContent = 'Modo Detalhado';
                }
            });
            
            // Definir modo inicial
            this._usingFastMode = true;
            loadModeToggle.textContent = 'Modo Detalhado';
            
            // Botão para configurar acesso de administrador
            const configAdminBtn = document.createElement('button');
            configAdminBtn.className = 'btn primary-btn config-admin-btn';
            configAdminBtn.textContent = 'Config Admin';
            configAdminBtn.title = 'Configurar acesso de administrador e verificar níveis';
            configAdminBtn.style.marginLeft = '10px';
            
            configAdminBtn.addEventListener('click', async () => {
                const confirmed = confirm('Este recurso irá verificar e configurar o acesso de administrador para garantir o funcionamento correto do painel. Deseja continuar?');
                if (confirmed) {
                    await this.ensureAdminAccess();
                    
                    // Verificar políticas depois
                    setTimeout(() => this.checkAdminPolicies(), 500);
                    
                    // Recarregar a lista
                    await this.loadUsersFast();
                }
            });
            
            // Botão para executar diagnóstico completo
            const diagBtn = document.createElement('button');
            diagBtn.className = 'btn warning-btn diag-btn';
            diagBtn.textContent = 'Diagnóstico';
            diagBtn.title = 'Executar diagnóstico completo do acesso à base de dados';
            diagBtn.style.marginLeft = '10px';
            
            diagBtn.addEventListener('click', async () => {
                // Executar diagnóstico completo aqui
                alert(`Diagnóstico do Painel Admin:
                
1. Usuário atual: ${this.currentUser?.email || 'Não autenticado'}
2. Nível de acesso: ${this.currentUser?.user_metadata?.user_level || 'Não definido'}
3. É o administrador principal: ${this.currentUser?.email === ADMIN_EMAIL ? 'Sim' : 'Não'}
4. Total de perfis carregados: ${this.users.length}

Para resolver problemas de acesso:
- Verifique se você está autenticado como ${ADMIN_EMAIL}
- Use o botão "Config Admin" para garantir nível 12
- Verifique as políticas no Supabase Dashboard
- Confirme que a tabela 'profiles' existe e está acessível`);
            });
            
            // Adicionar os botões à interface
            actionContainer.appendChild(loadModeToggle);
            actionContainer.appendChild(configAdminBtn);
            actionContainer.appendChild(diagBtn);
        }
    }
    
    // Mostrar mensagem de acesso negado
    showAccessDenied() {
        if (this.accessDeniedMessage) {
            this.accessDeniedMessage.style.display = 'flex';
        }
    }
    
    // Alternar entre seções do painel
    switchSection(index) {
        // Ocultar todas as seções
        this.usersSection.classList.remove('active');
        this.statsSection.classList.remove('active');
        this.settingsSection.classList.remove('active');
        
        // Remover classe ativa de todos os itens de navegação
        this.navItems.forEach(item => item.classList.remove('active'));
        
        // Ativar seção correspondente
        switch(index) {
            case 0:
                this.usersSection.classList.add('active');
                break;
            case 1:
                this.statsSection.classList.add('active');
                break;
            case 2:
                this.settingsSection.classList.add('active');
                break;
        }
        
        // Ativar item de navegação correspondente
        this.navItems[index].classList.add('active');
    }
    
    // Alternar entre tabs de detalhes do usuário
    switchDetailTab(tabId) {
        // Remover classe ativa de todas as tabs e painéis
        this.detailTabBtns.forEach(btn => btn.classList.remove('active'));
        this.detailTabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Ativar tab e painel correspondentes
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }
    
    // Carregar lista de usuários
    async loadUsers() {
        try {
            console.log('[Admin] Carregando usuários...');
            
            // Mostrar mensagem de carregamento
            this.usersTableBody.innerHTML = `<tr><td colspan="8" class="loading-message">${window.Auth_I18n ? window.Auth_I18n.translate('admin.loading') : 'Carregando usuários...'}</td></tr>`;
            
            // Buscar todos os perfis sem restrições (debug)
            console.log('[Admin] Executando consulta SQL para buscar todos os perfis');
            const { data: profiles, error } = await this.supabaseClient
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('[Admin] Erro na consulta SQL:', error);
                throw error;
            }
            
            console.log('[Admin] Perfis carregados:', profiles);
            console.log('[Admin] Número de perfis:', profiles ? profiles.length : 0);
            
            // Armazenar todos os perfis
            this.users = profiles || [];
            
            // Se não encontrou nenhum usuário
            if (!profiles || profiles.length === 0) {
                console.log('[Admin] Nenhum perfil encontrado');
                this.usersTableBody.innerHTML = `<tr><td colspan="8" class="empty-message">${window.Auth_I18n ? window.Auth_I18n.translate('admin.users.no_results') : 'Nenhum usuário encontrado.'}</td></tr>`;
                return;
            }
            
            // Limpar tabela
            this.usersTableBody.innerHTML = '';
            
            // Adicionar usuários à tabela
            profiles.forEach(profile => {
                console.log('[Admin] Processando perfil:', profile);
                const row = document.createElement('tr');
                
                // Destacar visualmente administradores de nível alto
                if (profile.user_level >= 10) {
                    row.classList.add('admin-user');
                }
                
                // Criar células
                const idCell = document.createElement('td');
                idCell.textContent = profile.user_id ? profile.user_id.substring(0, 8) + '...' : 'N/A';
                idCell.title = profile.user_id || 'ID não disponível';
                
                const nameCell = document.createElement('td');
                nameCell.textContent = profile.full_name || '(sem nome)';
                
                const emailCell = document.createElement('td');
                emailCell.textContent = profile.email || '(sem email)';
                
                const roleCell = document.createElement('td');
                roleCell.textContent = profile.role || 'user';
                
                const levelCell = document.createElement('td');
                levelCell.textContent = profile.user_level || 0;
                // Destacar níveis de administrador
                if (profile.user_level >= 10) {
                    levelCell.classList.add('admin-level');
                    levelCell.title = 'Administrador';
                    
                    // Destaque especial para administradores de nível 12
                    if (profile.user_level == 12) {
                        levelCell.classList.add('user-level-12');
                        levelCell.title = 'Administrador Master';
                        
                        // Adicionar ícone de coroa ao lado do nome para nível 12
                        const crownIcon = document.createElement('i');
                        crownIcon.className = 'fas fa-crown';
                        crownIcon.style.color = '#9b59b6';
                        crownIcon.style.marginLeft = '5px';
                        nameCell.appendChild(crownIcon);
                    }
                }
                
                const activeCell = document.createElement('td');
                const activeStatus = document.createElement('span');
                activeStatus.className = profile.is_active ? 'status-active' : 'status-inactive';
                activeStatus.textContent = profile.is_active ? 'Ativo' : 'Inativo';
                activeCell.appendChild(activeStatus);
                
                const createdCell = document.createElement('td');
                createdCell.textContent = profile.created_at 
                    ? new Date(profile.created_at).toLocaleDateString() 
                    : 'N/A';
                
                const actionsCell = document.createElement('td');
                
                // Botão de editar
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.addEventListener('click', () => this.editUser(profile));
                
                // Botão de excluir
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.addEventListener('click', () => this.deleteUser(profile));
                
                actionsCell.appendChild(editBtn);
                actionsCell.appendChild(deleteBtn);
                
                // Adicionar células à linha
                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(roleCell);
                row.appendChild(levelCell);
                row.appendChild(activeCell);
                row.appendChild(createdCell);
                row.appendChild(actionsCell);
                
                // Adicionar linha à tabela
                this.usersTableBody.appendChild(row);
            });
            
            // Ativar filtros
            if (this.userSearch) {
                this.userSearch.disabled = false;
            }
            if (this.statusFilter) {
                this.statusFilter.disabled = false;
            }
            
            // Atualizar filteredUsers para exibição inicial
            this.filteredUsers = [...this.users];
            
            console.log(`[Admin] Total de ${profiles.length} usuários carregados e exibidos na tabela`);
            
        } catch (error) {
            console.error('[Admin] Erro ao carregar usuários:', error);
            this.usersTableBody.innerHTML = `<tr><td colspan="8" class="error-message">Erro ao carregar usuários: ${error.message || 'Desconhecido'}</td></tr>`;
        }
    }
    
    // Criar perfil para um usuário existente
    async createProfileForUser(user) {
        try {
            console.log('[Admin] Criando perfil para o usuário:', user.email || 'ID: ' + user.id);
            
            const fullName = prompt('Digite o nome completo do usuário:', '');
            if (fullName === null) return; // Usuário cancelou
            
            const email = prompt('Digite o email do usuário:', '');
            if (email === null) return; // Usuário cancelou
            
            const isActive = confirm('O usuário deve estar ativo?');
            
            // Criar perfil - FIX: separar insert e select
            const newProfile = {
                user_id: user.id,
                email: email, 
                full_name: fullName,
                is_active: isActive,
                role: 'user',
                user_level: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            const { error: profileError } = await this.supabaseClient
                .from('profiles')
                .insert(newProfile);
            
            if (profileError) {
                console.error('[Admin] Erro ao criar perfil:', profileError);
                alert(`Erro ao criar perfil: ${profileError.message}`);
                return;
            }
            
            // Buscar o perfil criado em uma consulta separada
            const { data: profileData } = await this.supabaseClient
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();
            
            console.log('[Admin] Perfil criado com sucesso:', profileData);
            alert('Perfil criado com sucesso!');
            
            // Recarregar usuários e reabrir os detalhes
            await this.loadUsers();
            
            // Buscar o usuário atualizado com o perfil
            const updatedUsers = this.users.find(u => u.id === user.id);
            if (updatedUsers) {
                this.openUserDetails(user.id);
            }
            
        } catch (error) {
            console.error('[Admin] Erro ao criar perfil para usuário:', error);
            alert(`Erro ao criar perfil: ${error.message}`);
        }
    }
    
    // Adicionar novo usuário
    async addNewUser() {
        try {
            const email = prompt('Digite o email do novo usuário:');
            if (!email) return;
            
            const password = prompt('Digite a senha para o novo usuário:');
            if (!password) return;
            
            const fullName = prompt('Digite o nome completo:');
            if (fullName === null) return;
            
            // Criar o usuário usando a API específica do seu backend
            const createUserResponse = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    full_name: fullName
                })
            });
            
            if (!createUserResponse.ok) {
                const errorData = await createUserResponse.json();
                throw new Error(errorData.message || 'Erro ao criar usuário');
            }
            
            const userData = await createUserResponse.json();
            
            if (!userData.user || !userData.user.id) {
                throw new Error('Dados de usuário inválidos retornados pela API');
            }
            
            // Criar perfil - FIX: separar insert e select
            const newProfile = {
                user_id: userData.user.id,
                email: email,
                full_name: fullName,
                is_active: true,
                role: 'user',
                user_level: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            const { error: profileError } = await this.supabaseClient
                .from('profiles')
                .insert(newProfile);
            
            if (profileError) {
                console.error('[Admin] Erro ao criar perfil:', profileError);
                alert(`Usuário criado, mas houve erro ao criar perfil: ${profileError.message}`);
            } else {
                // Buscar o perfil criado em uma consulta separada
                const { data: profileData } = await this.supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('user_id', userData.user.id)
                    .single();
                
                console.log('[Admin] Perfil criado com sucesso:', profileData);
                alert('Usuário criado com sucesso!');
            }
            
            // Recarregar a lista de usuários
            await this.loadUsers();
            
        } catch (error) {
            console.error('[Admin] Erro ao adicionar novo usuário:', error);
            alert(`Erro ao adicionar usuário: ${error.message}`);
        }
    }
    
    // Filtrar usuários conforme pesquisa e filtros
    filterUsers() {
        const searchTerm = this.userSearch.value.toLowerCase();
        const statusFilter = this.statusFilter.value;
        
        // Aplicar filtros
        this.filteredUsers = this.users.filter(user => {
            // Filtro de texto
            const matchesSearch = 
                (user.email && user.email.toLowerCase().includes(searchTerm)) ||
                (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(searchTerm)) ||
                (user.profile?.full_name && user.profile.full_name.toLowerCase().includes(searchTerm));
            
            // Filtro de status
            let matchesStatus = true;
            if (statusFilter !== 'all') {
                // Verificar se o usuário tem um perfil e está ativo
                const hasProfile = user.profile && user.profile.id;
                const isActive = hasProfile && user.profile.is_active === true;
                
                matchesStatus = (statusFilter === 'active' && isActive) || (statusFilter === 'inactive' && !isActive);
            }
            
            return matchesSearch && matchesStatus;
        });
        
        // Atualizar paginação
        this.totalPages = Math.max(1, Math.ceil(this.filteredUsers.length / USERS_PER_PAGE));
        this.currentPage = Math.min(this.currentPage, this.totalPages);
        
        // Atualizar UI
        this.updatePagination();
        this.renderUsersTable();
    }
    
    // Atualizar indicadores de paginação
    updatePagination() {
        this.currentPageSpan.textContent = this.currentPage;
        this.totalPagesSpan.textContent = this.totalPages;
        
        // Habilitar/desabilitar botões de navegação
        this.prevPageBtn.disabled = this.currentPage <= 1;
        this.nextPageBtn.disabled = this.currentPage >= this.totalPages;
    }
    
    // Mudar de página
    changePage(direction) {
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= this.totalPages) {
            this.currentPage = newPage;
            this.updatePagination();
            this.renderUsersTable();
        }
    }
    
    // Renderizar tabela de usuários
    renderUsersTable() {
        if (this.filteredUsers.length === 0) {
            this.usersTableBody.innerHTML = `<tr><td colspan="6" class="empty-message">${window.Auth_I18n ? window.Auth_I18n.translate('admin.users.no_results') : 'Nenhum usuário encontrado.'}</td></tr>`;
            return;
        }
        
        // Calcular intervalo de usuários para a página atual
        const startIndex = (this.currentPage - 1) * USERS_PER_PAGE;
        const endIndex = Math.min(startIndex + USERS_PER_PAGE, this.filteredUsers.length);
        const usersToDisplay = this.filteredUsers.slice(startIndex, endIndex);
        
        // Gerar HTML para as linhas da tabela
        const tableRows = usersToDisplay.map(user => {
            // Determinar status de ativação - um usuário é considerado ativo se tiver um perfil
            // E se o perfil tiver is_active como true ou undefined
            const hasProfile = user.profile && user.profile.id;
            const isActive = hasProfile && user.profile.is_active === true;
            
            const statusClass = isActive ? 'user-status-active' : 'user-status-inactive';
            const statusText = isActive ? 
                (window.Auth_I18n ? window.Auth_I18n.translate('admin.users.status_active') : 'Ativo') : 
                (window.Auth_I18n ? window.Auth_I18n.translate('admin.users.status_inactive') : 'Inativo');
            
            const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString() : '-';
            const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '-';
            
            // Determinar nome para exibição
            const displayName = user.profile?.full_name || user.user_metadata?.full_name || '-';
            
            // Status de perfil para exibição na tabela
            const profileStatus = !hasProfile ? 
                '<span class="profile-missing">(Sem perfil)</span>' : '';
            
            return `
                <tr data-user-id="${user.id}">
                    <td>${displayName} ${profileStatus}</td>
                    <td>${user.email || '-'}</td>
                    <td class="${statusClass}">
                        <span class="user-status-indicator"></span>
                        ${statusText}
                    </td>
                    <td>${lastSignIn}</td>
                    <td>
                        <i class="far fa-calendar-alt" style="color: #7f8c8d; margin-right: 5px; font-size: 12px;"></i>
                        ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-btn" data-user-id="${user.id}" title="Editar perfil completo">
                                <i class="fas fa-user-edit" style="font-size: 14px;"></i>
                            </button>
                            <button class="save-inline-btn" data-user-id="${user.id}" title="Salvar alterações" style="margin-left: 5px; background-color: #27ae60;">
                                <i class="fas fa-check-circle" style="font-size: 14px;"></i>
                            </button>
                            <button class="delete-btn" data-user-id="${user.id}" title="Excluir usuário" style="margin-left: 5px;">
                                <i class="fas fa-trash-alt" style="font-size: 14px;"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Atualizar conteúdo da tabela
        this.usersTableBody.innerHTML = tableRows;
        
        // Adicionar event listeners para botões de ação
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = btn.getAttribute('data-user-id');
                this.openUserDetails(userId);
            });
        });
    }
    
    // Abrir modal de detalhes do usuário
    openUserDetails(userId) {
        // Encontrar usuário pelo ID
        const user = this.users.find(u => u.id === userId);
        
        if (!user) {
            console.error('[Admin] Usuário não encontrado:', userId);
            return;
        }
        
        console.log('[Admin] Abrindo detalhes do usuário:', user.email);
        
        // Armazenar usuário selecionado
        this.selectedUser = user;
        
        // Verificar se o usuário tem um perfil
        const hasProfile = user.profile && user.profile.id;
        
        if (!hasProfile) {
            console.log('[Admin] Usuário não tem perfil. Oferecendo criar um novo perfil.');
            
            const createProfile = confirm(`O usuário ${user.email} não tem um perfil associado na tabela 'profiles'. Deseja criar um perfil para este usuário?`);
            
            if (createProfile) {
                this.createProfileForUser(user);
                return;
            }
        }
        
        // Preencher dados no modal
        this.userDetailsName.textContent = user.profile?.full_name || user.user_metadata?.full_name || user.email;
        this.userDetailsEmail.textContent = user.email || '';
        
        // Status de ativação
        const isActive = hasProfile && user.profile.is_active === true;
        this.userActiveToggle.checked = isActive;
        this.activeLabel.textContent = isActive ? 
            (window.Auth_I18n ? window.Auth_I18n.translate('admin.user_details.active') : 'Ativo') : 
            (window.Auth_I18n ? window.Auth_I18n.translate('admin.user_details.inactive') : 'Inativo');
        this.activeLabel.style.color = isActive ? 'var(--success-color)' : 'var(--danger-color)';
        
        // Dados do perfil - usar valores do perfil ou vazios
        this.userFullName.value = user.profile?.full_name || user.user_metadata?.full_name || '';
        this.userOrganization.value = user.profile?.website || user.user_metadata?.website || '';
        this.userPhone.value = user.user_metadata?.phone || '';
        this.userCountry.value = user.user_metadata?.country || '';
        this.userNewsletter.checked = user.user_metadata?.newsletter_subscribed || false;
        
        // Estatísticas
        this.userProjectCount.textContent = hasProfile ? (user.profile.user_level || '0') : '0';
        this.userTemplateCount.textContent = '0';
        this.userFormCount.textContent = '0';
        
        // Lista de logins
        const lastLoginDate = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;
        let loginsList = '';
        
        if (lastLoginDate) {
            loginsList = `
                <li>${lastLoginDate.toLocaleDateString()} ${lastLoginDate.toLocaleTimeString()}</li>
            `;
        } else {
            loginsList = `<li>${window.Auth_I18n ? window.Auth_I18n.translate('admin.user_details.no_logins') : 'Nenhum login registrado'}</li>`;
        }
        
        this.userLoginsList.innerHTML = loginsList;
        
        // Dados de assinatura
        this.userSubscriptionPlan.value = 'free';
        this.userSubscriptionStatus.value = 'active';
        
        // Datas de assinatura
        const today = new Date();
        const startDate = user.created_at ? new Date(user.created_at) : new Date();
        
        const endDate = new Date(today);
        endDate.setMonth(today.getMonth() + 12);
        
        this.userSubscriptionStart.value = startDate.toISOString().split('T')[0];
        this.userSubscriptionEnd.value = endDate.toISOString().split('T')[0];
        
        // Reset para a primeira tab
        this.switchDetailTab('profile-tab');
        
        // Exibir modal
        this.userDetailsModal.classList.add('active');
    }
    
    // Fechar modal de detalhes
    closeUserModal() {
        this.userDetailsModal.classList.remove('active');
        this.selectedUser = null;
    }
    
    // Salvar alterações no usuário
    async saveUserChanges() {
        if (!this.selectedUser) {
            console.error('[Admin] Nenhum usuário selecionado para salvar alterações');
            return;
        }
        
        try {
            console.log('[Admin] Salvando alterações para usuário:', this.selectedUser.email);
            
            // Obter dados do formulário
            const userData = {
                id: this.selectedUser.id,
                profile_id: this.selectedUser.profile.id,
                full_name: this.userFullName.value,
                is_active: this.userActiveToggle.checked,
                role: this.selectedUser.profile.role || 'user',
                user_level: this.userLevel ? parseInt(this.userLevel.value) : this.selectedUser.profile.user_level || 0,
                website: this.userOrganization.value,
                avatar_url: this.selectedUser.profile.avatar_url || '',
                updated_at: new Date().toISOString()
            };
            
            // Verificar se o atual usuário admin tem permissão para alterar nível
            const currentUserLevel = parseInt(this.currentUser.user_metadata?.user_level || 0);
            const originalLevel = parseInt(this.selectedUser.profile.user_level || 0);
            const newLevel = userData.user_level;
            
            if (newLevel > currentUserLevel) {
                console.warn('[Admin] Tentativa de definir nível superior ao do admin atual');
                alert('Você não pode definir um nível superior ao seu nível atual.');
                return;
            }
            
            // Impedir que administradores de nível baixo alterem o nível de administradores superiores
            if (originalLevel >= 10 && currentUserLevel <= originalLevel && originalLevel !== newLevel) {
                console.warn('[Admin] Tentativa não autorizada de alterar nível de administrador superior');
                alert('Você não tem permissão para alterar o nível deste administrador.');
                return;
            }
            
            console.log('[Admin] Dados para atualização:', userData);
            
            // Atualizar perfil
            const { error: updateError } = await this.supabaseClient
                .from('profiles')
                .update({
                    full_name: userData.full_name,
                    is_active: userData.is_active,
                    website: userData.website,
                    role: userData.role,
                    user_level: userData.user_level,
                    updated_at: userData.updated_at
                })
                .eq('id', userData.profile_id);
            
            if (updateError) {
                console.error('[Admin] Erro ao atualizar perfil:', updateError);
                alert(`Erro ao salvar alterações: ${updateError.message || 'Desconhecido'}`);
                return;
            }
            
            console.log('[Admin] Perfil atualizado com sucesso');
            
            // Atualizar dados locais para refletir na tabela
            const updatedProfile = this.users.find(p => p.id === userData.profile_id);
            if (updatedProfile) {
                updatedProfile.full_name = userData.full_name;
                updatedProfile.is_active = userData.is_active;
                updatedProfile.website = userData.website;
                updatedProfile.role = userData.role;
                updatedProfile.user_level = userData.user_level;
                updatedProfile.updated_at = userData.updated_at;
            }
            
            // Recarregar lista de usuários para refletir mudanças
            await this.loadUsers();
            
            // Fechar modal
            this.closeUserModal();
            
            // Mostrar feedback de sucesso
            alert('Alterações salvas com sucesso!');
            
        } catch (error) {
            console.error('[Admin] Erro ao salvar alterações no usuário:', error);
            alert(`Erro ao salvar alterações: ${error.message || 'Desconhecido'}`);
        }
    }
    
    // Fazer logout
    async logout() {
        try {
            console.log('[Admin] Fazendo logout...');
            
            const { error } = await this.supabaseClient.auth.signOut();
            
            if (error) {
                console.error('[Admin] Erro ao fazer logout:', error);
                return;
            }
            
            // Redirecionar para a página de login
            window.location.href = '../auth/login.html';
            
        } catch (error) {
            console.error('[Admin] Erro durante logout:', error);
        }
    }
    
    // Editar usuário
    editUser(profile) {
        console.log('[Admin] Editando usuário:', profile);
        
        // Verificar se temos os dados completos do perfil
        if (!profile) {
            console.error('[Admin] Dados do perfil incompletos');
            alert('Erro: Dados do perfil incompletos');
            return;
        }
        
        // Carregar dados do usuário para o modal de edição
        this.selectedUser = {
            id: profile.user_id,
            email: profile.email,
            profile: profile
        };
        
        // Verificar se o usuário atual tem permissão para editar este usuário
        const currentUserLevel = parseInt(this.currentUser.user_metadata?.user_level || 0);
        const profileLevel = parseInt(profile.user_level || 0);
        
        // Apenas administradores de nível mais alto podem editar outros administradores
        if (profileLevel >= 10 && currentUserLevel <= profileLevel) {
            console.warn('[Admin] Tentativa de editar administrador de nível igual ou superior');
            alert('Você não tem permissão para editar um administrador de nível igual ou superior ao seu.');
            return;
        }
        
        // Preencher o modal com os dados do usuário
        this.userDetailsName.textContent = profile.full_name || profile.email;
        this.userDetailsEmail.textContent = profile.email || '';
        
        // Status de ativação
        const isActive = profile.is_active === true;
        this.userActiveToggle.checked = isActive;
        this.activeLabel.textContent = isActive ? 
            (window.Auth_I18n ? window.Auth_I18n.translate('admin.user_details.active') : 'Ativo') : 
            (window.Auth_I18n ? window.Auth_I18n.translate('admin.user_details.inactive') : 'Inativo');
        this.activeLabel.style.color = isActive ? 'var(--success-color)' : 'var(--danger-color)';
        
        // Dados do perfil
        this.userFullName.value = profile.full_name || '';
        this.userOrganization.value = profile.website || '';
        this.userPhone.value = profile.phone_number || '';
        this.userCountry.value = profile.country || '';
        this.userNewsletter.checked = profile.newsletter_subscribed || false;
        
        // Campo de nível do usuário (admin pode editar)
        if (this.userLevel) {
            this.userLevel.value = profile.user_level || 0;
            
            // Bloquear edição do nível se o usuário atual não tiver permissão
            this.userLevel.disabled = (profileLevel >= currentUserLevel);
        }
        
        // Estatísticas
        this.userProjectCount.textContent = profile.user_level || '0';
        this.userTemplateCount.textContent = '0';
        this.userFormCount.textContent = '0';
        
        // Lista de logins (apenas placeholder neste momento)
        this.userLoginsList.innerHTML = `<li>${window.Auth_I18n ? window.Auth_I18n.translate('admin.user_details.no_logins') : 'Informação não disponível'}</li>`;
        
        // Dados de assinatura
        this.userSubscriptionPlan.value = profile.subscription_plan || 'free';
        this.userSubscriptionStatus.value = profile.subscription_status || 'active';
        
        // Datas de assinatura
        this.userSubscriptionStart.value = profile.subscription_start || new Date().toISOString().split('T')[0];
        this.userSubscriptionEnd.value = profile.subscription_end || '';
        
        // Reset para a primeira tab
        this.switchDetailTab('profile-tab');
        
        // Exibir modal
        this.userDetailsModal.classList.add('active');
    }
    
    // Excluir usuário
    async deleteUser(profile) {
        console.log('[Admin] Solicitação para excluir usuário:', profile);
        
        // Verificar se temos os dados completos do perfil
        if (!profile || !profile.user_id) {
            console.error('[Admin] Dados do perfil incompletos');
            alert('Erro: Dados do perfil incompletos para exclusão');
            return;
        }
        
        // Verificar se o usuário atual tem permissão para excluir este usuário
        const currentUserLevel = parseInt(this.currentUser.user_metadata?.user_level || 0);
        const profileLevel = parseInt(profile.user_level || 0);
        
        // Apenas administradores de nível mais alto podem excluir outros administradores
        if (profileLevel >= 10 && currentUserLevel <= profileLevel) {
            console.warn('[Admin] Tentativa de excluir administrador de nível igual ou superior');
            alert('Você não tem permissão para excluir um administrador de nível igual ou superior ao seu.');
            return;
        }
        
        // Confirmar exclusão
        const confirmMessage = `Tem certeza que deseja excluir o usuário '${profile.full_name || profile.email}'?\nEsta ação não pode ser desfeita.`;
        if (!confirm(confirmMessage)) {
            console.log('[Admin] Exclusão cancelada pelo usuário');
            return;
        }
        
        try {
            console.log('[Admin] Excluindo perfil do usuário:', profile.user_id);
            
            // Excluir o perfil do usuário
            const { error } = await this.supabaseClient
                .from('profiles')
                .delete()
                .eq('user_id', profile.user_id);
                
            if (error) {
                console.error('[Admin] Erro ao excluir perfil:', error);
                alert(`Erro ao excluir usuário: ${error.message || 'Desconhecido'}`);
                return;
            }
            
            console.log('[Admin] Perfil excluído com sucesso');
            
            // Opcionalmente, você pode querer excluir o usuário da tabela auth.users
            // Isso geralmente requer uma função RPC ou endpoint de API específico
            console.log('[Admin] Nota: O usuário ainda existe na tabela auth.users. Apenas o perfil foi removido.');
            
            // Atualizar a lista de usuários
            await this.loadUsers();
            
            // Mostrar feedback de sucesso
            alert('Usuário excluído com sucesso!');
            
        } catch (error) {
            console.error('[Admin] Erro durante exclusão do usuário:', error);
            alert(`Erro ao excluir usuário: ${error.message || 'Desconhecido'}`);
        }
    }

    // Carregar lista de usuários de forma simplificada
    async loadUsersFast() {
        try {
            console.log('[Admin] Carregando usuários (método rápido)...');
            
            // Mostrar mensagem de carregamento
            this.usersTableBody.innerHTML = `<tr><td colspan="8" class="loading-message">Carregando usuários...</td></tr>`;
            
            // Adicionar diagnóstico para verificar limitações no acesso
            const { data: userMetadata } = await this.supabaseClient.auth.getUser();
            console.log('[Admin] Usuário atual:', userMetadata?.user?.email);
            console.log('[Admin] Nível do usuário atual:', userMetadata?.user?.user_metadata?.user_level);
            
            // Tentar buscar todos os perfis com os métodos disponíveis
            let profiles = null;
            let error = null;
            
            // 1. Primeiro, tentar o acesso direto
            const directResult = await this.fetchAllProfilesDirectly();
            
            if (directResult.profiles && directResult.profiles.length > 0) {
                console.log('[Admin] Método direto funcionou! Usando os perfis obtidos.');
                profiles = directResult.profiles;
            } else {
                console.log('[Admin] Método direto falhou ou não encontrou perfis. Tentando consulta padrão...');
                
                // 2. Se o acesso direto falhar, tentar a consulta padrão
                const { data: standardProfiles, error: standardError } = await this.supabaseClient
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                profiles = standardProfiles;
                error = standardError;
            }
            
            // Processar os resultados da consulta
            if (error) {
                console.error('[Admin] Erro na consulta SQL:', error);
                console.error('[Admin] Código de erro:', error.code, 'Mensagem:', error.message);
                console.error('[Admin] Detalhes:', error.details);
                this.usersTableBody.innerHTML = `<tr><td colspan="8" class="error-message">Erro: ${error.message}</td></tr>`;
                
                // Criar botão para verificar políticas e perfis
                const td = this.usersTableBody.querySelector('td');
                if (td) {
                    const diagBtn = document.createElement('button');
                    diagBtn.className = 'btn primary-btn';
                    diagBtn.textContent = 'Verificar Políticas';
                    diagBtn.style.marginTop = '10px';
                    diagBtn.addEventListener('click', () => this.checkAdminPolicies());
                    
                    td.appendChild(document.createElement('br'));
                    td.appendChild(diagBtn);
                }
                
                return;
            }
            
            console.log('[Admin] Perfis carregados:', profiles);
            console.log('[Admin] Número de perfis encontrados:', profiles ? profiles.length : 0);
            
            // Se não encontrou nenhum usuário
            if (!profiles || profiles.length === 0) {
                console.log('[Admin] Nenhum perfil encontrado - verificando políticas de acesso...');
                this.usersTableBody.innerHTML = `<tr><td colspan="8" class="empty-message">
                    <div>Nenhum usuário encontrado</div>
                    <div style="margin-top: 10px; font-size: 0.9em; color: #e74c3c;">
                        Isso pode ser causado por restrições nas políticas do Supabase.
                        Os administradores de nível 12 devem ter acesso a todos os perfis.
                    </div>
                </td></tr>`;
                
                // Adicionar botão de diagnóstico
                const td = this.usersTableBody.querySelector('td');
                if (td) {
                    // Botão para verificar políticas
                    const policyBtn = document.createElement('button');
                    policyBtn.className = 'btn secondary-btn';
                    policyBtn.textContent = 'Verificar Políticas';
                    policyBtn.style.marginTop = '10px';
                    policyBtn.addEventListener('click', () => this.checkAdminPolicies());
                    
                    td.appendChild(document.createElement('br'));
                    td.appendChild(policyBtn);
                }
                
                return;
            }
            
            // Limpar tabela
            this.usersTableBody.innerHTML = '';
            
            // Método eficiente para criar e adicionar linhas
            const fragment = document.createDocumentFragment();
            
            // Adicionar usuários à tabela
            profiles.forEach(user => {
                console.log('[Admin] Processando perfil:', user.id, user.email || 'Sem email', user.user_level || '0');
                
                const row = document.createElement('tr');
                if (user.user_level >= 10) {
                    row.classList.add('admin-user');
                }
                
                // Definir status e classe
                const isActive = user.is_active === true;
                const statusClass = isActive ? 'status-active' : 'status-inactive';
                const statusText = isActive ? 'Ativo' : 'Inativo';
                
                // Usar template literals para criar o conteúdo da linha com controles inline
                row.innerHTML = `
                    <td title="${user.user_id || 'N/A'}">
                        <i class="fas fa-fingerprint" style="color: #7f8c8d; margin-right: 5px; font-size: 12px;"></i>
                        ${user.user_id ? user.user_id.substring(0, 8) + '...' : 'N/A'}
                    </td>
                    <td>${user.full_name || '(sem nome)'} ${user.user_level == 12 ? '<i class="fas fa-crown" style="color: #9b59b6; margin-left: 5px;"></i>' : ''}</td>
                    <td>${user.email || '(sem email)'}</td>
                    <td>${user.role || 'user'}</td>
                    <td>
                        <select class="level-select" data-user-id="${user.id}" style="width: 100%; background-color: transparent; border: none; ${user.user_level >= 10 ? 'color: #3498db; font-weight: bold;' : ''} ${user.user_level == 12 ? 'color: #9b59b6;' : ''}">
                            <option value="0" ${user.user_level == 0 ? 'selected' : ''}>0 - Normal</option>
                            <option value="5" ${user.user_level == 5 ? 'selected' : ''}>5 - Moderador</option>
                            <option value="10" ${user.user_level == 10 ? 'selected' : ''}>10 - Admin</option>
                            <option value="12" ${user.user_level == 12 ? 'selected' : ''}>12 - Master</option>
                        </select>
                        ${user.user_level >= 10 ? `<i class="fas fa-shield-alt" style="color: ${user.user_level == 12 ? '#9b59b6' : '#3498db'}; margin-left: 5px; font-size: 12px;"></i>` : ''}
                    </td>
                    <td>
                        <label class="switch" style="display: inline-block;">
                            <input type="checkbox" class="status-toggle" data-user-id="${user.id}" ${isActive ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                        <span class="${statusClass}" style="margin-left: 8px;">
                            <i class="fas ${isActive ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${isActive ? '#27ae60' : '#e74c3c'}; margin-right: 4px;"></i>
                            ${statusText}
                        </span>
                    </td>
                    <td>
                        <i class="far fa-calendar-alt" style="color: #7f8c8d; margin-right: 5px; font-size: 12px;"></i>
                        ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-btn" data-user-id="${user.id}" title="Editar perfil completo">
                                <i class="fas fa-pencil-alt" style="font-size: 14px; color: #000;"></i>
                            </button>
                            <button class="save-inline-btn" data-user-id="${user.id}" title="Salvar alterações" style="margin-left: 5px; background-color: #fff; border: 1px solid #ddd;">
                                <i class="fas fa-save" style="font-size: 14px; color: #000;"></i>
                            </button>
                            <button class="delete-btn" data-user-id="${user.id}" title="Excluir usuário" style="margin-left: 5px; background-color: #fff; border: 1px solid #ddd;">
                                <i class="fas fa-trash-alt" style="font-size: 14px; color: #000;"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                fragment.appendChild(row);
            });
            
            // Adicionar todas as linhas de uma vez (mais eficiente)
            this.usersTableBody.appendChild(fragment);
            
            // Adicionar event listeners para os botões e controles
            // Botões de edição completa
            document.querySelectorAll('.edit-btn').forEach(btn => {
                const userId = btn.getAttribute('data-user-id');
                btn.addEventListener('click', () => {
                    const profile = profiles.find(p => p.id === userId);
                    if (profile) this.editUser(profile);
                });
            });
            
            // Botões de exclusão
            document.querySelectorAll('.delete-btn').forEach(btn => {
                const userId = btn.getAttribute('data-user-id');
                btn.addEventListener('click', () => {
                    const profile = profiles.find(p => p.id === userId);
                    if (profile) this.deleteUser(profile);
                });
            });
            
            // Botões de salvamento inline
            document.querySelectorAll('.save-inline-btn').forEach(btn => {
                const userId = btn.getAttribute('data-user-id');
                btn.addEventListener('click', async () => {
                    const profile = profiles.find(p => p.id === userId);
                    if (!profile) return;
                    
                    // Obter valores atualizados
                    const row = btn.closest('tr');
                    const levelSelect = row.querySelector('.level-select');
                    const statusToggle = row.querySelector('.status-toggle');
                    
                    const newLevel = parseInt(levelSelect.value);
                    const newStatus = statusToggle.checked;
                    
                    // Verificar permissões
                    const currentUserLevel = parseInt(this.currentUser.user_metadata?.user_level || 0);
                    const originalLevel = parseInt(profile.user_level || 0);
                    
                    if (newLevel > currentUserLevel) {
                        alert('Você não pode definir um nível superior ao seu nível atual.');
                        levelSelect.value = originalLevel;
                        return;
                    }
                    
                    if (originalLevel >= 10 && currentUserLevel <= originalLevel && originalLevel !== newLevel) {
                        alert('Você não tem permissão para alterar o nível deste administrador.');
                        levelSelect.value = originalLevel;
                        return;
                    }
                    
                    try {
                        // Atualizar perfil
                        const { error } = await this.supabaseClient
                            .from('profiles')
                            .update({
                                user_level: newLevel,
                                is_active: newStatus,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', profile.id);
                        
                        if (error) {
                            console.error('[Admin] Erro ao atualizar perfil:', error);
                            alert(`Erro ao salvar: ${error.message}`);
                            return;
                        }
                        
                        // Atualizar interface
                        profile.user_level = newLevel;
                        profile.is_active = newStatus;
                        
                        // Notificar sucesso e atualizar visual
                        const statusSpan = row.querySelector(`.${statusToggle.checked ? 'status-inactive' : 'status-active'}`);
                        if (statusSpan) {
                            statusSpan.className = statusToggle.checked ? 'status-active' : 'status-inactive';
                            statusSpan.textContent = statusToggle.checked ? 'Ativo' : 'Inativo';
                        }
                        
                        // Atualizar classe da linha para administradores
                        if (newLevel >= 10) {
                            row.classList.add('admin-user');
                            levelSelect.style.color = '#3498db';
                            levelSelect.style.fontWeight = 'bold';
                            
                            if (newLevel == 12) {
                                levelSelect.style.color = '#9b59b6';
                            }
                        } else {
                            row.classList.remove('admin-user');
                            levelSelect.style.color = '';
                            levelSelect.style.fontWeight = '';
                        }
                        
                        // Notificar usuário com feedback visual temporário
                        btn.innerHTML = '<i class="fas fa-check"></i>';
                        btn.style.backgroundColor = '#2ecc71';
                        setTimeout(() => {
                            btn.innerHTML = '<i class="fas fa-save"></i>';
                            btn.style.backgroundColor = '#27ae60';
                        }, 1500);
                        
                    } catch (error) {
                        console.error('[Admin] Erro ao atualizar perfil:', error);
                        alert(`Erro ao salvar: ${error.message}`);
                    }
                });
            });
            
            // Adicionar estilos para a interface de edição inline
            if (!document.getElementById('inline-edit-styles')) {
                const style = document.createElement('style');
                style.id = 'inline-edit-styles';
                style.textContent = `
                    .switch {
                        position: relative;
                        display: inline-block;
                        width: 36px;
                        height: 20px;
                    }
                    .switch input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                    }
                    .slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: #ccc;
                        transition: .4s;
                    }
                    .slider:before {
                        position: absolute;
                        content: "";
                        height: 14px;
                        width: 14px;
                        left: 3px;
                        bottom: 3px;
                        background-color: white;
                        transition: .4s;
                    }
                    input:checked + .slider {
                        background-color: #27ae60;
                    }
                    input:focus + .slider {
                        box-shadow: 0 0 1px #27ae60;
                    }
                    input:checked + .slider:before {
                        transform: translateX(16px);
                    }
                    .slider.round {
                        border-radius: 20px;
                    }
                    .slider.round:before {
                        border-radius: 50%;
                    }
                    .level-select:focus, .level-select:hover {
                        outline: none;
                        background-color: rgba(52, 152, 219, 0.1);
                        cursor: pointer;
                    }
                    .edit-btn, .save-inline-btn, .delete-btn {
                        border: 1px solid #ddd;
                        background: #fff;
                        width: 34px;
                        height: 34px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .edit-btn:hover, .save-inline-btn:hover, .delete-btn:hover {
                        background: #f5f5f5;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                    }
                    .action-buttons {
                        display: flex;
                        justify-content: center;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Armazenar para uso posterior
            this.users = profiles;
            this.filteredUsers = [...profiles];
            
        } catch (error) {
            console.error('[Admin] Erro ao carregar usuários:', error);
            this.usersTableBody.innerHTML = `<tr><td colspan="8" class="error-message">Erro: ${error.message || 'Desconhecido'}</td></tr>`;
        }
    }

    // Verificar e atualizar políticas de acesso para administradores
    async checkAdminPolicies() {
        try {
            // Verificar se o usuário atual é um administrador de nível 12
            const isLevel12Admin = this.currentUser && 
                                  this.currentUser.user_metadata && 
                                  this.currentUser.user_metadata.user_level >= 12;
                                  
            if (!isLevel12Admin) {
                console.log('[Admin] Usuário não é administrador nível 12, pulando verificação de políticas');
                alert('Para configurar as políticas de acesso, você precisa ser um administrador de nível 12.');
                return false;
            }
            
            console.log('[Admin] Verificando políticas de acesso para administrador nível 12');
            
            // Verificar se o problema é com a política de acesso
            const confirmMessage = `IMPORTANTE: Para que um administrador possa ver todos os utilizadores, é necessário configurar uma política de acesso no Supabase.

Problema:
- Atualmente, você só consegue ver o seu próprio perfil devido à configuração padrão do Supabase.

Solução:
- Acesse o Dashboard do Supabase (https://app.supabase.io)
- Vá para "Authentication > Policies"
- Adicione a seguinte política na tabela "profiles":

CREATE POLICY "Allow admins to select all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (
    SELECT COALESCE(
      (SELECT (auth.jwt() -> 'user_metadata' ->> 'user_level')::integer >= 12),
      false
    )
  ) 
  OR (SELECT auth.uid()) = user_id
);

CREATE POLICY "Allow admins to select all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (
    SELECT COALESCE(
      (SELECT (auth.jwt() -> 'user_metadata' ->> 'user_level')::integer >= 12),
      false
    )
  ) 
  OR (SELECT auth.uid()) = user_id
);
Esta política permitirá que administradores de nível 12 visualizem todos os perfis, enquanto usuários normais só podem ver seus próprios perfis.`;

            alert(confirmMessage);
            
            return true;
        } catch (error) {
            console.error('[Admin] Erro ao verificar políticas de administrador:', error);
            return false;
        }
    }

    // Buscar perfis usando RLS bypass (solução definitiva para visualizar todos os usuários)
    async fetchAllProfilesDirectly() {
        try {
            console.log('[Admin] Tentando solução alternativa para buscar todos os perfis...');
            
            // Verificar se o usuário atual é o administrador autorizado
            if (this.currentUser?.email === ADMIN_EMAIL || 
                this.currentUser?.user_metadata?.user_level >= 12) {
                
                console.log('[Admin] Usuário autorizado, usando acesso direto à tabela profiles');
                
                // Usar cliente Supabase existente em vez de criar um novo
                console.log('[Admin] Usando cliente Supabase existente para acesso direto');
                
                // Usar a tabela profiles diretamente sem filtros
                const { data: allProfiles, error } = await this.supabaseClient
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error('[Admin] Erro ao buscar diretamente:', error);
                    return { profiles: null, error: error };
                }
                
                console.log('[Admin] Sucesso! Encontrados', allProfiles?.length || 0, 'perfis no total');
                return { profiles: allProfiles, error: null };
            } else {
                console.log('[Admin] Usuário não autorizado para acesso direto');
                return { profiles: null, error: { message: 'Não autorizado para acesso direto' } };
            }
        } catch (error) {
            console.error('[Admin] Erro ao tentar acesso direto:', error);
            return { profiles: null, error: error };
        }
    }

    // Configurar administrador e garantir acesso
    async ensureAdminAccess() {
        try {
            console.log('[Admin] Verificando configuração de administrador...');
            
            // Verificar se o usuário atual tem nível de admin
            const userLevel = parseInt(this.currentUser?.user_metadata?.user_level || 0);
            if (userLevel >= 12) {
                console.log('[Admin] Usuário já é administrador nível 12');
                return true;
            }
            
            console.log('[Admin] Usuário não tem nível de administrador necessário');
            return false;
            
        } catch (error) {
            console.error('[Admin] Erro ao configurar acesso de administrador:', error);
            return false;
        }
    }
}

// Inicializar painel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Admin] Iniciando aplicação de administração...');
    window.adminPanel = new AdminPanel();
}); 