# Dashboard Module Development Guide

## Overview

The Dashboard module provides a centralized interface for users to manage their projects, templates, and view statistics. It is designed to be responsive, user-friendly, and provide quick access to essential functions.

## Dependencies

- Supabase Client (for authentication and database operations)
- Font Awesome (for icons)
- ModalManager (for handling modal dialogs)

## Main Files

- `index.html` - The main HTML structure
- `dashboard.css` - Styles for the dashboard
- `dashboard.js` - Core functionality
- `common.css` - Shared styles across components
- Images, including SVG assets (logo, default avatar, default project image)

## Internationalization (i18n) System

The Dashboard module implements a complete internationalization system that supports 6 languages, following the same pattern used in other modules:

### Structure

- **Core Files**:
  - `js/i18n-dashboard.js`: Main internationalization manager
  - `js/langs/*.js`: Language files for each supported language

- **Supported Languages**:
  - Portuguese (Portugal) - `pt-PT.js`
  - English (USA) - `en-US.js`
  - French (France) - `fr-FR.js`
  - Spanish (Spain) - `es-ES.js`
  - German (Germany) - `de-DE.js`
  - Chinese Simplified - `zh-CN.js`

### Implementation Details

- **Language Selection**: Uses the locale preference stored in `localStorage` under the key 'locale'
- **Dynamic Translation**: Elements are translated on-the-fly when language changes
- **Cross-Module Compatibility**: Syncs with language preferences set in other modules
- **Usage in HTML**: Elements use the `data-i18n` attribute for text translation
- **Attribute Translation**: Elements can use `data-i18n-attr` for attribute translation

### Translation of Dynamic Elements

The i18n system includes special handling for dynamically created elements:

1. **Project Cards**: When project cards are created, text elements are automatically translated
2. **Empty State Messages**: Messages for empty containers are translated
3. **Modal Dialogs**: Content in modal dialogs is translated when they are opened
4. **Success/Error Messages**: System messages are translated using translation keys

### Integration with UIManager

The UIManager has been enhanced with:

1. **Event Listeners**: Listens for `dashboard:translations:updated` events
2. **Translation Methods**: 
   - `updateDynamicTranslations()`: Updates all dynamic content
   - `translateProjectCards()`: Translates project cards in the current view
   - `translateOpenModals()`: Translates any open modal dialogs
   - `updateEmptyStateMessages()`: Updates empty state messages

### How to Add New Translatable Content

1. **Static Elements**:
   - Add `data-i18n="dashboard.section.key"` to the element
   - Add the corresponding key to all language files

2. **Dynamic Elements**:
   - For elements created in JavaScript, use the i18n manager:
   ```javascript
   element.textContent = window.dashboardI18n.translate('dashboard.section.key');
   ```

3. **Error/Success Messages**:
   - Use the extended showError/showSuccess methods with translation keys:
   ```javascript
   uiManager.showError("Default message", "dashboard.error.specific_error");
   ```

### Testing and Validation

The i18n system includes extensive logging to help with debugging:
- Status messages are logged to the console
- Translation failures are reported with warnings
- Event dispatches are logged

This system ensures a consistent user experience across different languages while maintaining the same interface structure and functionality.

## Security and Data Access

### Row Level Security Implementation

O Dashboard é integrado com as políticas de Row Level Security (RLS) do banco de dados para garantir que os usuários só possam acessar seus próprios dados. Todos os componentes que interagem com o banco de dados respeitam estas restrições.

### Manipulação de Esquemas de Banco de Dados Incompletos

O Dashboard está projetado para ser resiliente a esquemas de banco de dados incompletos ou em transição. Isso é especialmente importante durante migrações de banco de dados ou quando novas funcionalidades estão sendo implementadas gradualmente.

#### Detecção Dinâmica de Tabelas

O `UserManager` implementa um sistema de detecção dinâmica de tabelas que permite que o Dashboard continue funcionando mesmo quando certas tabelas não estão disponíveis:

```javascript
// Em UserManager.js
async checkProfilesTable() {
    try {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('count')
            .limit(1);
        
        if (!error) {
            this.profilesTableExists = true;
        } else {
            if (error.code === '42P01') { // "tabela não existe"
                this.profilesTableExists = false;
            } else {
                this.profilesTableExists = false;
            }
        }
    } catch (error) {
        this.profilesTableExists = false;
    }
}
```

#### Dados de Usuário e Campos Disponíveis

O `UserManager` gerencia todos os campos disponíveis na tabela `auth.users` do Supabase:

##### Campos Obrigatórios:
- `id`: Identificador único do usuário (uuid)
- `email`: Email do usuário (usado para login)
- `full_name`: Nome completo do usuário
- `subscription_start_date`: Data de início da assinatura
- `subscription_validity`: Duração da assinatura
- `subscription_plan`: Plano de assinatura
- `terms_accepted`: Aceitação dos termos de uso

##### Campos Opcionais:
- `organization_name`: Nome da organização
- `phone_number`: Número de telefone
- `country`: País
- `user_type`: Tipo de usuário
- `newsletter_subscribed`: Preferência para receber newsletter
- `role`: Função do usuário no sistema
- `created_at`: Data de criação da conta
- `last_sign_in_at`: Data do último login

#### Gerenciamento de Perfil de Usuário

O sistema de perfil do usuário é acessível através de um ícone de engrenagem (⚙️) no Ribbon. O perfil é carregado em um iframe e se comunica com o Dashboard e o Ribbon através de mensagens postMessage. O perfil apresenta quatro seções principais:

1. **Informações Pessoais**:
   - Nome completo, organização, telefone e país
   - Preferência de newsletter

2. **Configurações da Conta**:
   - Email, função, datas de criação e último acesso
   - Status de aceitação dos termos

3. **Atividade**:
   - Estatísticas de uso

4. **Assinatura**:
   - Informações sobre plano, data de início e validade

#### Estratégia de Fallback para Dados de Usuário

Quando a tabela `profiles` não está disponível, o Dashboard:

1. Continua operando com informações básicas do usuário obtidas da autenticação:
   - ID do usuário
   - Email 
   - Nome de usuário derivado do email
   - Data de criação e último login

