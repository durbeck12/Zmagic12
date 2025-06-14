/**
 * Perfil do Usuário - ZMagic12
 * 
 * Este script gerencia a funcionalidade do perfil de usuário, incluindo:
 * - Carregamento dos dados do usuário
 * - Gerenciamento de tabs
 * - Atualização de informações do perfil
 * - Recuperação de senha
 * - Estatísticas do usuário
 */

// Função para verificar e tentar carregar o sistema i18n caso não esteja disponível
function ensureI18nAvailable() {
    if (!window.Auth_I18n) {
        console.warn('[Profile] Sistema i18n não encontrado. Tentando carregar manualmente...');
        
        // Verificar se o script já foi carregado
        const i18nScript = document.getElementById('i18n-script');
        if (!i18nScript) {
            console.warn('[Profile] Script i18n-auth.js não encontrado no DOM. Criando...');
            
            // Carregar o script manualmente
            const script = document.createElement('script');
            script.id = 'i18n-script';
            script.src = 'js/i18n-auth.js';
            script.onload = () => {
                console.log('[Profile] Script i18n-auth.js carregado manualmente com sucesso.');
                
                // Inicializar após carregar
                if (window.Auth_I18n) {
                    const currentLang = localStorage.getItem('locale') || 'pt-PT';
                    console.log(`[Profile] Inicializando i18n com idioma: ${currentLang}`);
                    window.Auth_I18n.init();
                    window.Auth_I18n.setLanguage(currentLang, true);
                    window.Auth_I18n.translateElements();
                } else {
                    console.error('[Profile] Mesmo após carregar o script, Auth_I18n não está disponível.');
                }
            };
            document.head.appendChild(script);
        } else {
            console.warn('[Profile] Script i18n-auth.js encontrado, mas Auth_I18n não está disponível.');
        }
    }
}

// Inicializar o sistema de internacionalização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o sistema i18n foi carregado
    ensureI18nAvailable();
    
    if (window.Auth_I18n) {
        console.log('[Profile] Inicializando sistema de internacionalização');
        
        // Garantir que o idioma correto seja carregado do localStorage antes de inicializar
        const currentLang = localStorage.getItem('locale') || 'pt-PT';
        console.log(`[Profile] Idioma atual definido como: ${currentLang}`);
        
        // Inicializar explicitamente com o idioma selecionado
        window.Auth_I18n.init();
        window.Auth_I18n.setLanguage(currentLang, true);
        
        // Force translation again after a short delay to ensure everything is translated
        setTimeout(() => {
            console.log(`[Profile] Forçando nova tradução após inicialização para idioma: ${currentLang}`);
            // Aplicar traduções novamente com o idioma correto
            window.Auth_I18n.setLanguage(currentLang, true);
            window.Auth_I18n.translateElements();
            
            // Update language selector to match current language
            const languageSelector = document.getElementById('languageSelector');
            if (languageSelector) {
                languageSelector.value = currentLang;
                console.log(`[Profile] Language selector updated to: ${currentLang}`);
            }
        }, 500);
    } else {
        console.error('[Profile] Sistema de internacionalização não encontrado');
    }
});

// Configurações do Supabase
const SUPABASE_URL = 'https://xjmpohdtonzeafylahmr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbXBvaGR0b256ZWFmeWxhaG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY3NDUsImV4cCI6MjA1NTgxMjc0NX0.Q6aWS0jKc2-FDkhn5bkr8QUFcdQwkvPpDwfzJYWI1Ek';

// Classe principal de gerenciamento do perfil
class ProfileManager {
    constructor() {
        console.log('[Profile] Inicializando ProfileManager');
        
        // Inicializar Supabase
        this.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Variáveis para armazenar dados do usuário
        this.currentUser = null;
        
        // Inicializar elementos do DOM
        this.initializeElements();
        
        // Configurar manipuladores de eventos
        this.setupEventListeners();
        
        // Verificar se está em um iframe
        if (this.isInIframe()) {
            this.setupIframeListeners();
        } else {
            // Se não estiver em um iframe, carregar normalmente
            this.loadUserProfile();
        }
    }
    
