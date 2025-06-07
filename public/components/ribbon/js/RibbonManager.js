/**
 * RibbonManager Class
 * Classe para gerenciar componentes e comportamentos do ribbon
 * Foco na interface gráfica e gerenciamento visual
 */
class RibbonManager {
  constructor(config = window.RibbonConfig) {
    this.config = config || { tabs: [], actions: {} };
    this.ribbonContainer = null;
    this.activeTab = null;
    
    // Se não houver configuração, use valores padrão
    if (!this.config.tabs) this.config.tabs = [];
    if (!this.config.actions) this.config.actions = {};
    
    // Inicializar
    this.init();
  }

  init() {
    // Debug - Registrar a inicialização no console
    console.log('[RIBBON MANAGER] Inicializando...');
    
    // Verificar estado inicial do elemento user-info
    const initialUserInfo = document.getElementById('user-info');
    if (initialUserInfo) {
      console.log('[RIBBON MANAGER] Estado inicial do user-info:', {
        text: initialUserInfo.textContent,
        display: window.getComputedStyle(initialUserInfo).display,
        visibility: window.getComputedStyle(initialUserInfo).visibility
      });
    }
    
    // Tentar carregar informações do usuário, mas sem sobrescrever se já existir conteúdo
    this.loadUserInfo(false);
    
    this.bindGlobalEvents();
    
    // Adicionar listener para evento de autenticação
    document.addEventListener('supabase:ready', () => {
      console.log('[RIBBON MANAGER] Evento supabase:ready recebido');
      // Tentar carregar informações do usuário, mas sem sobrescrever se já existir conteúdo
      this.loadUserInfo(false);
    });
    
    // Adicionar listener para eventos de tradução
    document.addEventListener('ribbon:translations:updated', () => {
      console.log('[RIBBON MANAGER] Evento ribbon:translations:updated recebido');
      // Renderizar o ribbon com as traduções atualizadas
      this.renderRibbon();
    });
  }

  /**
   * Renderiza o ribbon com base na configuração atual
   */
  renderRibbon() {
    try {
      console.log('[RIBBON MANAGER] Renderizando ribbon...');
      
      // Identificar os elementos principais
      const tabsContainer = document.querySelector('.ribbon-tabs');
      const contentContainer = document.getElementById('ribbon-content-container');
      
      if (!tabsContainer || !contentContainer) {
        console.error('[RIBBON MANAGER] Elementos do ribbon não encontrados no DOM');
        return;
      }
      
      // Limpar o conteúdo atual
      tabsContainer.innerHTML = '';
      contentContainer.innerHTML = '';
      
      // Renderizar as abas
      this.config.tabs.forEach(tab => {
        // Criar o elemento da aba
        const tabElement = document.createElement('li');
        tabElement.className = 'ribbon-tab';
        tabElement.dataset.tab = tab.id;
        tabElement.innerHTML = `
          <span class="tab-icon ${tab.icon}"></span>
          <span class="tab-label">${tab.label}</span>
        `;
        
        // Adicionar evento de clique para a aba
        tabElement.addEventListener('click', () => {
          this.activateTab(tab.id);
        });
        
        // Adicionar a aba ao container
        tabsContainer.appendChild(tabElement);
        
        // Criar o conteúdo da aba
        const tabContent = document.createElement('div');
        tabContent.className = 'ribbon-tab-content';
        tabContent.dataset.tab = tab.id;
        tabContent.style.display = 'none';
        
        // Renderizar os grupos da aba
        tab.groups.forEach(group => {
          // Criar o elemento do grupo
          const groupElement = document.createElement('div');
          groupElement.className = 'ribbon-group';
          groupElement.dataset.group = group.id;
          
          // Renderizar o conteúdo do grupo
          let groupContent = `<div class="group-buttons">`;
          
          // Adicionar os botões ao grupo
          group.buttons.forEach(button => {
            groupContent += `
              <div class="ribbon-button" id="${button.id}" data-action="${button.action || ''}">
                <div class="button-icon ${button.icon}"></div>
                <div class="button-label">${button.label}</div>
              </div>
            `;
          });
          
          groupContent += `</div>`;
          
          // Adicionar o título do grupo, se configurado para mostrar
          if (this.config.settings.showGroupTitles && group.title) {
            groupContent += `<div class="group-title">${group.title}</div>`;
          }
          
          groupElement.innerHTML = groupContent;
          
          // Adicionar o grupo ao conteúdo da aba
          tabContent.appendChild(groupElement);
        });
        
        // Adicionar o conteúdo da aba ao container
        contentContainer.appendChild(tabContent);
      });
      
      // Ativar a aba padrão ou a primeira aba, se disponível
      const defaultTabId = this.config.settings.defaultActiveTab;
      if (defaultTabId && this.config.tabs.some(tab => tab.id === defaultTabId)) {
        this.activateTab(defaultTabId);
      } else if (this.config.tabs.length > 0) {
        this.activateTab(this.config.tabs[0].id);
      }
      
      console.log('[RIBBON MANAGER] Ribbon renderizado com sucesso');
    } catch (error) {
      console.error('[RIBBON MANAGER] Erro ao renderizar o ribbon:', error);
    }
  }
  