2. Adapta a interface do usuário para não depender de dados estendidos do perfil:
   - Usa avatar padrão
   - Omite informações que seriam obtidas apenas da tabela de perfis

3. Registra no console informações de debug para facilitar a solução de problemas

#### Persistência Local de Dados do Perfil

Para garantir disponibilidade dos dados mesmo com problemas de conectividade, o sistema implementa um mecanismo de fallback usando `localStorage`:

1. Os dados do perfil são armazenados no `localStorage` com uma chave baseada no ID do usuário
2. Ao carregar o perfil, os dados são recuperados de três fontes, na seguinte ordem de prioridade:
   - `localStorage` (mais recente)
   - `user_metadata` do objeto de usuário do Supabase
   - Campos principais do objeto de usuário

3. Esta abordagem garante que o perfil do usuário permaneça consistente mesmo quando:
   - A tabela `profiles` não está disponível
   - A atualização dos metadados do usuário falha
   - Há problemas na sincronização de dados com o Supabase

#### Implementando Novos Componentes

Ao implementar novos componentes que dependem de tabelas específicas:

1. **Verificação de Pré-requisitos**: Implemente verificações de existência das tabelas necessárias
2. **Modos Alternativos**: Forneça versões simplificadas de funcionalidades quando as tabelas estiverem ausentes
3. **Feedback ao Usuário**: Informe o usuário quando determinadas funcionalidades não estiverem disponíveis
4. **Logging Detalhado**: Registre informações detalhadas para ajudar na depuração

#### Gerenciamento de Dependências

Os componentes do Dashboard devem declarar claramente suas dependências de banco de dados:

| Componente | Dependências | Comportamento se Ausente |
|------------|--------------|--------------------------|
| UserManager | auth.users (obrigatório), public.profiles (opcional) | Usa dados básicos do usuário |
| ProjectManager | public.projects (obrigatório) | Falha - funcionalidade indisponível |
| UIManager | Nenhuma dependência direta | Funciona normalmente |

#### ProjectManager e RLS

O `ProjectManager` (em `js/managers/ProjectManager.js`) interage com a tabela `projects` que utiliza RLS para filtrar dados por usuário:

```javascript
// As consultas já estão naturalmente restritas pelo RLS
// O usuário só verá seus próprios projetos
async loadUserProjects(userId, forceReload = false) {
    // ...
    const { data: projects, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)  // Esta condição coincide com a política RLS
        .eq('archived_proj', false)
        .eq('template_proj', false)
        .order('updated_at', { ascending: false });
    // ...
}
```

#### Segurança nas Operações de Gerenciamento de Projetos

Todas as operações de criação, edição e exclusão de projetos são automaticamente protegidas pelas políticas RLS:

- **Criação de Projetos**: A política `WITH CHECK (auth.uid() = user_id)` garante que o usuário só pode criar projetos associados à sua própria conta.
- **Edição de Projetos**: A política `USING (auth.uid() = user_id)` garante que o usuário só pode modificar seus próprios projetos.
- **Exclusão de Projetos**: A política `USING (auth.uid() = user_id)` garante que o usuário só pode excluir seus próprios projetos.

#### Manutenção do Token de Autenticação

O token JWT deve ser mantido e gerenciado corretamente para que as políticas RLS funcionem:

1. O dashboard herda o token de autenticação da sessão iniciada no sistema de login
2. O token é usado automaticamente pelo cliente Supabase em todas as requisições
3. Se o token expirar, o usuário deve ser redirecionado para a página de login

### Práticas Recomendadas de Segurança no Dashboard

1. **Nunca modificar o user_id**: O campo `user_id` nunca deve ser modificado nas operações de edição
2. **Validar entrada de dados**: Todas as entradas do usuário devem ser validadas antes de serem enviadas ao banco
3. **Separar interfaces**: Manter interfaces separadas para projetos, templates e arquivos para evitar confusão

## Main Files

- `index.html` - The main HTML structure
- `dashboard.css` - Styles for the dashboard
- `dashboard.js` - Core functionality
- `common.css` - Shared styles across components
- Images, including SVG assets (logo, default avatar, default project image)

## Required Assets

The dashboard requires the following assets to function properly:

- `public/components/shared/css/common.css` - Common styles
- `public/components/shared/images/logo.svg` - Application logo
- `public/components/shared/images/default-avatar.svg` - Default user avatar
- `public/components/modules/dashboard/images/default_project_image.svg` - Default project image

## Layout Structure

The dashboard uses a full-width layout with two main sections:

1. **Left Column**: Contains statistics panels displayed vertically (fixed width of 280px)
2. **Right Column**: Contains a tabbed interface with the following tabs (flexible width, fills available space):
   - **Meus Projetos**: Displays the user's active projects
   - **Arquivados**: Shows archived projects
   - **Templates**: Shows available templates for new projects

### Layout Implementation

```html
<div class="dashboard-layout">
    <!-- Left column for statistics -->
    <div class="dashboard-stats-column">
        <!-- Statistics cards are displayed here -->
    </div>
    
    <!-- Right column with tabs -->
    <div class="dashboard-tabs-container">
        <!-- Tab navigation -->
        <div class="tabs-navigation">
            <button class="tab-button active" data-tab="projects">Meus Projetos</button>
            <button class="tab-button" data-tab="archived">Arquivados</button>
            <button class="tab-button" data-tab="templates">Templates</button>
        </div>
        
        <!-- Tab content areas -->
        <div id="tab-projects" class="tab-content active">
            <!-- Projects content -->
        </div>
        <div id="tab-archived" class="tab-content">
            <!-- Archived projects content -->
        </div>
        <div id="tab-templates" class="tab-content">
            <!-- Templates content -->
        </div>
    </div>
</div>
```

## Search and Filter Functionality

The dashboard includes search and filter capabilities to help users find their projects more easily:

### Search Implementation

Search functionality is implemented dynamically through JavaScript:

```javascript
setupSearchFunctionality() {
    // Creates a search input if it doesn't exist
    // Sets up event listeners for filtering projects based on input
}

filterProjects(searchTerm) {
    // Filters the project cards based on the search term
    // Provides visual feedback when no results are found
}
```

### Project Type Filter

Filtering by project type is implemented with these methods:

