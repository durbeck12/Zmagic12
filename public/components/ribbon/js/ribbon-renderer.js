/**
 * Ribbon Renderer
 * Classe responsável por renderizar a interface do ribbon a partir da configuração.
 */

// Usar a configuração global do RibbonConfig definida em config/ribbon-config.js
// A configuração será carregada antes deste arquivo

class RibbonRenderer {
  /**
   * Inicializa o renderizador
   * @param {HTMLElement} container - Elemento HTML onde o ribbon será renderizado 
   */
  constructor(container) {
    this.container = container;
    this.activeTab = null;
    
    // Verificar se a configuração global está disponível
    if (!window.RibbonConfig) {
      console.error('[RIBBON-RENDERER] RibbonConfig não encontrado. Verifique se o arquivo config/ribbon-config.js foi carregado corretamente.');
    } else {
      console.log('[RIBBON-RENDERER] RibbonConfig encontrado com sucesso:', window.RibbonConfig.tabs.length, 'tabs configuradas');
    }
  }

  /**
   * Renderiza toda a estrutura do ribbon
   */
  render() {
    // Limpa o container
    this.container.innerHTML = '';
    
    // Cria a estrutura base
    const ribbonWrapper = document.createElement('div');
    ribbonWrapper.className = 'ribbon-container';
    
    // Renderiza o logo
    ribbonWrapper.appendChild(this.renderLogo());
    
    // Renderiza as abas
    ribbonWrapper.appendChild(this.renderTabs());
    
    // Renderiza o conteúdo das abas
    const contents = this.renderTabContents();
    contents.forEach(content => ribbonWrapper.appendChild(content));
    
    // Adiciona ao container
    this.container.appendChild(ribbonWrapper);
    
    // Lista as abas disponíveis para depuração
    this.logAvailableTabs();
    
    // Ativa a aba padrão
    const defaultTabId = window.RibbonConfig.settings.defaultActiveTab;
    console.log(`[RIBBON-RENDERER] Ativando aba padrão: ${defaultTabId}`);
    this.activateTab(defaultTabId);
    
    // Configura os eventos
    this.setupEvents();
  }

  /**
   * Loga todas as abas disponíveis para depuração
   */
  logAvailableTabs() {
    if (!window.RibbonConfig || !window.RibbonConfig.tabs) {
      console.error('[RIBBON-RENDERER] Não foi possível listar as abas: RibbonConfig não disponível');
      return;
    }
    
    console.log('[RIBBON-RENDERER] Abas disponíveis:');
    window.RibbonConfig.tabs.forEach(tab => {
      console.log(`[RIBBON-RENDERER] - Tab: ${tab.id}, Label: ${tab.label}, URL: ${tab.contentUrl || 'Não definida'}`);
    });
  }

  /**
   * Renderiza o logo da aplicação
   * @returns {HTMLElement}
   */
  renderLogo() {
    const logoDiv = document.createElement('div');
    logoDiv.className = 'ribbon-logo';
    
    const logoImg = document.createElement('img');
    logoImg.src = '/public/main/images/logo.svg';
    logoImg.alt = 'ZMagic12 Logo';
    
    const zmagicText = document.createElement('span');
    zmagicText.className = 'zmagic-text';
    zmagicText.textContent = 'ZMagic';
    
    const numberText = document.createElement('span');
    numberText.className = 'number-text';
    numberText.textContent = '12';
    
    const userInfo = document.createElement('span');
    userInfo.className = 'user-info';
    
    const projectInfo = document.createElement('span');
    projectInfo.className = 'project-info';
    
    logoDiv.appendChild(logoImg);
    logoDiv.appendChild(zmagicText);
    logoDiv.appendChild(numberText);
    logoDiv.appendChild(userInfo);
    logoDiv.appendChild(projectInfo);
    
    return logoDiv;
  }

  /**
   * Renderiza as abas do ribbon
   * @returns {HTMLElement}
   */
  renderTabs() {
    const tabsList = document.createElement('ul');
    tabsList.className = 'ribbon-tabs';
    
    window.RibbonConfig.tabs.forEach(tab => {
      const tabItem = document.createElement('li');
      tabItem.className = `ribbon-tab ribbon-tab-${tab.id}`;
      tabItem.dataset.tab = tab.id;
      tabItem.textContent = tab.label;
      
      // Se a tab tiver uma URL de conteúdo, armazenar como atributo data
      if (tab.contentUrl) {
        tabItem.dataset.contentUrl = tab.contentUrl;
      }
      
      tabsList.appendChild(tabItem);
    });
    
    return tabsList;
  }

  /**
   * Renderiza o conteúdo de todas as abas
   * @returns {Array<HTMLElement>}
   */
  renderTabContents() {
    return window.RibbonConfig.tabs.map(tab => {
      const tabContent = document.createElement('div');
      tabContent.className = 'ribbon-content';
      tabContent.id = `${tab.id}-tab-content`;
      
      if (tab.groups && Array.isArray(tab.groups)) {
        tab.groups.forEach(group => {
          tabContent.appendChild(this.renderGroup(group));
        });
      }
      
      return tabContent;
    });
  }