  /**
   * Ativa uma aba específica
   * @param {string} tabId - ID da aba a ser ativada
   */
  activateTab(tabId) {
    console.log(`[RIBBON MANAGER] Ativando aba: ${tabId}`);
    
    // Desativar a aba atual
    const currentActiveTab = document.querySelector('.ribbon-tab.active');
    if (currentActiveTab) {
      currentActiveTab.classList.remove('active');
    }
    
    // Esconder todo o conteúdo atual
    const allContents = document.querySelectorAll('.ribbon-tab-content');
    allContents.forEach(content => {
      content.style.display = 'none';
    });
    
    // Ativar a nova aba
    const newTab = document.querySelector(`.ribbon-tab[data-tab="${tabId}"]`);
    if (newTab) {
      newTab.classList.add('active');
      
      // Mostrar o conteúdo da aba
      const tabContent = document.querySelector(`.ribbon-tab-content[data-tab="${tabId}"]`);
      if (tabContent) {
        tabContent.style.display = 'flex';
      }
      
      // Armazenar a aba ativa atual
      this.activeTab = tabId;
      
      // Disparar evento de aba ativada
      const event = new CustomEvent('ribbon:tab:activated', {
        detail: { tabId, tab: this.config.getTabById(tabId) }
      });
      document.dispatchEvent(event);
    } else {
      console.error(`[RIBBON MANAGER] Aba não encontrada: ${tabId}`);
    }
  }

  /**
   * Carrega e exibe informações do usuário conectado
   * @param {boolean} forceOverride - Se deve sobrescrever o conteúdo existente
   */
  async loadUserInfo(forceOverride = false) {
    // Verificar se há elemento para mostrar informações do usuário
    const userInfoElement = document.getElementById('user-info');
    if (!userInfoElement) {
      console.error('[RIBBON] Elemento user-info não encontrado no DOM');
      return;
    }

    // Se já tem conteúdo e não é para sobrescrever, manter o existente
    if (!forceOverride && userInfoElement.textContent && userInfoElement.textContent.trim() !== '') {
      console.log('[RIBBON MANAGER] user-info já possui conteúdo, não sobrescrevendo:', userInfoElement.textContent);
      
      // Apenas garantir que esteja visível
      userInfoElement.style.display = 'inline-block';
      userInfoElement.style.visibility = 'visible';
      userInfoElement.style.opacity = '1';
      return;
    }

    try {
      // Tentar obter email do usuário
      const userEmail = await this.getUserEmail();
      console.log('[RIBBON] Email obtido em loadUserInfo:', userEmail);
      
      if (userEmail) {
        // O ícone agora já é adicionado diretamente no HTML
        userInfoElement.textContent = userEmail;
        // Forçar exibição
        userInfoElement.style.display = 'inline-block';
        userInfoElement.style.visibility = 'visible';
        userInfoElement.style.opacity = '1';
        console.log('[RIBBON] Email do usuário definido no elemento:', userEmail);
      } else {
        // No caso de não ter email, definir um texto padrão
        userInfoElement.textContent = 'Usuário não identificado';
        userInfoElement.style.display = 'inline-block';
        userInfoElement.style.visibility = 'visible';
        userInfoElement.style.opacity = '1';
        console.log('[RIBBON] Email do usuário não encontrado, definindo texto padrão');
      }
    } catch (error) {
      console.error('[RIBBON] Erro ao carregar informações do usuário:', error);
      userInfoElement.textContent = 'Erro ao carregar usuário';
      userInfoElement.style.display = 'inline-block';
      userInfoElement.style.visibility = 'visible';
      userInfoElement.style.opacity = '1';
    }
  }