    // Inicializar referências aos elementos do DOM
    initializeElements() {
        // Elementos principais
        this.profileModal = document.getElementById('profileModal');
        this.closeProfileBtn = document.getElementById('closeProfile');
        this.cancelProfileBtn = document.getElementById('cancelProfile');
        this.saveProfileBtn = document.getElementById('saveProfile');
        this.changePasswordBtn = document.getElementById('changePasswordBtn');
        this.profileTabs = document.querySelectorAll('.profile-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Campos do formulário
        this.fullNameInput = document.getElementById('fullName');
        this.organizationInput = document.getElementById('organization');
        this.phoneInput = document.getElementById('phone');
        this.countryInput = document.getElementById('country');
        this.newsletterSubscribedInput = document.getElementById('newsletterSubscribed');
        
        // Campos de exibição
        this.userNameElement = document.getElementById('userName');
        this.userEmailElement = document.getElementById('userEmail');
        this.userTypeElement = document.getElementById('userType');
        this.userAvatarElement = document.getElementById('userAvatar');
        this.accountEmailElement = document.getElementById('accountEmail');
        this.accountRoleElement = document.getElementById('accountRole');
        this.accountCreatedElement = document.getElementById('accountCreated');
        this.lastSignInElement = document.getElementById('lastSignIn');
        this.subscriptionPlanElement = document.getElementById('subscriptionPlan');
        this.subscriptionStartElement = document.getElementById('subscriptionStart');
        this.subscriptionValidityElement = document.getElementById('subscriptionValidity');
        this.termsAcceptedElement = document.getElementById('termsAccepted');
        this.projectCountElement = document.getElementById('projectCount');
        this.templateCountElement = document.getElementById('templateCount');
        this.formCountElement = document.getElementById('formCount');
        this.activityLogElement = document.getElementById('activityLog');
    }
    
    // Configurar manipuladores de eventos
    setupEventListeners() {
        // Fechar modal
        this.closeProfileBtn.addEventListener('click', () => this.closeProfileModal());
        this.cancelProfileBtn.addEventListener('click', () => this.closeProfileModal());
        
        // Language selector
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            // Set initial value based on current language
            const currentLang = localStorage.getItem('locale') || 'pt-PT';
            languageSelector.value = currentLang;
            
            // Handle language change
            languageSelector.addEventListener('change', () => {
                const newLang = languageSelector.value;
                console.log(`[Profile] Idioma alterado para: ${newLang}`);
                
                // Save to localStorage
                localStorage.setItem('locale', newLang);
                
                // Reload translations with multiple attempts to ensure it works
                if (window.Auth_I18n) {
                    console.log(`[Profile] Aplicando idioma: ${newLang}`);
                    
                    // Primeira aplicação imediata
                    window.Auth_I18n.setLanguage(newLang, true);
                    window.Auth_I18n.translateElements();
                    
                    // Segunda aplicação após pequeno atraso
                    setTimeout(() => {
                        console.log(`[Profile] Reforçando aplicação do idioma: ${newLang}`);
                        window.Auth_I18n.setLanguage(newLang, true);
                        window.Auth_I18n.translateElements();
                        
                        // Forçar uma atualização visual também
                        this.refreshVisibleContent();
                    }, 300);
                }
            });
        }
        
        // Alternar entre tabs
        this.profileTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remover classe ativa de todas as tabs
                this.profileTabs.forEach(t => t.classList.remove('active'));
                this.tabContents.forEach(c => c.classList.remove('active'));
                
                // Adicionar classe ativa à tab clicada
                tab.classList.add('active');
                
                // Ativar o conteúdo correspondente
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                console.log(`[Profile] Tab alterada para: ${tabId}`);
            });
        });
        
        // Salvar alterações
        this.saveProfileBtn.addEventListener('click', () => this.saveProfileChanges());
        
        // Alterar senha
        this.changePasswordBtn.addEventListener('click', () => this.requestPasswordReset());
    }
    
    // Verificar se está em um iframe
    isInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    
    // Configurar listeners para comunicação via iframe
    setupIframeListeners() {
        console.log('[Profile] Configurando listeners para iframe');
        
        // Escutar mensagens do parent
        window.addEventListener('message', (event) => {
            console.log('[Profile] Mensagem recebida:', event.data);
            
            if (event.data && event.data.type === 'LOAD_PROFILE') {
                console.log('[Profile] Recebido comando LOAD_PROFILE do parent');
                
                // Carregar perfil com os dados do usuário recebidos
                this.currentUser = event.data.user;
                
                if (this.currentUser) {
                    console.log('[Profile][iframe] Dados do usuário recebidos do parent:');
                    console.log('[Profile][iframe] Dados brutos:', JSON.stringify(this.currentUser, null, 2));
                    console.log('[Profile][iframe] Verificando campos específicos:');
                    console.log('  - full_name:', this.currentUser.full_name);
                    console.log('  - organization_name:', this.currentUser.organization_name);
                    console.log('  - phone_number:', this.currentUser.phone_number);
                    console.log('  - country:', this.currentUser.country);
                    console.log('  - newsletter_subscribed:', this.currentUser.newsletter_subscribed);
                    
                    // Verificar se existem dados de perfil no localStorage
                    try {
                        const storageKey = `user_profile_${this.currentUser.id}`;
                        const storedProfileData = localStorage.getItem(storageKey);
                        
                        if (storedProfileData) {
                            const profileData = JSON.parse(storedProfileData);
                            console.log('[Profile][iframe] Dados de perfil encontrados no localStorage:', profileData);
                            
                            // Atualizar o objeto do usuário com os dados do localStorage
                            this.currentUser.full_name = profileData.full_name;
                            this.currentUser.organization_name = profileData.organization_name;
                            this.currentUser.phone_number = profileData.phone_number;
                            this.currentUser.country = profileData.country;
                            
                            // Atenção especial para o newsletter_subscribed que é booleano
                            if (profileData.newsletter_subscribed !== undefined) {
                                this.currentUser.newsletter_subscribed = Boolean(profileData.newsletter_subscribed);
                                console.log('[Profile][iframe] Definindo newsletter_subscribed do localStorage:', this.currentUser.newsletter_subscribed);
                            }
                            
                            // Também atualizar o user_metadata
                            if (!this.currentUser.user_metadata) {
                                this.currentUser.user_metadata = {};
                            }
                            
                            this.currentUser.user_metadata.full_name = profileData.full_name;
                            this.currentUser.user_metadata.organization_name = profileData.organization_name;
                            this.currentUser.user_metadata.phone_number = profileData.phone_number;
                            this.currentUser.user_metadata.country = profileData.country;
                            
                            // Também atualizar newsletter nos metadados
                            if (profileData.newsletter_subscribed !== undefined) {
                                this.currentUser.user_metadata.newsletter_subscribed = Boolean(profileData.newsletter_subscribed);
                            }
                            
                            console.log('[Profile][iframe] Objeto do usuário atualizado com dados do localStorage');
                        } else {
                            console.log('[Profile][iframe] Nenhum dado de perfil encontrado no localStorage');
                        }
                    } catch (err) {
                        console.error('[Profile][iframe] Erro ao ler dados do localStorage:', err);
                    }
                    
                    // Exibir os dados na interface
                    this.displayUserData(this.currentUser);
                    this.loadProjectStats(this.currentUser.id);
                } else {
                    console.error('[Profile][iframe] Dados do usuário não foram recebidos ou são inválidos');
                }
            }
        });
        
        // Notificar o parent que estamos prontos
        window.parent.postMessage({ type: 'PROFILE_READY' }, '*');
        console.log('[Profile] Notificação PROFILE_READY enviada para o parent');
    }
    
    // Fechar o modal de perfil
    closeProfileModal() {
        console.log('[Profile] Fechando modal de perfil');
        
        // Se o modal estiver no iframe, enviar mensagem para o parent
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'CLOSE_PROFILE_MODAL' }, '*');
        } else {
            // Caso contrário, esconder o modal diretamente
            this.profileModal.style.display = 'none';
        }
    }
    
    // Carregar dados do usuário atual
    async loadUserProfile() {
        console.log('[Profile] Carregando dados do perfil do usuário...');
        
        try {
            // Obter o usuário atual
            const { data: { user }, error } = await this.supabaseClient.auth.getUser();
            
            if (error) {
                console.error('[Profile] Erro ao obter usuário:', error);
                return;
            }
            
            if (!user) {
                console.warn('[Profile] Nenhum usuário autenticado encontrado');
                return;
            }
            
            console.log('[Profile] Usuário carregado (dados brutos):', JSON.stringify(user, null, 2));
            
            // Certifique-se de que o objeto user tem todos os campos necessários
            // Mesmo que apenas como propriedades vazias
            this.currentUser = {
                ...user,
                // Adicionar campos padrão se não existirem
                full_name: user.user_metadata?.full_name || user.full_name || '',
                organization_name: user.user_metadata?.organization_name || user.organization_name || '',
                phone_number: user.user_metadata?.phone_number || user.phone_number || '',
                country: user.user_metadata?.country || user.country || '',
                newsletter_subscribed: user.user_metadata?.newsletter_subscribed !== undefined 
                    ? user.user_metadata.newsletter_subscribed 
                    : user.newsletter_subscribed || false,
                user_type: user.user_metadata?.user_type || user.user_type || 'Padrão',
                subscription_plan: user.user_metadata?.subscription_plan || user.subscription_plan || 'Plano não definido',
                subscription_start_date: user.user_metadata?.subscription_start_date || user.subscription_start_date || null,
                subscription_validity: user.user_metadata?.subscription_validity || user.subscription_validity || null,
                terms_accepted: user.user_metadata?.terms_accepted !== undefined 
                    ? user.user_metadata.terms_accepted 
                    : user.terms_accepted || false
            };
            
            console.log('[Profile] Objeto usuário consolidado com metadados:', this.currentUser);
            
            // Exibir dados do usuário
            this.displayUserData(this.currentUser);
            
            // Carregar estatísticas dos projetos
            this.loadProjectStats(user.id);
            
            // Verificar dados salvos no localStorage para complementar
            try {
                const storageKey = `user_profile_${user.id}`;
                const storedProfileData = localStorage.getItem(storageKey);
                
                if (storedProfileData) {
                    const profileData = JSON.parse(storedProfileData);
                    console.log('[Profile] Dados complementares encontrados no localStorage:', profileData);
                    
                    // Atualizar os campos com dados do localStorage se existirem
                    if (profileData.full_name) this.currentUser.full_name = profileData.full_name;
                    if (profileData.organization_name) this.currentUser.organization_name = profileData.organization_name;
                    if (profileData.phone_number) this.currentUser.phone_number = profileData.phone_number;
                    if (profileData.country) this.currentUser.country = profileData.country;
                    if (profileData.newsletter_subscribed !== undefined) 
                        this.currentUser.newsletter_subscribed = Boolean(profileData.newsletter_subscribed);
                    
                    // Atualizar a exibição com os dados complementares
                    this.displayUserData(this.currentUser);
                }
            } catch (err) {
                console.error('[Profile] Erro ao ler dados complementares do localStorage:', err);
            }
            
        } catch (err) {
            console.error('[Profile] Erro ao carregar perfil:', err);
        }
    }
    
    // Exibir dados do usuário na interface
    displayUserData(user) {
        console.log('[Profile] Exibindo dados do usuário na interface');
        
        // Garantir que o idioma correto esteja aplicado antes de exibir os dados
        const currentLang = localStorage.getItem('locale') || 'pt-PT';
        if (window.Auth_I18n) {
            console.log(`[Profile] Garantindo que o idioma ${currentLang} esteja aplicado antes de exibir dados`);
            window.Auth_I18n.setLanguage(currentLang, true);
        }
        
        console.log('[Profile] Valores a serem exibidos:');
        console.log('  - full_name:', user.full_name);
        console.log('  - organization_name:', user.organization_name);
        console.log('  - phone_number:', user.phone_number);
        console.log('  - country:', user.country);
        console.log('  - newsletter_subscribed:', user.newsletter_subscribed);
        console.log('  - user_type:', user.user_type);
        console.log('  - subscription_plan:', user.subscription_plan);
        
        // Preencher campos básicos do usuário
        if (this.userNameElement) this.userNameElement.textContent = user.full_name || user.email.split('@')[0];
        if (this.userEmailElement) this.userEmailElement.textContent = user.email;
        if (this.userTypeElement) {
            this.userTypeElement.textContent = `Tipo de usuário: ${user.user_type || 'Padrão'}`;
            this.userTypeElement.style.display = 'block'; // Mostrar o tipo de usuário
        }
        if (this.accountEmailElement) this.accountEmailElement.textContent = user.email;
        if (this.accountRoleElement) this.accountRoleElement.textContent = user.role || 'Usuário';
        
        // Formatação de datas
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleString('pt-BR');
        };
        
        if (this.accountCreatedElement) this.accountCreatedElement.textContent = formatDate(user.created_at);
        if (this.lastSignInElement) this.lastSignInElement.textContent = formatDate(user.last_sign_in_at);
        
        // Informações de assinatura
        if (this.subscriptionPlanElement) {
            this.subscriptionPlanElement.textContent = user.subscription_plan || 'Plano não definido';
        }
        
        if (this.subscriptionStartElement) {
            this.subscriptionStartElement.textContent = formatDate(user.subscription_start_date);
        }
        
        if (this.subscriptionValidityElement) {
            // Formatar o intervalo de validade da assinatura
            let validityText = 'N/A';
            if (user.subscription_validity) {
                // Tentar extrair informações do intervalo
                try {
                    const validityString = user.subscription_validity.toString();
                    if (validityString.includes('year') || validityString.includes('month') || 
                        validityString.includes('day')) {
                        validityText = validityString;
                    } else {
                        // Calcular data de término somando a validade à data de início
                        const startDate = new Date(user.subscription_start_date);
                        const endDate = new Date(startDate);
                        
                        // Tenta interpretar o formato de intervalo PostgreSQL
                        if (validityString.match(/\d+\s+days?/)) {
                            const days = parseInt(validityString.match(/(\d+)\s+days?/)[1]);
                            endDate.setDate(startDate.getDate() + days);
                        } else if (validityString.match(/\d+\s+months?/)) {
                            const months = parseInt(validityString.match(/(\d+)\s+months?/)[1]);
                            endDate.setMonth(startDate.getMonth() + months);
                        } else if (validityString.match(/\d+\s+years?/)) {
                            const years = parseInt(validityString.match(/(\d+)\s+years?/)[1]);
                            endDate.setFullYear(startDate.getFullYear() + years);
                        }
                        
                        validityText = `Até ${formatDate(endDate)}`;
                    }
                } catch (err) {
                    console.error('[Profile] Erro ao processar intervalo de assinatura:', err);
                    validityText = user.subscription_validity;
                }
            }
            this.subscriptionValidityElement.textContent = validityText;
        }
        
        if (this.termsAcceptedElement) {
            this.termsAcceptedElement.textContent = user.terms_accepted ? 'Sim' : 'Não';
        }
        
        // Preencher campos do formulário
        if (this.fullNameInput) this.fullNameInput.value = user.full_name || '';
        if (this.organizationInput) this.organizationInput.value = user.organization_name || '';
        if (this.phoneInput) this.phoneInput.value = user.phone_number || '';
        if (this.countryInput) this.countryInput.value = user.country || '';
        
        // Checkbox de newsletter, se existir
        if (this.newsletterSubscribedInput) {
            this.newsletterSubscribedInput.checked = Boolean(user.newsletter_subscribed);
            console.log('[Profile] Definindo checkbox newsletter para:', Boolean(user.newsletter_subscribed));
        }
    }
    
    // Carregar estatísticas dos projetos do usuário
    async loadProjectStats(userId) {
        console.log('[Profile] Carregando estatísticas de projetos...');
        
        try {
            // Contar projetos regulares
            const { data: projects, error: projectsError } = await this.supabaseClient
                .from('projects')
                .select('id')
                .eq('user_id', userId)
                .eq('archived_proj', false)
                .eq('template_proj', false);
            
            if (projectsError) throw projectsError;
            
            // Contar templates
            const { data: templates, error: templatesError } = await this.supabaseClient
                .from('projects')
                .select('id')
                .eq('user_id', userId)
                .eq('template_proj', true);
            
            if (templatesError) throw templatesError;
            
            // Contar projetos arquivados
            const { data: archived, error: archivedError } = await this.supabaseClient
                .from('projects')
                .select('id')
                .eq('user_id', userId)
                .eq('archived_proj', true);
                
            if (archivedError) throw archivedError;
            
            // Atualizar contadores
            this.projectCountElement.textContent = projects ? projects.length : 0;
            this.templateCountElement.textContent = templates ? templates.length : 0;
            this.formCountElement.textContent = archived ? archived.length : 0;
            
            console.log('[Profile] Estatísticas carregadas:', {
                projects: projects ? projects.length : 0,
                templates: templates ? templates.length : 0,
                archived: archived ? archived.length : 0
            });
            
        } catch (err) {
            console.error('[Profile] Erro ao carregar estatísticas:', err);
            // Definir valores padrão para evitar exibir NaN
            this.projectCountElement.textContent = '0';
            this.templateCountElement.textContent = '0';
            this.formCountElement.textContent = '0';
        }
    }
    
    // Salvar alterações do perfil
    async saveProfileChanges() {
        console.log('[Profile] Salvando alterações do perfil...');
        
        if (!this.currentUser) {
            console.error('[Profile] Nenhum usuário autenticado para salvar o perfil');
            return;
        }
        
        // Obter valores dos campos
        const profileData = {
            full_name: this.fullNameInput.value,
            organization_name: this.organizationInput.value,
            phone_number: this.phoneInput.value,
            country: this.countryInput.value
        };
        
        // Adicionar newsletter_subscribed se o campo existir
        if (this.newsletterSubscribedInput) {
            profileData.newsletter_subscribed = this.newsletterSubscribedInput.checked;
            console.log('[Profile] Salvando valor do newsletter checkbox:', this.newsletterSubscribedInput.checked);
        }
        
        const userData = {
            data: {
                newsletter_subscribed: profileData.newsletter_subscribed
            },
            user_metadata: {
                ...profileData,
                // Preserve existing metadata
                ...this.currentUser.user_metadata
            }
        };
        
        console.log('[Profile] Dados a serem salvos:', JSON.stringify(userData, null, 2));
        console.log('[Profile] Valores dos inputs do formulário:');
        console.log('  - fullNameInput:', this.fullNameInput.value);
        console.log('  - organizationInput:', this.organizationInput.value);
        console.log('  - phoneInput:', this.phoneInput.value);
        console.log('  - countryInput:', this.countryInput.value);
        if (this.newsletterSubscribedInput) {
            console.log('  - newsletterSubscribedInput:', this.newsletterSubscribedInput.checked);
        }
        
        // Armazenar os dados no localStorage como fallback
        try {
            const storageKey = `user_profile_${this.currentUser.id}`;
            localStorage.setItem(storageKey, JSON.stringify(profileData));
            console.log('[Profile] Dados salvos no localStorage como fallback');
        } catch (err) {
            console.error('[Profile] Erro ao salvar dados no localStorage:', err);
        }
        
        try {
            console.log('[Profile] Iniciando chamada para auth.updateUser com dados:', userData);
            
            // Mostrar o objeto Supabase para debug
            console.log('[Profile] Verificando cliente Supabase:', 
                this.supabaseClient && typeof this.supabaseClient.auth === 'object' ? 'Cliente OK' : 'Cliente inválido');
            
            // Atualizar o usuário
            const { data, error } = await this.supabaseClient.auth.updateUser(userData);
            
            if (error) {
                console.error('[Profile] Erro detalhado ao atualizar usuário:', error);
                throw error;
            }
            
            console.log('[Profile] Resposta da API após atualizar o usuário:', data);
            console.log('[Profile] Verificando se os campos foram atualizados:');
            if (data && data.user) {
                console.log('  - user_metadata:', JSON.stringify(data.user.user_metadata, null, 2));
                console.log('  - full_name em metadados:', data.user.user_metadata?.full_name);
                console.log('  - organization_name em metadados:', data.user.user_metadata?.organization_name);
                console.log('  - phone_number em metadados:', data.user.user_metadata?.phone_number);
                console.log('  - country em metadados:', data.user.user_metadata?.country);
            }
            
            console.log('[Profile] Perfil atualizado com sucesso:', userData);
            
            // Atualizar o objeto currentUser com os dados novos
            if (data && data.user) {
                console.log('[Profile] Atualizando objeto currentUser com dados da resposta');
                this.currentUser = data.user;
                
                // Certificar-se de que os campos estão disponíveis no objeto do usuário
                // Independente da resposta da API, usamos os valores dos inputs
                this.currentUser.full_name = profileData.full_name;
                this.currentUser.organization_name = profileData.organization_name;
                this.currentUser.phone_number = profileData.phone_number;
                this.currentUser.country = profileData.country;
                this.currentUser.newsletter_subscribed = profileData.newsletter_subscribed;
                
                // Para compatibilidade, também adicionamos ao user_metadata
                if (!this.currentUser.user_metadata) {
                    this.currentUser.user_metadata = {};
                }
                
                this.currentUser.user_metadata.full_name = profileData.full_name;
                this.currentUser.user_metadata.organization_name = profileData.organization_name;
                this.currentUser.user_metadata.phone_number = profileData.phone_number;
                this.currentUser.user_metadata.country = profileData.country;
                this.currentUser.user_metadata.newsletter_subscribed = profileData.newsletter_subscribed;
                
                console.log('[Profile] Objeto currentUser atualizado com dados dos inputs:', this.currentUser);
            }
            
            // Notificar outros componentes da atualização do perfil
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'PROFILE_UPDATED', user: this.currentUser }, '*');
                console.log('[Profile] Notificação PROFILE_UPDATED enviada para o parent');
            }
            
            // Fechar a caixa de perfil automaticamente após salvar
            this.closeProfileModal();
            
        } catch (err) {
            console.error('[Profile] Erro ao atualizar perfil:', err);
            alert(`Erro ao atualizar perfil: ${err.message}`);
        }
    }
    
    // Solicitar redefinição de senha
    async requestPasswordReset() {
        console.log('[Profile] Solicitando redefinição de senha');
        
        const email = this.currentUser?.email;
        
        if (!email) {
            console.error('[Profile] Email não disponível para recuperação de senha');
            return;
        }
        
        try {
            const { error } = await this.supabaseClient.auth.resetPasswordForEmail(email);
            
            if (error) throw error;
            
            alert(`Email de recuperação de senha enviado para ${email}. Verifique sua caixa de entrada.`);
            console.log('[Profile] Email de recuperação de senha enviado');
            
        } catch (err) {
            console.error('[Profile] Erro ao solicitar recuperação de senha:', err);
            alert(`Erro ao solicitar recuperação de senha: ${err.message}`);
        }
    }
    
    // Atualizar visualmente o conteúdo após mudança de idioma
    refreshVisibleContent() {
        console.log('[Profile] Atualizando conteúdo visível após mudança de idioma');
        
        // Se tivermos um usuário carregado, atualizar a exibição
        if (this.currentUser) {
            this.displayUserData(this.currentUser);
        }
        
        // Forçar nova aplicação das traduções
        if (window.Auth_I18n) {
            window.Auth_I18n.translateElements();
        }
        
        // Identificar a tab ativa e garantir que ela permaneça visível
        const activeTab = document.querySelector('.profile-tab.active');
        if (activeTab) {
            const tabId = activeTab.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            
            if (tabContent) {
                // Garantir que apenas a tab ativa esteja visível
                this.tabContents.forEach(c => c.classList.remove('active'));
                tabContent.classList.add('active');
            }
        }
    }
}

// Inicializar o gerenciador de perfil quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Profile] DOM carregado, inicializando ProfileManager');
    window.profileManager = new ProfileManager();
});
