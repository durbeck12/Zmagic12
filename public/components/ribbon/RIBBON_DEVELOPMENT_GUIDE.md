# Ribbon Module - Guia de Desenvolvimento

## Visão Geral
O Ribbon é um componente de interface que oferece uma barra de navegação estilo Microsoft Office, com abas, grupos e botões organizados de forma hierárquica. Este módulo proporciona uma interface unificada e intuitiva para acessar as principais funcionalidades da aplicação ZMagic12, concentrando-se exclusivamente no aspecto visual e de interação com a interface.

## Estrutura do Módulo
```
ribbon/
├── index.html                # Página principal com a estrutura básica do ribbon
├── js/                       # Scripts JavaScript
│   ├── ribbon-controller.js  # Controlador principal, gerencia a interface do ribbon
│   ├── RibbonManager.js      # Gerenciador do ribbon
│   └── ribbon-renderer.js    # Renderizador de elementos do ribbon
├── css/                      # Arquivos de estilo
│   ├── styles.css            # Estilos gerais
│   ├── ribbon.css            # Estilos específicos do ribbon
│   └── modal.css             # Estilos para modais
├── config/                   # Configurações do ribbon
│   └── ribbon-config.js      # Configuração principal do ribbon - define toda a estrutura
└── icons/                    # Ícones para botões do ribbon
    └── svg/                  # Ícones SVG individuais
```

## Arquitetura de Módulos
A aplicação utiliza uma abordagem modular onde **todo conteúdo é carregado através de iframes**:

1. O Ribbon funciona como uma interface de navegação principal que permanece consistente
2. Todo conteúdo funcional (formulários, macros, editores, etc.) é carregado no container de módulos via iframe
3. Não há renderização local de dashboards ou outros conteúdos - tudo é encapsulado em iframes
4. A comunicação entre o Ribbon e os módulos ocorre através da API `postMessage`

Esta abordagem proporciona:
- Isolamento completo entre a navegação e o conteúdo
- Carregamento dinâmico de módulos sem refresh da página
- Melhor organização e manutenção do código
- Possibilidade de desenvolvimento independente de módulos

## Foco e Responsabilidades
Este módulo é **responsável apenas pelo aspecto gráfico do ribbon**, incluindo:
- Exibição visual dos elementos de interface (abas, grupos, botões)
- Interações básicas (cliques, mudanças de aba)
- Emissão de eventos para comunicação com módulos
- Carregamento de módulos através de iframes
- Exibição de informações do usuário autenticado

Não faz parte das responsabilidades deste módulo:
- Implementação de lógica de negócios
- Manipulação direta de dados
- Comunicação com APIs externas (exceto para autenticação básica)
- Renderização de conteúdo fora do ribbon

## Componentes Principais

### RibbonController
- **Arquivo**: `js/ribbon-controller.js`
- **Propósito**: Atua como controlador principal da interface do ribbon.
- **Responsabilidades**:
  - Inicialização da interface do ribbon
  - Gerenciamento das abas e seus estados visuais
  - Configuração de event listeners para elementos da interface
  - Emissão de eventos para comunicação com módulos

### RibbonRenderer
- **Arquivo**: `js/ribbon-renderer.js`
- **Propósito**: Gera dinamicamente os elementos do ribbon a partir da configuração.
- **Responsabilidades**:
  - Renderizar as abas, grupos e botões do ribbon
  - Gerar a estrutura HTML baseada na configuração do `ribbon-config.js`
  - Configurar os event listeners para os elementos renderizados
  - Carregar ícones SVG a partir de arquivos individuais

### RibbonManager
- **Arquivo**: `js/RibbonManager.js`
- **Propósito**: Gerencia aspectos funcionais do ribbon.
- **Responsabilidades**:
  - Controle de estado do ribbon
  - Gerenciamento de eventos dos botões
  - Emissão de eventos para outros módulos consumirem
  - Exibição de informações do usuário autenticado

### Configuração do Ribbon
- **Arquivo**: `config/ribbon-config.js`
- **Propósito**: Define a estrutura completa do ribbon, suas abas, grupos e botões.
- **Estrutura**:
  - `settings`: Configurações gerais (aba padrão, velocidade de animação)
  - `tabs`: Lista de abas disponíveis
    - Cada aba contém grupos
    - Cada grupo contém botões
  - Cada botão tem um ID, ícone, rótulo e ação associada