```javascript
setupProjectTypeFilter() {
    // Creates filter buttons for different project types
    // Sets up event listeners for filtering
}

filterProjectsByType(type) {
    // Shows/hides project cards based on their type
    // Provides visual feedback when no results are found
}
```

## Project Card Layout and Inline Editing

Project cards are displayed in a responsive grid that adjusts based on available space:

```css
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-gap: 20px;
}
```

Individual cards have this structure:

```html
<div class="project-card">
    <div class="project-image">
        <img src="path/to/image.svg" alt="Project Name">
    </div>
    <div class="project-info">
        <h3 class="project-name" data-project-id="123">Project Name</h3>
        <p class="project-description" data-project-id="123">Project description text</p>
        <div class="project-dates">
            <span class="project-date"><i class="fas fa-calendar-plus"></i> Created: Date</span>
            <span class="project-date"><i class="fas fa-calendar-alt"></i> Updated: Date</span>
        </div>
        <div class="project-type-badge">Type</div>
        <div class="project-actions">
            <button class="project-action edit-name-action"><i class="fas fa-pen"></i></button>
            <button class="project-action edit-action"><i class="fas fa-edit"></i></button>
            <button class="project-action archive-action"><i class="fas fa-archive"></i></button>
            <button class="project-action delete-action"><i class="fas fa-trash-alt"></i></button>
        </div>
    </div>
</div>
```

### Inline Project Editing

The dashboard supports inline editing of project names and descriptions directly from the list:

#### Edit Mode UI

When a user clicks the edit name button, the project card enters edit mode with:
- Input field for the project name
- Textarea for the project description
- Save and Cancel buttons
- Visual styling to indicate edit mode

#### Edit Implementation

```javascript
enableProjectEditing(card, project) {
    // Replaces static text with editable inputs
    // Adds save and cancel buttons
    // Sets up event listeners for saving or canceling edits
}

saveProjectEdits(card, project, newName, newDescription) {
    // Validates inputs
    // Updates data in Supabase or localStorage
    // Updates UI with new values
    // Shows success/error feedback
}

cancelProjectEdits(card, originalName, originalDesc) {
    // Restores original values when user cancels
}
```

#### Keyboard Navigation

The editor supports keyboard navigation:
- Enter key to save changes
- Escape key to cancel

#### Visual Feedback

The editor provides visual feedback during editing:
- Loading state during save operation
- Success or error notifications after save attempt
- Highlighted editing area

## CSS Architecture

The dashboard uses a responsive layout with these key CSS components:

```css
.dashboard-container {
    width: 100%;
    margin: 0;
    padding: 0 20px;
}

.dashboard-layout {
    display: flex;
    gap: 30px;
    width: 100%;
    margin: 0;
    padding: 0 20px;
}

.dashboard-stats-column {
    width: 280px;
    flex-shrink: 0;
    /* Other styling properties */
}

.dashboard-tabs-container {
    flex: 1;
    /* Other styling properties */
}
```

This structure ensures:
- The dashboard takes up the full width of the viewport
- Left column has a fixed width for statistics
- Right column flexibly expands to fill the remaining space
- Content properly adapts to different screen sizes

## Integração com o Ribbon

O módulo Dashboard implementa um sistema de comunicação com o Ribbon (barra de ferramentas principal) que permite executar ações do Dashboard diretamente a partir dos botões do Ribbon.

### Recebimento de Comandos

O Dashboard pode receber comandos do Ribbon através do mecanismo de mensagem `postMessage`. Os comandos são processados na classe `DashboardModule`:

```javascript
// Configuração dos comandos disponíveis no Dashboard
this.ribbonCommands = {
    'showNewProjectModal': this.showNewProjectModal.bind(this),
    'switchTab': this.handleTabChangeCommand.bind(this),
    'reloadProjects': this.reloadProjects.bind(this)
};

// Processamento das mensagens recebidas
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'RIBBON_COMMAND') {
        const { command, params } = event.data;
        this.handleRibbonCommand(command, params);
    }
});
```

### Comandos Suportados

O módulo Dashboard suporta os seguintes comandos que podem ser enviados pelo Ribbon:

| Comando | Descrição | Parâmetros |
|---------|-----------|------------|
| `showNewProjectModal` | Abre o modal para criação de novo projeto | Nenhum |
| `switchTab` | Muda para uma aba específica do Dashboard | `{ tab: 'projects' \| 'archived' \| 'templates' }` |
| `reloadProjects` | Recarrega a lista de projetos | `{ forceReload: boolean }` (opcional) |

### Configuração no Ribbon

Para que um botão do Ribbon envie um comando para o Dashboard, ele deve ser configurado em `ribbon-config.js` com as propriedades `moduleCommand` e `moduleParams`:

```javascript
{
    id: 'add-project-btn',
    icon: 'icon-add-project',
    label: 'Novo',
    action: 'createNewProject',
    moduleCommand: 'showNewProjectModal',
    moduleParams: {}
}
```

### Adicionando Novos Comandos

Para adicionar novos comandos ao Dashboard:

1. Adicione um novo método em `DashboardModule` que implementa a funcionalidade desejada
2. Registre o método no objeto `ribbonCommands` no construtor da classe
3. Configure o botão correspondente no arquivo `ribbon-config.js`

## Default Images and Assets

The dashboard uses SVG images for better scaling and performance:

### Default Project Image

- Located at `images/default_project_image.svg`
- Reflects themes from ZW3D
- Includes the existing logo styling
- Used consistently across projects and templates

### Logo and Avatar

- Logo: Located at `../../shared/images/logo.svg`
- Default Avatar: Located at `../../shared/images/default-avatar.svg`

## Tab Functionality

The dashboard implements a tabbed interface to organize different types of content:

### Tab Switching

Tab switching is handled by the `initTabSwitching` and `switchTab` methods in `dashboard.js`:

```javascript
initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            this.switchTab(tabName);
        });
    });
    
    // Set the first tab as active by default
    this.switchTab('projects');
}

switchTab(tabName) {
    // Update active tab button
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update active tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.id === `tab-${tabName}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Load content for the selected tab if needed
    switch (tabName) {
        case 'projects':
            // Projects are already loaded in init
            break;
        case 'archived':
            this.loadArchivedProjects();
            break;
        case 'templates':
            this.loadTemplates();
            break;
    }
}
```

### Tab Content

Each tab has its own data loading and rendering methods:

1. **Meus Projetos**: Uses `loadProjects()` and `renderProjects()`
2. **Arquivados**: Uses `loadArchivedProjects()` and `renderArchivedProjects()`
3. **Templates**: Uses `loadTemplates()` and `renderTemplates()`

## Statistics Display

Statistics are displayed in a vertical column on the left side of the dashboard:

```html
<div class="stat-card">
    <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
    <div class="stat-content">
        <h3 class="stat-title">Total Projects</h3>
        <p class="stat-value">15</p>
    </div>
</div>
```

The statistics display shows:
- Total projects count
- Active projects count
- Archived projects count
- Templates count

Each statistic is color-coded using a left border to visually differentiate categories.

## Responsive Design

The dashboard is fully responsive and adapts to different screen sizes:

- **Desktop**: Two-column layout with statistics on the left and tabbed content on the right
- **Tablet**: Switches to a single-column layout with statistics at the top at 1024px width
- **Mobile**: Further adjustments for smaller screens, with simplified grids and layouts

Key breakpoints:
- 1024px: Switch to vertical layout
- 768px: Reduced spacing and padding
- 480px: Single-column grids, simplified navigation

```css
/* Key responsive breakpoints */
@media (max-width: 1024px) {
    .dashboard-layout {
        flex-direction: column;
    }
    
    .dashboard-stats-column {
        width: 100%;
    }
    
    .stats-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    /* Further adjustments */
}

