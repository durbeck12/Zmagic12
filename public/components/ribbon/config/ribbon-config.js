/**
 * Configuração Central dos Ribbons
 * Este arquivo define a estrutura completa dos ribbons, tabs, grupos e botões.
 * Para adicionar, remover ou modificar elementos do ribbon, edite este arquivo.
 */

const RibbonConfig = {
  // Configuração geral do ribbon
  settings: {
    defaultActiveTab: 'projects',
    animationSpeed: 300,
    showGroupTitles: true
  },
  
  // Definição das abas (tabs)
  tabs: [
    {
      id: 'projects',
      label: 'Projetos',
      icon: 'folder',
      contentUrl: '/public/components/modules/dashboard/index.html',
      groups: [
        {
          id: 'project-actions',
          title: 'Projetos',
          buttons: [
            { 
              id: 'add-project-btn',
              icon: 'icon-add-project',
              label: 'Novo',
              action: 'createNewProject',
              moduleCommand: 'showNewProjectModal',
              moduleParams: {}
            }
          ]
        },
        {
          id: 'project-actions-2',
          title: 'Meus Projectos',
          buttons: [
            {
              id: 'my-projects-btn',
              icon: 'icon-my-projects',
              label: 'Projetos',
              action: 'showProjects',
              moduleCommand: 'switchTab',
              moduleParams: { tab: 'projects' }
            },
            {
              id: 'archived-projects-btn',
              icon: 'icon-archived',
              label: 'Arquivados',
              action: 'showArchivedProjects',
              moduleCommand: 'switchTab',
              moduleParams: { tab: 'archived' }
            },
            {
              id: 'templates-btn',
              icon: 'icon-templates',
              label: 'Templates',
              action: 'showTemplates',
              moduleCommand: 'switchTab',
              moduleParams: { tab: 'templates' }
            }
          ]
        },
        {
          id: 'account-actions',
          title: 'Account',
          buttons: [
            { 
              id: 'logout-btn',
              icon: 'icon-logout',
              label: 'Logout',
              action: 'exitAccount'
            }
          ]
        },
      ]
    },
    {
      id: 'forms',
      label: 'Formulários',
      icon: 'form',
      contentUrl: '/public/components/modules/form-builder/index.html',
      groups: [
        {
          id: 'form-editors',
          title: 'Editores',
          buttons: [
            {
              id: 'form-builder-btn',
              icon: 'icon-form-builder',
              label: 'Form Builder',
              action: 'loadFormBuilder'
            },
            {
              id: 'ui-code-btn',
              icon: 'icon-ui-code',
              label: 'UI Code',
              action: 'loadUICode'
            },
            {
              id: 'tcmd-btn',
              icon: 'icon-tcmd-code',
              label: 'TCMD Code',
              action: 'loadTCMDCode'
            },
            {
              id: 'qrc-btn',
              icon: 'icon-qrc-code',
              label: 'QRC',
              action: 'loadQRCCode'
            }
          ]
        },
        {
          id: 'project-io',
          title: 'Importar/Exportar',
          buttons: [
            {
              id: 'import-projects-btn',
              icon: 'icon-import',
              label: 'Importar',
              action: 'importProject'
            },
            {
              id: 'export-projects-btn',
              icon: 'icon-export',
              label: 'Exportar',
              action: 'exportProject'
            }
          ]
        },
        {
          id: 'form-actions',
          title: 'Acções',
          buttons: [
            {
              id: 'forms-save-btn',
              icon: 'icon-save',
              label: 'Guardar',
              action: 'saveForm'
            },
            {
              id: 'forms-preview-btn',
              icon: 'icon-preview',
              label: 'Preview',
              action: 'previewForm'
            }
          ]
        }
      ]
    },
    {
      id: 'macros',
      label: 'Macros',
      icon: 'code',
      contentUrl: '/public/components/modules/macros/index.html',
      groups: [
        {
          id: 'macro-editors',
          title: 'Editores',
          buttons: [
            {
              id: 'macro-editor-btn',
              icon: 'icon-macro-editor',
              label: 'Macro Editor',
              action: 'loadMacroEditor'
            },
            {
              id: 'macro-library-btn',
              icon: 'icon-macro-library',
              label: 'Biblioteca',
              action: 'loadMacroLibrary'
            }
          ]
        },
        {
          id: 'macro-actions',
          title: 'Acções',
          buttons: [
            {
              id: 'macros-save-btn',
              icon: 'icon-save',
              label: 'Guardar',
              action: 'saveMacro'
            },
            {
              id: 'macro-backup-btn',
              icon: 'icon-macro-backup',
              label: 'Cópia de Segurança',
              action: 'backupMacro'
            }
          ]
        }
      ]
    },
    {
      id: 'lowcode',
      label: 'Low Code',
      icon: 'puzzle',
      contentUrl: '/public/components/modules/lowcode/index.html',
      groups: [
        {
          id: 'lowcode-editors',
          title: 'Editores',
          buttons: [
            {
              id: 'flowcode-btn',
              icon: 'icon-flowcode',
              label: 'FlowCode',
              action: 'loadFlowCode'
            },
            {
              id: 'blockscript-btn',
              icon: 'icon-blockscript',
              label: 'BlockScript',
              action: 'loadBlockScript'
            },
            {
              id: 'freescript-btn',
              icon: 'icon-freescript',
              label: 'FreeScript',
              action: 'loadFreeScript'
            }
          ]
        },
        {
          id: 'lowcode-actions',
          title: 'Acções',
          buttons: [
            {
              id: 'lowcode-save-btn',
              icon: 'icon-save',
              label: 'Guardar',
              action: 'saveLowCode'
            },
            {
              id: 'script-backup-btn',
              icon: 'icon-script-backup',
              label: 'Cópia de Segurança',
              action: 'backupScript'
            }
          ]
        }
      ]
    },
    {
      id: 'details',
      label: 'Project Details',
      icon: 'info',
      contentUrl: '/public/components/modules/details/index.html',
      groups: [
        {
          id: 'project-details',
          title: 'Detalhes',
          buttons: [
            {
              id: 'project-info-btn',
              icon: 'icon-project-info',
              label: 'Informações',
              action: 'showProjectInfo'
            },
            {
              id: 'marketplace-btn',
              icon: 'icon-marketplace',
              label: 'Marketplace',
              action: 'openMarketplace'
            }
          ]
        },
        {
          id: 'project-detail-actions',
          title: 'Acções',
          buttons: [
            {
              id: 'details-save-btn',
              icon: 'icon-save',
              label: 'Guardar',
              action: 'saveProjectDetails'
            }
          ]
        }
      ]
    }
  ],
  
  // Métodos utilitários para aceder à configuração
  getTabById: function(tabId) {
    return RibbonConfig.tabs.find(tab => tab.id === tabId) || null;
  },
  
  getButtonById: function(buttonId) {
    for (const tab of RibbonConfig.tabs) {
      for (const group of tab.groups) {
        const button = group.buttons.find(btn => btn.id === buttonId);
        if (button) return button;
      }
    }
    return null;
  },
  
  // Método para obter a URL do conteúdo de uma aba
  getTabContentUrl: function(tabId) {
    const tab = this.getTabById(tabId);
    return tab ? tab.contentUrl : null;
  }
};

// Expor a configuração para o escopo global
window.RibbonConfig = RibbonConfig; 