### Container de Módulos
- **Elemento**: `<div class="module-container" id="module-container">`
- **Propósito**: Container para os iframes que carregam os módulos da aplicação
- **Responsabilidades**:
  - Fornecer um ambiente isolado para módulos
  - Permitir carregamento dinâmico de diferentes funcionalidades
  - Servir como ponte de comunicação entre o ribbon e os módulos

### Exibição de Usuário
- **Elemento**: `<span id="user-info" class="user-info"></span>`
- **Propósito**: Exibir o email do usuário autenticado no ribbon
- **Funcionalidade**:
  - Mostra o email do usuário após autenticação bem-sucedida
  - É atualizado automaticamente quando o estado de autenticação muda
  - Fornece identificação visual do usuário ativo no sistema

### Ícones SVG
- **Diretório**: `icons/svg/`
- **Propósito**: Contém todos os ícones usados no ribbon como arquivos SVG individuais.
- **Padrão de nomenclatura**: `icon-[nome].svg`
- **Uso na interface**: Carregados como imagens no HTML através do RibbonRenderer

## Renderização Dinâmica do Ribbon

O ribbon é gerado dinamicamente pelo componente `RibbonRenderer` a partir da configuração definida em `ribbon-config.js`. Este processo acontece da seguinte forma:

1. O arquivo `index.html` contém apenas a estrutura básica do ribbon:
   - Container principal `.ribbon-container`
   - Container para o logo `.ribbon-logo`
   - Lista para as abas `.ribbon-tabs`
   - Container para o conteúdo das abas `#ribbon-content-container`
   - Container para módulos `#module-container`

2. Ao carregar a página, o `RibbonController` é inicializado, que por sua vez inicializa o `RibbonRenderer`

3. O `RibbonRenderer` lê a configuração do `window.RibbonConfig` e:
   - Gera as abas na lista `.ribbon-tabs`
   - Cria os containers de conteúdo para cada aba
   - Gera grupos e botões para cada aba conforme a configuração
   - Carrega os ícones SVG individuais para cada botão

4. Após a renderização, o `RibbonRenderer` configura os eventos para abas e botões

Esta abordagem dinâmica permite:
- Modificar o ribbon completamente apenas alterando o arquivo de configuração
- Manter o HTML limpo e focado apenas na estrutura principal
- Adicionar ou remover elementos sem alterar o HTML

## Autenticação e Exibição do Usuário

O Ribbon exibe o email do usuário autenticado de forma destacada na barra superior. Esta funcionalidade foi implementada de forma resiliente com múltiplas estratégias de fallback:

1. **Inicialização do Supabase**: A página carrega o client do Supabase via CDN e o inicializa:
   ```javascript
   // Incluir a biblioteca do CDN
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   // Inicializar o cliente
   const supabaseUrl = 'https://xjmpohdtonzeafylahmr.supabase.co';
   const supabaseKey = '...';
   window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
   ```

2. **Verificação de Autenticação**: Após inicialização, o sistema verifica o status atual do usuário:
   ```javascript
   async function checkAuthentication() {
     const { data, error } = await window.supabase.auth.getSession();
     if (data && data.session) {
       const { data: userData } = await window.supabase.auth.getUser();
       if (userData && userData.user) {
         // Atualizar a interface com o email do usuário
         document.dispatchEvent(new CustomEvent('user:login', {
           detail: { user: userData.user }
         }));
       }
     }
   }
   ```

3. **Sistema de Fallback**: O Ribbon implementa múltiplas estratégias para obter os dados do usuário:
   - API do Supabase (primeira tentativa)
   - LocalStorage - userData (segunda tentativa)
   - LocalStorage - token do Supabase (terceira tentativa)
   - Modo offline com usuário simulado (fallback final)

4. **Exibição Resiliente**: A exibição do email foi implementada com medidas para garantir visibilidade:
   ```css
   .ribbon-logo .user-info {
     margin-left: 20px;
     font-size: 12px;
     font-weight: 500;
     color: #2980b9 !important;
     background-color: #f0f4f8;
     padding: 3px 10px;
     border-radius: 4px;
     border: 1px solid #bfdcf9;
     display: inline-block !important;
     opacity: 1 !important;
     visibility: visible !important;
   }
   ```

