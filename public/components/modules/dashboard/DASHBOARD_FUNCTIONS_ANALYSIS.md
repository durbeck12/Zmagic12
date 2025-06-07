# Dashboard Module - Análise de Funções

Este documento apresenta uma análise completa de todas as funções no módulo Dashboard, organizadas por classe/arquivo, com identificação de funções duplicadas ou em conflito.

## Índice
1. [DashboardModule](#dashboardmodule)
2. [UserManager](#usermanager)
3. [ProjectManager](#projectmanager)
4. [UIManager](#uimanager)
5. [DashboardI18nManager](#dashboardi18nmanager)
6. [SupabaseConfig](#supabaseconfig)
7. [Utilitários](#utilitários)
8. [Funções Duplicadas/Conflitantes](#funções-duplicadasconflitantes)
9. [Soluções Propostas](#soluções-propostas)

---

## DashboardModule

**Arquivo**: `js/core/DashboardModule.js`

### Construtor
- `constructor()` - Inicializa os gerenciadores e variáveis de estado

### Métodos Principais
- `init()` - Inicializa o módulo, verifica autenticação e carrega dados iniciais
- `loadInitialData()` - Carrega os dados iniciais de acordo com a tab atual
- `initEventListeners()` - Configura todos os event listeners do módulo
- `setupRibbonCommunication()` - Configura comunicação com o Ribbon
- `handleRibbonCommand(command, params)` - Processa comandos recebidos do Ribbon
- `showNewProjectModal()` - Exibe o modal de novo projeto
- `handleTabChangeCommand(params)` - Manipula o comando de mudança de tab do Ribbon
- `reloadProjects(params)` - Recarrega projetos de acordo com os parâmetros
- `handleTabChange(tabName)` - Manipula a mudança de tab na interface

---

## UserManager

**Arquivo**: `js/managers/UserManager.js`

### Construtor
- `constructor()` - Inicializa o gerenciador de usuário

### Métodos de Verificação
- `checkProfilesTable()` - Verifica se a tabela profiles existe no banco de dados
- `isAuthenticated()` - Verifica se o usuário está autenticado
- `hasRole(role)` - Verifica se o usuário possui uma determinada função/role

### Métodos de Dados de Usuário
- `initEventListeners()` - Configura listeners para mudanças na autenticação
- `getCurrentUser()` - Obtém dados do usuário atual
- `createDefaultProfile(userId)` - Cria um perfil padrão para o usuário
- `updateProfile(updates)` - Atualiza o perfil do usuário
- `uploadAvatar(file)` - Faz upload de um avatar para o usuário
- `signOut()` - Desconecta o usuário atual
- `getLastActive()` - Obtém a última data de atividade do usuário
- `ensureUserProfile()` - Garante que o usuário tenha um perfil criado

---

## ProjectManager

**Arquivo**: `js/managers/ProjectManager.js`

### Construtor
- `constructor()` - Inicializa o gerenciador de projetos
- `setUIManager(uiManager)` - Define o gerenciador de UI para uso interno

### Event Listeners
- `initEventListeners()` - Configura todos os event listeners relacionados a projetos

### Métodos de Carregamento
- `loadUserProjects(userId, forceReload)` - Carrega projetos ativos do usuário
- `loadArchivedProjects(userId, forceReload)` - Carrega projetos arquivados do usuário
- `loadTemplates(userId, forceReload)` - Carrega templates do usuário
- `getProjectById(projectId)` - Obtém um projeto pelo ID

### Métodos de Manipulação de Projetos
- `handleProjectEdit(projectData)` - Manipula a edição de um projeto
- `validateProjectData(data)` - Valida dados de um projeto
- `updateLocalProjectData(updatedData)` - Atualiza dados de projeto no cache local
- `createProject(projectData)` - Cria um novo projeto
- `updateProject(projectId, updates)` - Atualiza um projeto existente
- `deleteProject(projectId)` - Exclui um projeto
- `toggleProjectArchiveState(projectId)` - Alterna o estado de arquivamento de um projeto
- `toggleArchiveProject(projectId)` - Função específica para alternar arquivamento
- `toggleTemplateProject(projectId)` - Alterna um projeto entre normal e template
- `duplicateProject(projectId)` - Duplica um projeto existente
- `copyProjectToTemplate(projectId)` - Copia um projeto para um template

---

## UIManager

**Arquivo**: `js/ui/UIManager.js`

### Construtor
- `constructor()` - Inicializa o gerenciador de UI

### Métodos de Internacionalização
- `setupI18nListeners()` - Configura listeners para eventos de tradução
- `updateDynamicTranslations()` - Atualiza traduções de elementos dinâmicos
- `updateEmptyStateMessages()` - Atualiza mensagens de estado vazio
- `translateProjectCards()` - Traduz todos os cards de projetos na tela
- `translateOpenModals()` - Traduz modais abertos

### Event Listeners
- `initEventListeners()` - Configura todos os event listeners da UI

### Métodos de Container
- `getContainerForType(containerType)` - Obtém o container para um tipo específico
- `getContainerTypeFromCard(card)` - Obtém o tipo de container de um card
- `getContainerType(containerId)` - Obtém o tipo de container pelo ID

### Métodos de Projetos
- `renderProjects(projects, tabName)` - Renderiza projetos em um container
- `createProjectCard(project, containerType)` - Cria um card de projeto
- `attachProjectCardEventListeners(card, project, containerType)` - Anexa event listeners a um card
- `removeProjectFromUI(projectId)` - Remove um projeto da UI
- `updateProjectInUI(updatedProject)` - Atualiza um projeto na UI
- `updateProjectCard(card, updatedProject)` - Atualiza um card de projeto específico
- `addProjectToUI(project)` - Adiciona um projeto à UI

### Métodos de UI
- `updateUserInfo(user)` - Atualiza informações do usuário na UI
- `switchTab(tabName)` - Muda para uma tab específica
- `formatDate(dateString)` - Formata uma data para exibição
- `showEmptyState(message, container)` - Mostra mensagem de estado vazio
- `showError(message, key)` - Mostra mensagem de erro
- `showSuccess(message, key)` - Mostra mensagem de sucesso
- `showLoading()` - Mostra indicador de carregamento
- `hideLoading()` - Esconde indicador de carregamento
- `updateActiveTab(tabName)` - Atualiza a tab ativa visualmente

### Métodos de Modal
- `showNewProjectModal()` - Exibe o modal de novo projeto
- `hideNewProjectModal()` - Esconde o modal de novo projeto
- `handleNewProject(projectData)` - Manipula a criação de um novo projeto
- `showEditProjectModal(project)` - Exibe o modal de edição de projeto
- `hideEditProjectModal()` - Esconde o modal de edição de projeto
- `handleEditProject(projectData)` - Manipula a edição de um projeto
- `updateProjectModal(project)` - Atualiza o modal com dados do projeto
- `showNewFromTemplateModal(newProject, templateProject)` - Exibe modal para criar a partir de template
- `showProjectCreatedModal(projectName)` - Exibe modal de projeto criado
- `handleSaveAsTemplate(projectId)` - Manipula salvamento como template
- `showDeleteConfirmationModal(project)` - Exibe modal de confirmação de exclusão

### Métodos de Utilidade
- `getEmptyStateMessage(containerType)` - Obtém mensagem de estado vazio para um tipo de container
- `getProjectImage(containerType, projectName)` - Obtém imagem de projeto
- `getProjectIcon(containerType)` - Obtém ícone para um tipo de projeto
- `hexToBase64(hexString)` - Converte string hex para base64

---

## DashboardI18nManager

**Arquivo**: `js/i18n-dashboard.js`

### Construtor
- `constructor()` - Inicializa o gerenciador de internacionalização

### Métodos de Inicialização
- `init()` - Inicializa o sistema de idiomas
- `setupLanguageSelector()` - Configura o seletor de idiomas
- `setupStorageListener()` - Configura listener para mudanças no localStorage

### Métodos de Tradução
- `changeLanguage(locale)` - Muda o idioma da aplicação
- `updateUI()` - Atualiza a interface com o idioma atual
- `translate(key)` - Traduz uma chave para o idioma atual
- `setLanguage(locale)` - Define o idioma (alias para changeLanguage)
- `translateElement(element)` - Traduz um elemento específico

---

## SupabaseConfig

**Arquivo**: `js/utils/SupabaseClient.js`

### Métodos Estáticos
- `getClient()` - Obtém uma instância do cliente Supabase
- `isDevelopment()` - Verifica se está em ambiente de desenvolvimento
- `getCurrentSession()` - Obtém a sessão atual
- `getCurrentUser()` - Obtém o usuário atual
- `signOut()` - Desconecta o usuário
- `handleError(error)` - Manipula erros do Supabase
- `isValidUUID(uuid)` - Verifica se uma string é um UUID válido

---

## Utilitários

### ProjectCard (js/ui/ProjectCard.js)
- `static create(project, handlers)` - Cria um card de projeto

### commands.js (js/utils/commands.js)
- `commands.editProject(params)` - Comando para editar um projeto
- `executeCommand(commandName, params)` - Função principal para executar comandos

---

## Funções Duplicadas/Conflitantes

### Gerenciamento de Estado de Usuário
- **Duplicação entre SupabaseConfig e UserManager**: *****DUPLICADA OU EM CONFLITO NA ULTIMIZAÇÃO DE OPERAÇÕES SIMILARES******
  - `SupabaseConfig.getCurrentUser()` e `UserManager.getCurrentUser()` têm funcionalidades sobrepostas
  - `SupabaseConfig.signOut()` e `UserManager.signOut()` são duplicados

### Operações de Arquivamento
- **Funções de toggle redundantes**: *****DUPLICADA OU EM CONFLITO NA ULTIMIZAÇÃO DE OPERAÇÕES SIMILARES******
  - `toggleProjectArchiveState(projectId)` e `toggleArchiveProject(projectId)` são redundantes

### Carregamento e Atualização de UI
- **Operações de recarga duplicadas**: *****DUPLICADA OU EM CONFLITO NA ULTIMIZAÇÃO DE OPERAÇÕES SIMILARES******
  - Há vários métodos e eventos que forçam recarga de projetos:
    - `reloadProjects(params)`
    - Evento `reloadActiveProjects`
    - Evento `forceReloadAllProjects`
    - Evento `loadUserProjects`

### Event Listeners
- **Duplicação de listeners para eventos similares**: *****DUPLICADA OU EM CONFLITO NA ULTIMIZAÇÃO DE OPERAÇÕES SIMILARES******
  - `archiveProject` e `unarchiveProject` fazem chamadas para a mesma função

### Gerenciamento de Projetos
- **Métodos redundantes para carregar projetos**: *****DUPLICADA OU EM CONFLITO NA ULTIMIZAÇÃO DE OPERAÇÕES SIMILARES******
  - `loadUserProjects`, `loadArchivedProjects` e `loadTemplates` têm estrutura similar com pequenas variações

### Métodos de UI
- **Gerenciamento de estado de carregamento**: *****DUPLICADA OU EM CONFLITO NA ULTIMIZAÇÃO DE OPERAÇÕES SIMILARES******
  - `showLoading()` e `hideLoading()` são chamados em vários lugares, às vezes de forma aninhada

### Manipulação de Erros
- **Tratamento de erros inconsistente**: *****DUPLICADA OU EM CONFLITO NA ULTIMIZAÇÃO DE OPERAÇÕES SIMILARES******
  - Alguns métodos usam `SupabaseConfig.handleError()` enquanto outros implementam seu próprio tratamento

### Internacionalização
- **Duplicação com sistema global de i18n**: *****DUPLICADA OU EM CONFLITO NA ULTIMIZAÇÃO DE OPERAÇÕES SIMILARES******
  - O sistema i18n específico do dashboard duplica funcionalidade que pode existir no sistema global 

## Soluções Propostas

### 1. Gerenciamento de Estado de Usuário

**Problema**: Duplicação entre SupabaseConfig e UserManager.

**Solução**:
- Estabelecer uma clara separação de responsabilidades:
  - `SupabaseConfig`: Deve ser responsável apenas pela configuração e obtenção de cliente Supabase.
  - `UserManager`: Deve gerenciar toda a lógica relacionada ao usuário.
- Refatorar `SupabaseConfig.getCurrentUser()` para ser um método interno privado chamado `#getAuthUser()`.
- Atualizar `UserManager.getCurrentUser()` para chamar este método internamente e enriquecer os dados.
- Remover `SupabaseConfig.signOut()` e deixar essa responsabilidade exclusivamente com `UserManager`.

**Código Refatorado**:
```javascript
// Em SupabaseConfig.js
static async #getAuthUser() {
    try {
        const client = this.getClient();
        const { data: { user }, error } = await client.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('[SupabaseConfig] Error getting auth user:', error);
        return null;
    }
}
```

```javascript
// Em UserManager.js
async getCurrentUser() {
    try {
        const authUser = await SupabaseConfig.getAuthUser();
        if (!authUser) return null;
        
        // Código existente para enriquecer dados do usuário...
    } catch (error) {
        console.error('[UserManager] Error loading user data:', error);
        throw error;
    }
}
```

### 2. Operações de Arquivamento

**Problema**: Funções de toggle redundantes.

**Solução**:
- Remover a função `toggleProjectArchiveState(projectId)` completamente.
- Manter apenas `toggleArchiveProject(projectId)` com um nome mais claro.
- Atualizar todas as referências para usar a função mantida.

**Código Refatorado**:
```javascript
// Em ProjectManager.js
async toggleProjectArchive(projectId) {
    // Implementação existente de toggleArchiveProject
    // ...
}

// Remover toggleProjectArchiveState
```

### 3. Carregamento e Atualização de UI

**Problema**: Operações de recarga duplicadas.

**Solução**:
- Criar um sistema unificado de carregamento com um único método central.
- Implementar um gerenciador de cache que controle quando recarregar dados.
- Redefinir os eventos para terem escopos claros e não duplicados.

**Código Refatorado**:
```javascript
// Em DashboardModule.js
async loadProjects(options = {}) {
    const {
        type = 'active', // 'active', 'archived', 'templates'
        userId = this.currentUser?.id,
        forceReload = false,
        updateUI = true,
        showLoading = true
    } = options;
    
    if (!userId) return [];
    
    try {
        if (showLoading) this.uiManager.showLoading();
        
        let projects;
        switch (type) {
            case 'active':
                projects = await this.projectManager.loadUserProjects(userId, forceReload);
                break;
            case 'archived':
                projects = await this.projectManager.loadArchivedProjects(userId, forceReload);
                break;
            case 'templates':
                projects = await this.projectManager.loadTemplates(userId, forceReload);
                break;
            default:
                projects = [];
        }
        
        if (updateUI && this.currentTab === type) {
            this.uiManager.renderProjects(projects, type);
        }
        
        return projects;
    } catch (error) {
        console.error(`[DashboardModule] Error loading ${type} projects:`, error);
        this.uiManager.showError(`Erro ao carregar projetos. Por favor, tente novamente.`);
        return [];
    } finally {
        if (showLoading) this.uiManager.hideLoading();
    }
}
```

### 4. Event Listeners

**Problema**: Duplicação de listeners para eventos similares.

**Solução**:
- Consolidar eventos relacionados em um único evento com parâmetros de controle.
- Remover os event listeners duplicados.
- Atualizar o código que dispara eventos para usar o evento consolidado.

**Código Refatorado**:
```javascript
// Em ProjectManager.js
initEventListeners() {
    // Substituir eventos archiveProject e unarchiveProject por:
    document.addEventListener('toggleProjectArchive', async (event) => {
        console.log('Evento toggleProjectArchive recebido:', event.detail);
        const { projectId, isArchived } = event.detail;
        try {
            const updatedProject = await this.toggleProjectArchive(projectId);
            console.log('Estado de arquivo do projeto alterado:', updatedProject);
        } catch (error) {
            console.error('Erro ao alterar estado de arquivo do projeto:', error);
            this.uiManager?.showError('Erro ao alterar estado do projeto. Por favor, tente novamente.');
        }
    });
    
    // Código adicional para outros eventos...
}
```

### 5. Gerenciamento de Projetos

**Problema**: Métodos redundantes para carregar projetos.

**Solução**:
- Criar um único método base genérico para carregar projetos.
- Usar parâmetros para controlar o tipo de projetos a carregar.
- Manter métodos específicos como wrappers simples para compatibilidade.

**Código Refatorado**:
```javascript
// Em ProjectManager.js
async loadProjects(options = {}) {
    const {
        userId,
        archived = false,
        template = false,
        forceReload = false
    } = options;
    
    console.log(`[ProjectManager] Carregando projetos: archived=${archived}, template=${template}`);
    
    try {
        // Verificar cache se aplicável
        const cacheKey = `${archived}-${template}`;
        if (this.projectsCache[cacheKey]?.length > 0 && !forceReload) {
            console.log(`[ProjectManager] Retornando ${this.projectsCache[cacheKey].length} projetos do cache`);
            return this.projectsCache[cacheKey];
        }
        
        // Buscar projetos do servidor
        const { data: projects, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .eq('archived_proj', archived)
            .eq('template_proj', template)
            .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        // Atualizar cache
        this.projectsCache[cacheKey] = projects;
        console.log(`[ProjectManager] Retornando ${projects.length} projetos do servidor`);
        
        return projects;
    } catch (error) {
        console.error(`[ProjectManager] Erro ao carregar projetos:`, error);
        throw error;
    }
}

// Métodos wrapper para compatibilidade
async loadUserProjects(userId, forceReload = false) {
    return this.loadProjects({ userId, archived: false, template: false, forceReload });
}

async loadArchivedProjects(userId, forceReload = false) {
    return this.loadProjects({ userId, archived: true, template: false, forceReload });
}

async loadTemplates(userId, forceReload = false) {
    return this.loadProjects({ userId, archived: false, template: true, forceReload });
}
```

### 6. Métodos de UI

**Problema**: Gerenciamento de estado de carregamento inconsistente.

**Solução**:
- Implementar um sistema de contador para chamadas aninhadas.
- Centralizar o controle de loading em um único local.
- Adicionar timeouts para garantir que o loading nunca fique permanentemente visível.

**Código Refatorado**:
```javascript
// Em UIManager.js
constructor() {
    // Código existente...
    this.loadingCounter = 0;
    this.loadingTimeout = null;
}

showLoading() {
    this.loadingCounter++;
    if (this.loadingCounter === 1) {
        clearTimeout(this.loadingTimeout);
        this.elements.loadingOverlay.style.display = 'flex';
        console.log('[UIManager] Loading exibido');
        
        // Timeout de segurança para garantir que o loading nunca fique preso
        this.loadingTimeout = setTimeout(() => {
            console.warn('[UIManager] Loading timeout - forçando reset');
            this.resetLoading();
        }, 10000); // 10 segundos
    }
}

hideLoading() {
    this.loadingCounter = Math.max(0, this.loadingCounter - 1);
    if (this.loadingCounter === 0) {
        clearTimeout(this.loadingTimeout);
        this.elements.loadingOverlay.style.display = 'none';
        console.log('[UIManager] Loading escondido');
    }
}

resetLoading() {
    this.loadingCounter = 0;
    clearTimeout(this.loadingTimeout);
    this.elements.loadingOverlay.style.display = 'none';
    console.log('[UIManager] Loading forçado a resetar');
}
```

### 7. Manipulação de Erros

**Problema**: Tratamento de erros inconsistente.

**Solução**:
- Padronizar o tratamento de erros com uma classe ErrorHandler centralizada.
- Categorizar erros por tipo (rede, autenticação, dados, etc.).
- Implementar um sistema de relatório de erros para monitoramento.

**Código Refatorado**:
```javascript
// Novo arquivo: js/utils/ErrorHandler.js
class ErrorHandler {
    static handleError(error, context = '') {
        // Registrar erro
        console.error(`[${context}] Error:`, error);
        
        // Categorizar erro
        const errorType = this.categorizeError(error);
        
        // Obter mensagem amigável
        const userMessage = this.getUserFriendlyMessage(error, errorType);
        
        // Registrar para analytics (se aplicável)
        this.reportError(error, context, errorType);
        
        return {
            type: errorType,
            message: userMessage,
            originalError: error
        };
    }
    
    static categorizeError(error) {
        if (error.code?.startsWith('PGRST')) return 'database';
        if (error.code?.startsWith('auth/')) return 'authentication';
        if (error.message?.includes('network')) return 'network';
        return 'unknown';
    }
    
    static getUserFriendlyMessage(error, type) {
        // Utilizar lógica existente do SupabaseConfig.handleError
        if (error.code === 'PGRST301') return 'Sua sessão expirou. Por favor, faça login novamente.';
        if (error.code === 'PGRST204') return 'Recurso não encontrado.';
        if (error.code === 'PGRST403') return 'Você não tem permissão para acessar este recurso.';
        if (error.code === '23505') return 'Este registro já existe.';
        if (error.code === '23503') return 'Este registro não pode ser excluído pois está sendo usado em outro lugar.';
        
        // Mensagens por tipo
        switch (type) {
            case 'authentication':
                return 'Erro de autenticação. Por favor, faça login novamente.';
            case 'network':
                return 'Erro de conexão. Verifique sua internet e tente novamente.';
            case 'database':
                return 'Erro ao acessar dados. Por favor, tente novamente.';
            default:
                return error.message || 'Ocorreu um erro inesperado.';
        }
    }
    
    static reportError(error, context, type) {
        // Implementação futura para sistema de monitoramento
        // Ex: enviar para um serviço como Sentry
    }
}

export default ErrorHandler;
```

### 8. Internacionalização

**Problema**: Duplicação com sistema global de i18n.

**Solução**:
- Refatorar para usar um sistema de i18n compartilhado entre módulos.
- Separar as definições de idioma (chaves/valores) da lógica de internacionalização.
- Implementar um mecanismo de carregamento dinâmico de traduções.

**Código Refatorado**:
```javascript
// Novo arquivo: js/utils/SharedI18n.js
class SharedI18n {
    constructor(options = {}) {
        const { 
            moduleName = 'shared',
            defaultLocale = 'pt-PT'
        } = options;
        
        this.moduleName = moduleName;
        this.defaultLocale = defaultLocale;
        this.supportedLocales = ['pt-PT', 'en-US', 'fr-FR', 'es-ES', 'de-DE', 'zh-CN'];
        this.translations = {};
        this.currentLocale = localStorage.getItem('locale') || this.defaultLocale;
        
        // Inicializar
        this.init();
        
        console.log(`[${this.moduleName}I18n] Inicializado`);
    }
    
    init() {
        // Verificar se o idioma é suportado
        if (!this.supportedLocales.includes(this.currentLocale)) {
            console.warn(`[${this.moduleName}I18n] Idioma não suportado: ${this.currentLocale}, usando o padrão: ${this.defaultLocale}`);
            this.currentLocale = this.defaultLocale;
        }
        
        // Configurar listeners globais
        this.setupStorageListener();
        
        // Carregar traduções iniciais
        this.loadTranslations();
    }
    
    // Métodos restantes do sistema i18n...
}

export default SharedI18n;

// Em DashboardI18nManager.js - Refatorado para usar SharedI18n
import SharedI18n from '../utils/SharedI18n.js';

class DashboardI18nManager extends SharedI18n {
    constructor() {
        super({ moduleName: 'dashboard' });
        
        // Configurações específicas do dashboard
        this.setupLanguageSelector();
    }
    
    // Sobrescrever métodos específicos se necessário...
}

export default DashboardI18nManager; 