  /**
   * Obtém email do usuário atualmente logado
   * @returns {Promise<string|null>} Email do usuário ou null se não estiver logado
   */
  async getUserEmail() {
    // Primeiro, verificar se o cliente Supabase está disponível
    if (window.supabase && window.supabase.auth) {
      try {
        // Obter usuário atual via Supabase
        const { data, error } = await window.supabase.auth.getUser();
        
        if (error) {
          console.error('[RIBBON] Erro ao obter usuário do Supabase:', error.message);
        } else if (data && data.user) {
          console.log('[RIBBON] Usuário obtido do Supabase:', data.user.email);
          return data.user.email;
        }
      } catch (e) {
        console.error('[RIBBON] Erro ao verificar usuário no Supabase:', e);
      }
    }
    
    // Se não conseguir via Supabase, verificar localStorage
    console.log('[RIBBON] Verificando usuário no localStorage...');
    
    // Verificar no localStorage seguindo o padrão da aplicação
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.email || null;
      } catch (e) {
        console.error('[RIBBON] Erro ao analisar dados do usuário do localStorage:', e);
      }
    }
    
    // Verificar token da sessão do Supabase no localStorage (formato alternativo)
    const supabaseToken = localStorage.getItem('supabase.auth.token');
    if (supabaseToken) {
      try {
        const tokenData = JSON.parse(supabaseToken);
        if (tokenData && tokenData.currentSession && tokenData.currentSession.user) {
          return tokenData.currentSession.user.email;
        }
      } catch (e) {
        console.error('[RIBBON] Erro ao analisar token Supabase do localStorage:', e);
      }
    }
    
    // Se estiver em modo teste, retornar um email padrão
    if (window.isTestMode) {
      return 'test@example.com';
    }
    
    return null;
  }

  bindGlobalEvents() {
    document.addEventListener('click', e => {
      const button = e.target.closest('.ribbon-button');
      if (button) {
        const action = button.dataset.action;
        if (action) {
          this.handleButtonAction(button.id, action);
        }
      }
    });
    
    // Adicionar listener para eventos de login/logout
    document.addEventListener('user:login', (event) => {
      console.log('[RIBBON] Evento de login detectado:', event.detail);
      if (event.detail && event.detail.user) {
        console.log('[RIBBON] Email do usuário no evento:', event.detail.user.email);
        
        // Já atualizamos o elemento diretamente no HTML, então só garantir visibilidade
        const userInfoElement = document.getElementById('user-info');
        if (userInfoElement) {
          // Verificar se já tem conteúdo antes de sobrescrever
          if (!userInfoElement.textContent || userInfoElement.textContent.trim() === '') {
            userInfoElement.textContent = event.detail.user.email;
          }
          userInfoElement.style.display = 'inline-block';
          userInfoElement.style.visibility = 'visible';
          userInfoElement.style.opacity = '1';
          console.log('[RIBBON] Garantindo visibilidade do elemento user-info');
        }
      }
    });
    
    document.addEventListener('user:logout', () => {
      console.log('[RIBBON] Evento de logout detectado. Removendo informações do usuário.');
      const userInfoElement = document.getElementById('user-info');
      if (userInfoElement) {
        userInfoElement.textContent = 'Usuário não autenticado';
        userInfoElement.style.display = 'inline-block';
        userInfoElement.style.visibility = 'visible';
        userInfoElement.style.opacity = '1';
      }
    });
  }

  handleButtonAction(buttonId, action) {
    console.log(`Botão clicado: ${buttonId}, Ação: ${action}`);
    
    // Disparar evento de ação do ribbon
    const event = new CustomEvent('ribbon:action', {
      detail: { buttonId, action }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Dispara uma ação baseada no ID do botão e na ação
   * @param {string} buttonId - ID do botão
   * @param {string} action - Ação a ser executada
   */
  dispatchAction(buttonId, action) {
    console.log(`Ação disparada: ${action || 'undefined'} do botão: ${buttonId || 'undefined'}`);
    
    // Disparar evento global
    const event = new CustomEvent('ribbon:action:executed', {
      detail: { buttonId, action }
    });
    document.dispatchEvent(event);
  }
}

// Expor para o escopo global
window.RibbonManager = RibbonManager;

// Iniciar o RibbonManager quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log('[RIBBON MANAGER] DOM carregado, inicializando RibbonManager');
  window.ribbonManager = new RibbonManager();
  
  // Chamar a função de renderização
  window.ribbonManager.renderRibbon();
}); 