5. **Notificações em Tempo Real**: O sistema responde a eventos de login/logout através de event listeners:
   ```javascript
   document.addEventListener('user:login', (event) => {
     if (event.detail && event.detail.user) {
       // Atualizar a interface com o email do usuário
     }
   });

   document.addEventListener('user:logout', () => {
     // Limpar as informações do usuário na interface
   });
   ```

Esta implementação garante que o email do usuário seja exibido em múltiplos cenários, incluindo:
- Autenticação normal via Supabase
- Restauração de sessão após reload da página
- Modo offline com dados simulados
- Recuperação de sessões anteriores via localStorage

Ao desenvolver novas funcionalidades que dependem da autenticação, utilize sempre os eventos `user:login` e `user:logout` para sincronizar com o estado de autenticação.

### Customização da Exibição do Usuário

A aparência do elemento que exibe o email do usuário pode ser personalizada através das regras CSS existentes. O elemento possui um ícone de usuário (👤) antes do email para facilitar identificação visual:

```css
.ribbon-logo .user-info:before {
  content: "👤 ";
  display: inline;
}
```

Para alterar o estilo, modifique as propriedades CSS da classe `.ribbon-logo .user-info` conforme necessário.

## Carregamento de Módulos via iFrame

Todos os módulos funcionais da aplicação são carregados via iframe, seguindo este fluxo:

1. Um botão no ribbon é clicado, disparando uma ação
2. A ação é processada pelo RibbonController que chama a função `loadModuleInIframe()`
3. A função define o atributo `src` do iframe para carregar o módulo correspondente
4. O módulo é carregado de forma isolada dentro do iframe

### Carregamento Automático de Conteúdo ao Ativar Abas

O Ribbon foi configurado para carregar automaticamente diferentes páginas no iframe `module-iframe` quando uma aba é ativada. Esse comportamento é implementado através dos seguintes componentes:

1. **Configuração de URL na aba**:
   Cada aba no arquivo `ribbon-config.js` possui uma propriedade `contentUrl` que define a URL a ser carregada:
   ```javascript
   {
     id: 'forms',
     label: 'Formulários',
     icon: 'form',
     contentUrl: '/components/modules/forms/index.html', // URL a carregar quando esta aba for ativada
     groups: [...]
   }
   ```

2. **Método utilitário para acessar a URL**:
   Um método na configuração facilita a obtenção da URL de conteúdo:
   ```javascript
   getTabContentUrl: function(tabId) {
     const tab = this.getTabById(tabId);
     return tab ? tab.contentUrl : null;
   }
   ```

3. **Carregamento no ativamento da aba**:
   O método `activateTab` no `RibbonController` carrega automaticamente o conteúdo:
   ```javascript
   activateTab(tabId) {
     this.activeTab = tabId;
     this.renderer.activateTab(tabId);
     
     // Obter a URL do conteúdo da aba
     const contentUrl = RibbonConfig.getTabContentUrl(tabId);
     
     // Carregar o conteúdo no iframe se uma URL for fornecida
     if (contentUrl && this.moduleIframe) {
       console.log(`Loading content URL for tab ${tabId}: ${contentUrl}`);
       this.moduleIframe.src = contentUrl;
     }
     
     // Notificar outros componentes sobre a mudança de aba
     const event = new CustomEvent('app:tabchange', {
       detail: { tabId }
     });
     document.dispatchEvent(event);
   }
   ```

Este fluxo permite:
- Associar cada aba a uma página/módulo específico
- Carregar automaticamente o conteúdo relevante quando o usuário muda de aba
- Manter uma experiência de usuário consistente e integrada
- Facilitar a adição de novas páginas apenas atualizando a configuração

Para adicionar uma nova aba com conteúdo associado:
1. Adicione a nova aba ao array `tabs` no arquivo `ribbon-config.js`
2. Inclua a propriedade `contentUrl` apontando para o HTML do módulo
3. Não é necessário modificar o `RibbonController`, ele usará automaticamente a configuração

### Comunicação com Módulos

A comunicação entre o Ribbon e os módulos carregados em iframes ocorre através da API `window.postMessage`:

1. **Do Ribbon para o Módulo**:
   ```javascript
   moduleIframe.contentWindow.postMessage({
     type: 'RIBBON_READY',
     payload: { 
       activeTab: activeTabId
       // outros dados relevantes
     }
   }, '*');
   ```

2. **Do Módulo para o Ribbon**:
   ```javascript
   // Dentro do módulo
   window.parent.postMessage({
     type: 'MODULE_READY',
     payload: { /* dados do módulo */ }
   }, '*');
   ```

3. **Escutando Mensagens**:
   ```javascript
   window.addEventListener('message', function(event) {
     // Processar mensagens recebidas
     const { type, payload } = event.data;
     // Agir com base no tipo e dados
   });
   ```

## Personalização e Extensão

### Adicionando uma Nova Aba
1. Edite o arquivo `config/ribbon-config.js`
2. Adicione um novo objeto na array `tabs`
3. Defina ID, rótulo e ícone
4. Crie grupos e botões para a aba

Exemplo:
```javascript
{
  id: 'nova-aba',
  label: 'Nova Aba',
  icon: 'icon-custom',
  groups: [
    {
      id: 'grupo-exemplo',
      title: 'Exemplo',
      buttons: [
        {
          id: 'botao-exemplo',
          icon: 'icon-example',
          label: 'Exemplo',
          action: 'exemploAcao'
        }
      ]
    }
  ]
}
```

### Adicionando Novos Botões
1. Localize o grupo desejado em `config/ribbon-config.js`
2. Adicione um novo objeto de botão na array `buttons` do grupo
3. Defina ID, ícone, rótulo e ação

### Adicionando um Novo Módulo
1. Crie uma página HTML completa para o módulo
2. Defina a ação no ribbon para carregar o módulo
3. Implemente a comunicação entre o ribbon e o módulo

```javascript
// No arquivo ribbon-controller.js (ou onde a ação for processada)
function handleButtonAction(buttonId, action) {
  if (action === 'loadNovoModulo') {
    loadModuleInIframe('/caminho/para/novo-modulo.html');
  }
  // ...
}
```

### Adicionando Novos Ícones
1. Crie um novo arquivo SVG na pasta `icons/svg/` com o nome `icon-[nome].svg`
2. Utilize o formato adequado para SVG (width e height definidos, viewBox configurado)
3. Referencie o ícone na configuração do botão:
   ```javascript
   {
     id: 'meu-botao',
     icon: 'icon-nome', // Referência ao arquivo icon-nome.svg
     label: 'Meu Botão',
     action: 'minhaAcao'
   }
   ```

O RibbonRenderer irá automaticamente carregar o arquivo SVG correspondente e exibi-lo como ícone do botão.

### Personalizando o Estilo do Email do Usuário
O estilo do elemento que exibe o email do usuário pode ser personalizado editando a regra CSS:

```css
.ribbon-logo .user-info {
  margin-left: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #2980b9;
  /* Adicione ou modifique propriedades conforme necessário */
}
```

## Sistema de Eventos
O módulo Ribbon utiliza eventos personalizados para comunicação interna e com outros módulos:

- `ribbon:tabchange`: Disparado quando uma aba é alterada
- `ribbon:action`: Disparado quando um botão é clicado
- `app:tabchange`: Notifica a aplicação sobre mudança de aba
- `app:action`: Notifica a aplicação sobre ações de botões
- `user:login`: Disparado quando um usuário é autenticado
- `user:logout`: Disparado quando um usuário faz logout

### Escutando Eventos (para outros módulos)
```javascript
document.addEventListener('app:tabchange', (event) => {
  const { tabId } = event.detail;
  console.log(`Tab alterada para: ${tabId}`);
});

document.addEventListener('app:action', (event) => {
  const { buttonId, action } = event.detail;
  console.log(`Botão ${buttonId} clicado, ação: ${action}`);
  // Implementar a lógica correspondente à ação
});

document.addEventListener('user:login', (event) => {
  const { user } = event.detail;
  console.log(`Usuário autenticado: ${user.email}`);
  // Atualizar a interface ou executar ações específicas
});
```

## Estilização