  /**
   * Renderiza um grupo de botões
   * @param {Object} group - Configuração do grupo
   * @returns {HTMLElement}
   */
  renderGroup(group) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'ribbon-group';
    groupDiv.dataset.groupId = group.id;
    
    const groupContent = document.createElement('div');
    groupContent.className = 'ribbon-group-content';
    
    if (group.buttons && Array.isArray(group.buttons)) {
      group.buttons.forEach(button => {
        groupContent.appendChild(this.renderButton(button));
      });
    }
    
    groupDiv.appendChild(groupContent);
    
    if (window.RibbonConfig.settings.showGroupTitles) {
      const groupTitle = document.createElement('div');
      groupTitle.className = 'ribbon-group-title';
      groupTitle.textContent = group.title;
      groupDiv.appendChild(groupTitle);
    }
    
    return groupDiv;
  }

  /**
   * Renderiza um botão
   * @param {Object} button - Configuração do botão
   * @returns {HTMLElement}
   */
  renderButton(button) {
    const buttonEl = document.createElement('button');
    buttonEl.className = 'ribbon-button';
    buttonEl.id = button.id;
    buttonEl.dataset.action = button.action;
    
    // Usar elemento img para carregar o SVG como um arquivo externo
    const iconImg = document.createElement('img');
    iconImg.className = 'ribbon-button-icon';
    iconImg.src = `icons/svg/${button.icon}.svg`;
    iconImg.alt = button.label;
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'ribbon-button-text';
    labelSpan.textContent = button.label;
    
    buttonEl.appendChild(iconImg);
    buttonEl.appendChild(labelSpan);
    
    return buttonEl;
  }

  /**
   * Ativa uma aba específica
   * @param {string} tabId - ID da aba a ser ativada
   */
  activateTab(tabId) {
    console.log(`[RIBBON-RENDERER] Tentando ativar tab: ${tabId}`);
    
    const tabs = this.container.querySelectorAll('.ribbon-tab');
    const contents = this.container.querySelectorAll('.ribbon-content');
    
    // Remove a classe active de todas as abas e conteúdos
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    // Adiciona a classe active na aba selecionada e seu conteúdo
    const tab = this.container.querySelector(`.ribbon-tab[data-tab="${tabId}"]`);
    const content = this.container.querySelector(`#${tabId}-tab-content`);
    
    if (tab && content) {
      console.log(`[RIBBON-RENDERER] Tab ${tabId} encontrada e ativada`);
      tab.classList.add('active');
      content.classList.add('active');
      this.activeTab = tabId;
      
      // Verificar se a tab possui URL de conteúdo
      if (tab.dataset.contentUrl) {
        console.log(`[RIBBON-RENDERER] Tab ${tabId} possui URL de conteúdo: ${tab.dataset.contentUrl}`);
      }
      
      // Disparar evento personalizado após ativação da aba
      setTimeout(() => {
        const event = new CustomEvent('ribbon:tabactivated', {
          detail: { tabId, contentUrl: tab.dataset.contentUrl }
        });
        document.dispatchEvent(event);
        console.log(`[RIBBON-RENDERER] Evento ribbon:tabactivated disparado para tab ${tabId}`);
      }, 100);
    } else {
      console.error(`[RIBBON-RENDERER] Tab ${tabId} não encontrada`);
      if (!tab) console.error(`[RIBBON-RENDERER] Elemento tab[data-tab="${tabId}"] não encontrado`);
      if (!content) console.error(`[RIBBON-RENDERER] Elemento #${tabId}-tab-content não encontrado`);
    }
  }

  /**
   * Configura os eventos do ribbon
   */
  setupEvents() {
    // Evento de clique nas abas
    const tabs = this.container.querySelectorAll('.ribbon-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        console.log(`[RIBBON-RENDERER] Tab ${tabId} clicada`);
        this.activateTab(tabId);
        
        // Dispara evento personalizado
        const event = new CustomEvent('ribbon:tabchange', {
          detail: { tabId, contentUrl: tab.dataset.contentUrl }
        });
        document.dispatchEvent(event);
      });
    });
    
    // Evento de clique nos botões
    const buttons = this.container.querySelectorAll('.ribbon-button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        const buttonId = button.id;
        
        // Dispara evento personalizado
        const event = new CustomEvent('ribbon:action', {
          detail: { action, buttonId }
        });
        document.dispatchEvent(event);
      });
    });
  }
}

// Singleton para facilitar o acesso global
function initRibbon(container) {
  const instance = new RibbonRenderer(container);
  instance.render();
  return instance;
}

// Expor para o escopo global
window.RibbonRenderer = RibbonRenderer;
window.initRibbon = initRibbon; 