@media (max-width: 480px) {
    /* Mobile optimizations */
}
```

## Development Workflow

1. **User Identification**: Identify the current user through Supabase auth
2. **Data Loading**: Load user-specific data for projects, archived projects, and templates
3. **Tab Handling**: Set up tab switching functionality
4. **Search & Filtering**: Set up search and project type filters
5. **Event Listeners**: Set up event listeners for user interactions
6. **Inline Editing**: Enable inline editing of project names and descriptions

## Troubleshooting Common Issues

### Missing Assets

If you encounter 404 errors for assets, ensure the following directories and files exist:
- `public/components/shared/css/common.css`
- `public/components/shared/images/logo.svg`
- `public/components/shared/images/default-avatar.svg`
- `public/components/modules/dashboard/images/default_project_image.svg`

### JavaScript Errors

- **"is not a function" errors**: Check that all required utility methods are defined in the `DashboardModule` class, particularly `setupSearchFunctionality` and `setupProjectTypeFilter`.
- **Supabase authentication errors**: Verify the Supabase client is properly initialized and user authentication is properly handled.

## Empty States and Error Handling

Each tab includes empty state displays when no data is available:

```javascript
showEmptyTemplatesState() {
    const templatesContainer = document.getElementById('templates-container');
    if (!templatesContainer) return;
    
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <i class="fas fa-copy"></i>
        <p>Você ainda não tem templates.</p>
        <button class="btn-primary" id="empty-state-new-template">
            <i class="fas fa-plus"></i> Criar Novo Template
        </button>
    `;
    
    templatesContainer.appendChild(emptyState);
}
```

Error states provide feedback and retry options when data loading fails.

## Future Enhancements

- Advanced project filtering and sorting options
- Batch operations for projects and templates
- Integration with cloud storage for project backups
- Performance optimizations for large numbers of projects
- Enhanced analytics and statistics displays

### Nova Estrutura de Arquivos

O módulo dashboard foi reorganizado em uma estrutura modular para melhor manutenção:

```
public/components/modules/dashboard/
├── js/
│   ├── core/
│   │   └── DashboardModule.js     # Coordenação geral do módulo
│   ├── managers/
│   │   ├── UserManager.js         # Gestão de usuários e autenticação
│   │   └── ProjectManager.js      # Gestão de projetos
│   ├── ui/
│   │   └── UIManager.js          # Gerenciamento da interface
│   └── utils/
│       └── SupabaseClient.js     # Configuração do Supabase
├── css/
│   └── dashboard.css             # Estilos específicos do dashboard
└── index.html                    # Página principal do dashboard

```

#### Responsabilidades dos Módulos

| Arquivo               | Responsabilidade                                    |
|----------------------|---------------------------------------------------|
| `DashboardModule.js` | Inicialização e coordenação geral                  |
| `UserManager.js`     | Autenticação e dados do usuário                    |
| `ProjectManager.js`  | Operações CRUD de projetos                         |
| `UIManager.js`       | Renderização e gestão da interface                 |
| `SupabaseClient.js`  | Configuração e conexão com o Supabase             |

#### Fluxo de Dados

1. O `DashboardModule` inicializa os outros módulos
2. `UserManager` verifica autenticação e carrega dados do usuário
3. `ProjectManager` carrega e gerencia os projetos
4. `UIManager` renderiza a interface com os dados

## Fluxo de Dados do Usuário

O fluxo de dados do usuário segue esta ordem:

1. `DashboardModule` inicializa os gerenciadores (UserManager, ProjectManager, UIManager)
2. Durante `init()`, o `UserManager` carrega os dados do usuário atual
3. Se autenticado, o `DashboardModule` passa os dados do usuário para:
   - `UIManager` para atualizar a interface
   - `ProjectManager` para operações que requerem o ID do usuário

### Dependências de Dados

- `ProjectManager` requer `userData` para:
  - Carregar projetos do usuário
  - Criar novos projetos
  - Gerenciar projetos existentes

## Renderização em Múltiplos Containers

O sistema de tabs utiliza três containers diferentes:

1. `projects-container` - Para projetos ativos
2. `archived-container` - Para projetos arquivados
3. `templates-container` - Para templates

O `UIManager` renderiza os projetos no container apropriado baseado na tab atual:

```javascript
renderProjects(projects, tabName = null) {
    const containerType = tabName || this.currentTab;
    let container = this.getContainerForType(containerType);
    
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
```

### Fluxo de Mudança de Tab

1. Usuário clica em uma tab
2. `DashboardModule.handleTabChange()` é chamado
3. Atualiza o estado visual da tab através de `UIManager.updateActiveTab()`
4. Carrega os dados específicos daquela tab (`loadUserProjects`, `loadArchivedProjects` ou `loadTemplates`)
5. Renderiza os projetos no container apropriado com `UIManager.renderProjects(data, tabName)`

## Sistema de Eventos

O dashboard usa um sistema de eventos customizados para comunicação entre componentes:

### Eventos Disparados pelo UIManager:

- `newProject` - Quando o usuário cria um novo projeto
- `editProject` - Quando o usuário edita um projeto
- `deleteProject` - Quando o usuário exclui um projeto
- `archiveProject` - Quando o usuário arquiva um projeto
- `unarchiveProject` - Quando o usuário desarquiva um projeto
- `useTemplate` - Quando o usuário usa um template

### Eventos Disparados pelo ProjectManager:

- `projectCreated` - Quando um projeto é criado
- `projectDeleted` - Quando um projeto é excluído
- `projectArchiveToggled` - Quando o status de arquivo muda
- `projectTemplateToggled` - Quando o status de template muda

### Tratamento de Eventos:

```javascript
// No ProjectManager
document.addEventListener('newProject', async (event) => {
    const projectData = event.detail;
    await this.createProject(projectData);
});

// No UIManager
document.addEventListener('projectDeleted', (event) => {
    const { id } = event.detail;
    this.removeProjectFromUI(id);
});
```

## Gerenciamento de Estado e Tratamento de Erros

### Fluxo de Arquivamento/Desarquivamento

O sistema implementa um fluxo robusto para alternar o estado de arquivamento dos projetos:

1. **Busca de Dados Atuais**:
   ```javascript
   const { data: currentData, error: fetchError } = await this.supabase
       .from('projects')
       .select('*')
       .eq('id', projectId)
       .single();
   ```
   - Guarda os dados originais para fallback
   - Verifica se o projeto existe

2. **Atualização do Estado**:
   ```javascript
   const { data: updatedData, error: updateError } = await this.supabase
       .from('projects')
       .update({
           archived_proj: !projectData.archived_proj,
           updated_at: new Date().toISOString()
       })
       .eq('id', projectId)
       .select()
       .single();
   ```
   - Atualiza o estado no banco de dados
   - Retorna os dados atualizados

3. **Atualização Local**:
   ```javascript
   const index = this.projects.findIndex(p => p.id === projectId);
   if (index !== -1) {
       this.projects[index] = updatedData;
   }
   ```
   - Mantém a lista local sincronizada
   - Evita recargas desnecessárias

4. **Notificação de Mudanças**:
   ```javascript
   const event = new CustomEvent('projectArchiveToggled', { 
       detail: updatedData 
   });
   document.dispatchEvent(event);
   ```
   - Notifica outros componentes da mudança
   - Usa dados atualizados do servidor

5. **Tratamento de Erros**:
   ```javascript
   catch (error) {
       if (projectData) {
           // Usar dados originais como fallback
           const event = new CustomEvent('projectArchiveToggled', { 
               detail: {
                   ...projectData,
                   archived_proj: !projectData.archived_proj
               }
           });
           document.dispatchEvent(event);
       }
       throw error;
   }
   ```
   - Mantém UI consistente mesmo com erros
   - Usa dados originais como fallback

### Pontos de Verificação

Para garantir operações seguras, o sistema verifica:

1. **Dados Iniciais**:
   - Projeto existe no banco de dados
   - ID do projeto é válido
   - Usuário tem permissão

2. **Atualização**:
   - Dados foram atualizados com sucesso
   - Retorno contém dados válidos
   - Estado foi alterado corretamente

3. **Consistência**:
   - Lista local está sincronizada
   - UI reflete o estado atual
   - Feedback visual apropriado

### Tratamento de Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| Projeto não encontrado | ID inválido ou projeto excluído | Usar dados em cache e atualizar lista |
| Falha na atualização | Erro de rede ou permissão | Manter estado local e tentar novamente |
| Dados inválidos | Resposta incompleta do servidor | Usar dados originais como fallback |

### Boas Práticas

1. **Variáveis Descritivas**:
   - Use nomes que indicam o estado dos dados (`currentData`, `updatedData`)
   - Diferencie erros por contexto (`fetchError`, `updateError`)

2. **Validação em Camadas**:
   - Verifique dados antes da operação
   - Valide resposta do servidor
   - Confirme estado final

3. **Estado Local**:
   - Mantenha cópia dos dados originais
   - Atualize lista local após sucesso
   - Use fallback em caso de erro

4. **Feedback ao Usuário**:
   - Mostre estado da operação
   - Indique sucesso ou falha
   - Permita nova tentativa em caso de erro

## Debugging e Tratamento de Erros

### Operações no Supabase

Ao trabalhar com operações de atualização no Supabase, siga estas diretrizes:

1. **Atualização em Duas Etapas**:
   ```javascript
   // 1. Primeiro, fazer o update
   const { error: updateError } = await this.supabase
       .from('projects')
       .update({
           field: newValue,
           updated_at: new Date().toISOString()
       })
       .eq('id', projectId);

   if (updateError) throw updateError;

   // 2. Depois, buscar os dados atualizados
   const { data: updatedData, error: fetchError } = await this.supabase
       .from('projects')
       .select('*')
       .eq('id', projectId)
       .single();
   ```
   - Separe a operação de update da busca dos dados
   - Garanta que os dados retornados estão atualizados
   - Evite problemas de cache ou dados inconsistentes

2. **Validação em Cada Etapa**:
   ```javascript
   // Validar erro de update
   if (updateError) {
       console.error('Erro ao atualizar:', updateError);
       throw updateError;
   }

   // Validar erro de busca
   if (fetchError) {
       console.error('Erro ao buscar dados atualizados:', fetchError);
       throw fetchError;
   }

   // Validar dados retornados
   if (!updatedData) {
       throw new Error('Dados não encontrados após atualização');
   }
   ```
   - Verifique erros em cada operação
   - Mantenha logs detalhados
   - Use mensagens de erro específicas

3. **Backup e Recuperação**:
   ```javascript
   let originalData = null;
   try {
       // Guardar dados originais
       originalData = await getCurrentData();
       
       // Fazer update
       await performUpdate();
       
       // Buscar dados atualizados
       const updatedData = await fetchUpdatedData();
       
       return updatedData;
   } catch (error) {
       // Usar dados originais como fallback
       if (originalData) {
           handleFallback(originalData);
       }
       throw error;
   }
   ```
   - Mantenha cópia dos dados originais
   - Implemente mecanismo de fallback
   - Garanta consistência da UI

### Exemplo Completo de Atualização

```javascript
async toggleArchiveProject(projectId) {
    let projectData = null;
    try {
        // 1. Buscar dados atuais
        const { data: currentData, error: fetchError } = await this.supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (fetchError) throw fetchError;
        if (!currentData) throw new Error('Projeto não encontrado');
        
        projectData = currentData;
        const newStatus = !projectData.archived_proj;

        // 2. Fazer update
        const { error: updateError } = await this.supabase
            .from('projects')
            .update({
                archived_proj: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', projectId);

        if (updateError) throw updateError;

        // 3. Buscar dados atualizados
        const { data: updatedData, error: fetchUpdatedError } = await this.supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (fetchUpdatedError) throw fetchUpdatedError;
        if (!updatedData) throw new Error('Dados não encontrados após atualização');

        return updatedData;
    } catch (error) {
        // 4. Em caso de erro, usar dados originais
        if (projectData) {
            return {
                ...projectData,
                archived_proj: !projectData.archived_proj
            };
        }
        throw error;
    }
}
```

### Pontos Importantes

1. **Separação de Operações**:
   - Update e select são operações distintas
   - Cada operação tem sua própria validação
   - Logs específicos para cada etapa

2. **Tratamento de Erros**:
   - Erros específicos para cada operação
   - Fallback com dados originais
   - Logs detalhados para debugging

3. **Consistência de Dados**:
   - Sempre busque dados atualizados após update
   - Valide dados antes de usar
   - Mantenha backup dos dados originais

4. **Performance**:
   - Duas chamadas ao banco são melhores que uma inconsistente
   - Cache é atualizado corretamente
   - Dados sempre consistentes

## Edição de Projetos

A edição de projetos agora utiliza um modal dedicado, seguindo o mesmo padrão do modal de criação:

### Modal de Edição

```javascript
showEditProjectModal(project) {
    // Criar modal se não existir
    if (!this.elements.editProjectModal) {
        const modal = document.createElement('div');
        modal.id = 'edit-project-modal';
        modal.className = 'modal';
        // ... configuração do modal ...
    }

    // Preencher formulário com dados do projeto
    const form = this.elements.editProjectModal.querySelector('#edit-project-form');
    form.dataset.projectId = project.id;
    form.querySelector('#edit-project-name').value = project.internal_name;
    form.querySelector('#edit-project-description').value = project.internal_description;
}
```

### Validação e Sincronização de Dados

O sistema agora implementa uma validação e sincronização robusta dos dados do projeto:

1. **Validação de Dados**:
   ```javascript
   validateProjectData(data) {
       return data && 
              data.id && 
              data.internal_name && 
              typeof data.archived_proj === 'boolean' &&
              typeof data.template_proj === 'boolean' &&
              data.updated_at;
   }
   ```
   - Verifica campos obrigatórios
   - Valida tipos de dados
   - Garante consistência

2. **Processo de Atualização**:
   ```javascript
   async handleProjectEdit(projectData) {
       // 1. Validar entrada
       if (!projectData || !projectData.id) throw new Error('Dados inválidos');
       
       // 2. Backup dos dados atuais
       const currentData = await this.fetchCurrentData(projectData.id);
       
       // 3. Atualizar no banco
       await this.updateInDatabase(projectData);
       
       // 4. Buscar dados atualizados
       const updatedData = await this.fetchUpdatedData(projectData.id);
       
       // 5. Validar dados atualizados
       if (!this.validateProjectData(updatedData)) throw new Error('Dados inválidos');
       
       // 6. Atualizar localmente
       this.updateLocalProjectData(updatedData);
       
       // 7. Notificar UI
       this.notifyUpdate(updatedData);
   }
   ```

3. **Sincronização Local**:
   ```javascript
   updateLocalProjectData(updatedData) {
       // Atualizar lista principal
       const index = this.projects.findIndex(p => p.id === updatedData.id);
       if (index !== -1) {
           this.projects[index] = updatedData;
       }
       
       // Atualizar listas específicas
       this.updateArchivedList(updatedData);
       this.updateTemplateList(updatedData);
   }
   ```

### Pontos de Verificação

1. **Entrada de Dados**:
   - ✓ Dados do projeto válidos
   - ✓ ID do projeto presente
   - ✓ Campos obrigatórios preenchidos

2. **Processo de Update**:
   - ✓ Backup dos dados originais
   - ✓ Update no banco bem-sucedido
   - ✓ Dados atualizados recuperados
   - ✓ Validação dos novos dados

3. **Sincronização**:
   - ✓ Lista principal atualizada
   - ✓ Lista de arquivados sincronizada
   - ✓ Lista de templates sincronizada
   - ✓ UI notificada das mudanças

### Logs e Debugging

```javascript
// Logs detalhados em cada etapa
console.log('Iniciando edição do projeto:', projectData);
console.log('Dados atuais:', currentData);
console.log('Atualizando no banco...');
console.log('Dados atualizados:', updatedData);
console.log('Atualizando listas locais...');
console.log('Notificando UI...');
```

### Tratamento de Erros

1. **Validação Inicial**:
   ```javascript
   if (!projectData || !projectData.id) {
       throw new Error('Dados do projeto inválidos');
   }
   ```

2. **Backup e Recuperação**:
   ```javascript
   if (!currentData) {
       throw new Error('Projeto não encontrado');
   }
   ```

3. **Validação Final**:
   ```javascript
   if (!this.validateProjectData(updatedData)) {
       throw new Error('Dados atualizados inválidos');
   }
   ```

### Testes Recomendados

1. **Validação de Dados**:
   - Testar campos obrigatórios
   - Testar tipos de dados
   - Testar valores limites

2. **Processo de Update**:
   - Testar fluxo completo
   - Testar recuperação de erros
   - Testar consistência de dados

3. **Sincronização**:
   - Testar atualização em todas as listas
   - Testar UI em diferentes estados
   - Testar concorrência de updates

### Boas Práticas

1. **Validação em Camadas**:
   - Validar antes do update
   - Validar após o update
   - Validar antes da UI

2. **Backup e Recuperação**:
   - Manter dados originais
   - Implementar rollback
   - Notificar falhas

3. **Logs e Monitoramento**:
   - Registrar cada etapa
   - Detalhar erros
   - Facilitar debugging

## Duplicação de Projetos a partir de Templates

### Fluxo de Execução Atualizado

1. **Início da Duplicação**
   - Usuário clica no botão "Usar Template" em um projeto template
   - O evento `useTemplate` é disparado com o ID do template

2. **Processo de Duplicação (`ProjectManager.duplicateProject`)**
   - Busca dados completos do template no Supabase
   - Verifica autenticação do usuário
   - Remove campos que não devem ser copiados (id, created_at, updated_at)
   - Cria novo projeto no Supabase com `template_proj: false`
   - Atualiza a lista local de projetos
   - Muda para a tab "Meus Projetos"
   - Dispara evento `showNewFromTemplate` para exibir modal de edição

3. **Exibição do Modal (`UIManager.showNewFromTemplateModal`)**
   - Cria um novo modal para cada uso (evita conflitos)
   - Preenche formulário com dados do novo projeto
   - Permite editar nome e descrição
   - Ao salvar, atualiza o projeto no banco de dados
   - Ao cancelar, exclui o projeto

### Logs e Validações

- **Logs Detalhados**
   ```javascript
   console.log('[DUPLICATE] Iniciando processo de duplicação para template:', projectId);
   console.log('[DUPLICATE] Dados preparados:', newProjectData);
   console.log('[DUPLICATE] Novo projeto criado com sucesso:', newProject);
   console.log('[DUPLICATE] Mudando para tab de projetos ativos...');
   console.log('[TEMPLATE_MODAL] Abrindo modal para novo projeto:', newProject?.id);
   ```

- **Validações**
   ```javascript
   // Verificar se o usuário está autenticado
   if (!this.userData?.id) {
       console.error('[DUPLICATE ERRO] ID do usuário não encontrado');
       throw new Error('Usuário não autenticado');
   }

   // Validação do novo projeto
   if (!newProject) {
       console.error('[DUPLICATE ERRO] Projeto criado é null');
       throw new Error('Falha ao criar projeto: resposta vazia do servidor');
   }
   ```

### Sequência de Eventos

1. `useTemplate` → Inicia duplicação
2. `switchTab` → Muda para "Meus Projetos" 
3. `showNewFromTemplate` → Exibe modal de edição
4. `editProject` → Salva alterações (se confirmado)
5. `deleteProject` → Exclui projeto (se cancelado)

## Copiar Projeto Ativo para Templates

### Fluxo de Conversão para Template

1. **Início da Conversão**
   - Usuário clica no botão "Copiar para Templates" no modal de edição de um projeto ativo
   - O evento `copyToTemplate` é disparado com o ID do projeto ativo

2. **Processo de Conversão (`ProjectManager.copyProjectToTemplate`)**
   - Busca dados completos do projeto original no Supabase
   - Verifica autenticação do usuário
   - Remove campos que não devem ser copiados (id, created_at, updated_at)
   - Cria novo projeto no Supabase com `template_proj: true`
   - Adiciona sufixo "(Template)" ao nome do projeto
   - Atualiza a lista local de projetos
   - Fecha a modal de edição original automaticamente
   - Dispara evento `forceReloadAllProjects` para atualizar todas as listas

### Logs e Validações

- **Logs Detalhados**
   ```javascript
   console.log('[TEMPLATE_COPY] Iniciando cópia do projeto para templates:', projectId);
   console.log('[TEMPLATE_COPY] Projeto encontrado:', projectData);
   console.log('[TEMPLATE_COPY] Dados preparados:', newTemplateData);
   console.log('[TEMPLATE_COPY] Template inserido, buscando dados...');
   console.log('[TEMPLATE_COPY] Novo template encontrado:', newTemplate);
   console.log('[TEMPLATE_COPY] Template adicionado à lista local');
   ```

- **Validações**
   ```javascript
   // Verificar se o projeto existe
   if (fetchError || !projectData) {
       console.error('[TEMPLATE_COPY] Projeto não encontrado:', fetchError);
       throw new Error('Projeto não encontrado ou dados inválidos');
   }

   // Verificar se o usuário está autenticado
   if (!this.userData?.id) {
       console.error('[TEMPLATE_COPY] ID do usuário não encontrado');
       throw new Error('Usuário não autenticado');
   }
   ```

### Sequência de Eventos

1. `copyToTemplate` → Inicia conversão para template
2. (Modal fecha automaticamente)
3. `forceReloadAllProjects` → Atualiza todas as listas de projetos
4. Mensagem de sucesso é exibida

### Interface no Modal de Edição

O botão "Copiar para Templates" aparece no modal de edição de projetos ativos:

```html
<div class="modal-footer">
    <button type="button" class="btn btn-secondary close-modal">Cancelar</button>
    <button type="button" class="btn btn-info save-as-template">Copiar para Templates</button>
    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
</div>
```

O botão é ocultado automaticamente se o projeto já for um template:

```javascript
// Verificar se o projeto já é um template e ocultar o botão se for
const saveAsTemplateBtn = this.elements.editProjectModal.querySelector('.save-as-template');
if (project.template_proj) {
    saveAsTemplateBtn.style.display = 'none';
} else {
    saveAsTemplateBtn.style.display = 'inline-block';
}
```

### Pontos Importantes

- **Cópia vs. Conversão**: O projeto original NÃO é convertido em template, mas sim copiado
- **Fechamento Automático**: A modal é fechada imediatamente após a operação
- **Atualização Completa**: Todas as listas são recarregadas para garantir consistência
- **Nomenclatura**: O sufixo "(Template)" é adicionado ao nome para identificação clara
- **Verificação de Estado**: O botão só aparece para projetos que não são templates

### Testes Recomendados

1. **Conversão Básica:**
   - Verificar cópia com todos os campos corretos
   - Confirmar que o sufixo "(Template)" é adicionado ao nome
   - Verificar se o template aparece na tab "Templates"

2. **Confirmação Visual:**
   - Verificar se a modal fecha automaticamente
   - Confirmar exibição da mensagem de sucesso
   - Testar navegação para a tab "Templates" após a operação

3. **Erros e Validações:**
   - Testar sem autenticação do usuário
   - Verificar comportamento com projeto inexistente
   - Testar comportamento quando o projeto já é um template

### Troubleshooting Comum

- **Template não aparece**: Verificar se o evento `forceReloadAllProjects` está sendo tratado
- **Erro durante cópia**: Verificar logs de erro do Supabase
- **Botão "Copiar para Templates" não aparece**: Verificar se o projeto já é um template
- **Modal não fecha**: Verificar se `hideEditProjectModal()` está sendo chamado

### Pontos Importantes

- **Criação do Projeto**: O projeto é criado imediatamente no Supabase
- **Campos Obrigatórios**: `user_id`, `internal_name`, `template_proj=false`
- **Tratamento de Erros**: Validações em cada etapa com mensagens específicas
- **Limpeza de Dados**: Exclusão do projeto se o usuário cancelar a operação
- **Organização do Código**: Módulos separados para gerenciamento de projetos e UI

### Testes Recomendados

1. **Duplicação Básica:**
   - Verificar criação com todos os campos corretos
   - Confirmar tab é alterada para "Meus Projetos"
   - Verificar se o modal é exibido corretamente

# Documentação do Dashboard

## Estrutura do Projeto

### Layout dos Cards de Projeto

#### Estrutura do Card

Os cards de projeto são estruturados com um layout vertical, contendo:

1. **Imagem do Projeto**: 
   - Dimensão fixa de 180x180px
   - Exibe a imagem do projeto armazenada no banco de dados (formato bytea)
   - Usa ícones do Font Awesome como fallback quando não há imagem disponível
   - Centralizada no topo do card

2. **Informações do Projeto**:
   - Nome do projeto no topo (com truncamento para nomes longos)
   - Descrição logo abaixo do nome (limitada a 3 linhas)

3. **Datas e Ações**:
   - Datas de criação e atualização
   - Botões de ação específicos para cada tipo de projeto

```html
<div class="project-card-content">
    <div class="project-image">
        <!-- Imagem do projeto ou ícone fallback -->
        <img src="data:image/png;base64,${project.image_proj}" alt="${project.internal_name}">
    </div>
    <div class="project-info">
        <h3 class="project-name">Nome do Projeto</h3>
        <p class="project-description">Descrição do projeto aqui...</p>
    </div>
    <div class="project-dates-actions">
        <div class="project-dates">
            <!-- Datas de criação e atualização -->
        </div>
        <div class="project-actions">
            <!-- Botões de ação -->
        </div>
    </div>
</div>
```

#### Layout Responsivo

O layout dos projetos foi configurado para exibir:
- Exatamente 2 projetos por linha em telas normais
- Ocupando toda a largura disponível da página
- Cards com largura mínima de 300px
- Espaçamento adequado entre os cards (gap de 2rem)

```css
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(calc(50% - 1rem), 1fr));
    gap: 2rem;
    width: 100%;
}
```

#### Renderização de Imagens

As imagens dos projetos são armazenadas no banco de dados como `bytea` e renderizadas usando:

```javascript
// Para renderizar:
projectImageHTML = `<img src="data:image/png;base64,${project.image_proj}" alt="${project.internal_name}" onerror="this.onerror=null; this.style.display='none'; this.parentNode.innerHTML='<i class=\\'fas fa-file-alt project-icon\\'></i>';">`;

// Para atualizar:
imgElement.src = `data:image/png;base64,${updatedProject.image_proj}`;
```

O sistema inclui tratamento de erros para garantir uma exibição adequada mesmo quando a imagem não pode ser carregada, caindo para um ícone Font Awesome como fallback.

## Considerações para Implementação

1. **Imagens SVG**: Verifique se o SVG está em formato de string válido na coluna `image_proj`
2. **Fallback**: Um ícone padrão é exibido quando `image_proj` não está disponível
3. **Datas**: Ambas as datas (`created_at` e `updated_at`) são agora exibidas no card
4. **Formatação**: O método `formatDate` é utilizado para exibir as datas em formato localizado

## Fluxo de Mudança de Tab

```

#### Integração com o Sistema de Perfil de Usuário

O Dashboard está integrado com o sistema de perfil de usuário implementado no Ribbon. Esta integração permite:

1. **Exibição de Dados do Usuário**:
   - O Dashboard exibe dados básicos do usuário atual em componentes relevantes
   - Informações como nome e email são obtidas através do `UserManager`

2. **Botões de Acesso Rápido**:
   - Futuramente, poderão ser implementados botões de acesso rápido ao perfil dentro do Dashboard
   - Estes botões utilizarão o sistema de comunicação do Ribbon para abrir o modal de perfil

3. **Acesso a Estatísticas**:
   - O sistema de perfil exibe estatísticas relacionadas aos projetos do usuário
   - Estas estatísticas são calculadas com base nos dados gerenciados pelo Dashboard

4. **Organização do Código**:
   - O sistema de perfil segue uma organização modular:
     - HTML estrutural em `core/auth/profile.html` (sem estilos inline)
     - Código JavaScript em `core/auth/js/profile.js` 
     - Estilos CSS em `core/auth/css/profile.css`
   - Esta separação clara facilita a manutenção e evolução do sistema

#### Compartilhamento de Estado

O Dashboard e o sistema de perfil compartilham o mesmo estado de usuário através do Supabase. Quando alterações são feitas no perfil:

1. Os dados são atualizados no banco de dados
2. O Dashboard pode ser configurado para detectar estas alterações através de:
   - Polling periódico via `UserManager`
   - Evento de atualização de perfil via sistema de mensagens

Para implementar a detecção de alterações de perfil, o seguinte código pode ser adicionado ao Dashboard:

```javascript
// No DashboardModule.js
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PROFILE_UPDATED') {
        // Recarregar dados de usuário 
        this.userManager.reloadCurrentUser();
        
        // Atualizar componentes visuais
        this.updateUserRelatedUI();
    }
});