### Variáveis CSS
O arquivo `css/ribbon.css` define variáveis para facilitar a estilização consistente:
```css
:root {
  --ribbon-height: 145px;
  --ribbon-bg: #f5f5f5;
  --ribbon-border: #d0d0d0;
  --ribbon-hover: #e9ecef;
  --ribbon-active: #1e3c72;
  --ribbon-active-text: #fff;
  /* ... outras variáveis ... */
}
```

### Componentes Estilizáveis
- `.ribbon-container`: Container principal do ribbon
- `.ribbon-tab`: Abas do ribbon
- `.ribbon-content`: Conteúdo de cada aba
- `.ribbon-group`: Grupos de botões
- `.ribbon-button`: Botões individuais
- `.ribbon-button-icon`: Ícones dos botões (imagens SVG)
- `.module-container`: Container para iframes dos módulos
- `.user-info`: Elemento que exibe o email do usuário

## Inicialização
O Ribbon é inicializado automaticamente quando o DOM é carregado:
```javascript
// Em ribbon-controller.js
document.addEventListener('DOMContentLoaded', () => {
  window.ribbonController = new RibbonController();
});
```

## Responsividade
O Ribbon foi projetado para adaptar-se a diferentes tamanhos de tela:

- Em telas menores (< 768px), os botões são redimensionados
- O conteúdo se ajusta para melhor visualização em dispositivos móveis
- A estrutura mantém-se funcional em diferentes resoluções

## Padrões de Código

### JavaScript
- Utilizar ES6+ para novas funcionalidades
- Seguir o padrão de classe para componentes principais
- Documentar métodos e funções com comentários JSDoc
- Utilizar camelCase para nomes de variáveis e métodos

### CSS
- Manter a estrutura de variáveis CSS para customização
- Seguir a nomenclatura de classes existente
- Organizar as regras seguindo a estrutura do componente
- Utilizar unidades relativas (%, em, rem) sempre que possível

### SVG
- Manter dimensões consistentes (24x24 pixels por padrão)
- Utilizar o atributo `viewBox="0 0 24 24"` para escalabilidade
- Incluir cores através de atributos `fill` para permitir estilização via CSS
- Seguir a nomenclatura padrão: `icon-[nome].svg`

## Boas Práticas

1. **Separação de Responsabilidades**: Este módulo deve focar exclusivamente na interface gráfica, não na lógica de negócios
2. **Eventos para Comunicação**: Usar eventos customizados para comunicar-se com outros módulos
3. **Performance**: Minimizar manipulações desnecessárias do DOM
4. **Acessibilidade**: Garantir que botões e interações sejam acessíveis por teclado
5. **Consistência Visual**: Seguir os padrões visuais definidos nos arquivos CSS
6. **Otimização de Imagens**: Manter os arquivos SVG limpos e otimizados

## Estado Atual e Próximos Passos

### Implementado
- Estrutura visual completa do ribbon com abas e grupos geradas dinamicamente
- Sistema de configuração via objetos JavaScript
- Ícones SVG como arquivos individuais, não mais inline
- Ativação visual de abas
- Sistema de eventos para comunicação
- Carregamento de módulos via iframe
- Exibição do email do usuário autenticado

### Em Desenvolvimento
- Aprimoramento na acessibilidade dos componentes
- Animações mais fluidas para mudança de abas
- Melhorias na comunicação entre o ribbon e os módulos

## Migrações Recentes
- Implementação da exibição do email do usuário autenticado
- Remoção de todo o conteúdo de dashboard local em favor da abordagem via iframe
- Simplificação completa da estrutura HTML
- Remoção do HTML hardcoded para elementos do ribbon
- Implementação de geração dinâmica do ribbon a partir da configuração
- Substituição de ícones SVG inline por arquivos individuais
- Atualização do CSS para suportar imagens SVG como ícones
- Implementação de sistema de mensagens para comunicação com módulos

## Extensões Futuras
- Suporte a temas escuros e claros
- Opções de customização visual por usuário
- Melhorias na responsividade para dispositivos móveis
- Suporte completo a internacionalização (i18n) para elementos da interface

---

> **Nota**: Este documento serve como fonte de referência para o desenvolvimento do módulo Ribbon. Mantenha-o atualizado quando novas funcionalidades forem implementadas ou alterações significativas forem realizadas na interface. 