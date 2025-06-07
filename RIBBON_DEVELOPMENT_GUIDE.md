# ZMagic12 - Guia de Desenvolvimento do Componente Ribbon

## Visão Geral

O componente Ribbon é a barra de ferramentas principal da aplicação ZMagic12, proporcionando acesso a todas as funcionalidades e módulos do sistema. Este componente é altamente configurável e utiliza uma arquitetura baseada em eventos para comunicação com outros componentes da aplicação.

## Estrutura do Componente

```
public/components/ribbon/
├── config/                  # Configurações do ribbon
│   └── ribbon-config.js     # Configuração central dos tabs, grupos e botões
├── css/                     # Estilos do ribbon
│   ├── ribbon.css           # Estilos principais do ribbon
│   ├── styles.css           # Estilos globais
│   └── modal.css            # Estilos para modais
├── js/                      # Scripts do ribbon
│   ├── RibbonManager.js     # Classe principal para gerenciamento do ribbon
│   ├── ribbon-renderer.js   # Renderização da interface do ribbon
│   ├── ribbon-controller.js # Controlador de interações
│   ├── ribbon-actions.js    # Ações disparadas pelos botões
│   ├── i18n-ribbon.js       # Sistema de internacionalização
│   └── langs/               # Arquivos de idiomas
│       ├── pt-PT.js         # Português (Portugal)
│       ├── en-US.js         # Inglês (EUA)
│       ├── fr-FR.js         # Francês (França)
│       ├── es-ES.js         # Espanhol (Espanha)
│       ├── de-DE.js         # Alemão (Alemanha)
│       └── zh-CN.js         # Chinês Simplificado
└── index.html               # Página principal do ribbon
```

## Componentes Principais

### RibbonManager

Classe principal responsável por gerenciar o componente Ribbon. Suas principais responsabilidades são:

- Inicialização do componente
- Gerenciamento de estado da interface
- Carregamento de informações do usuário
- Renderização da interface baseada na configuração
- Disparo de eventos para comunicação com outros componentes

```javascript
// Exemplo de inicialização do RibbonManager
const ribbonManager = new RibbonManager();
ribbonManager.renderRibbon();
```

### Configuração (ribbon-config.js)

Define a estrutura completa do Ribbon, incluindo abas (tabs), grupos e botões. Esta configuração centralizada facilita a manutenção e extensão do componente.

```javascript
// Exemplo da estrutura de configuração
const RibbonConfig = {
  settings: {
    defaultActiveTab: 'projects',
    animationSpeed: 300,
    showGroupTitles: true
  },
  tabs: [
    {
      id: 'projects',
      label: 'Projetos',
      icon: 'folder',
      groups: [
        {
          id: 'project-actions',
          title: 'Projetos',
          buttons: [
            { 
              id: 'add-project-btn',
              icon: 'icon-add-project',
              label: 'Novo',
              action: 'createNewProject'
            }
          ]
        }
      ]
    }
  ]
};
```

### Sistema de Internacionalização

O sistema de internacionalização permite traduzir toda a interface do Ribbon para os 6 idiomas suportados pela aplicação.

#### Gerenciador de Internacionalização (i18n-ribbon.js)

Responsável por detectar o idioma atual, carregar as traduções correspondentes e atualizar a interface do Ribbon.

```javascript
// Exemplo de uso do gerenciador de internacionalização
window.ribbonI18n.setLanguage('en-US'); // Altera o idioma para inglês
```

#### Arquivos de Tradução

Cada arquivo de tradução contém um objeto com a estrutura de traduções para um idioma específico, seguindo a mesma hierarquia do `RibbonConfig`.

```javascript
// Exemplo de estrutura de tradução (pt-PT.js)
window.ribbon_pt_PT = {
  ribbon: {
    tabs: {
      projects: {
        label: "Projetos",
        groups: {
          "project-actions": {
            title: "Projetos",
            buttons: {
              "add-project-btn": {
                label: "Novo"
              }
            }
          }
        }
      }
    }
  }
};
```

## Comunicação entre Componentes

O Ribbon utiliza um sistema de eventos para comunicação com outros componentes da aplicação. Os principais eventos são:

### Eventos Disparados pelo Ribbon

- `ribbon:action`: Disparado quando um botão é clicado
- `ribbon:tab:activated`: Disparado quando uma aba é ativada
- `ribbon:translations:updated`: Disparado quando as traduções são atualizadas

### Eventos Recebidos pelo Ribbon

- `user:login`: Recebido quando um usuário faz login na aplicação
- `user:logout`: Recebido quando um usuário faz logout
- `storage`: Monitora alterações no `localStorage` para detectar mudanças de idioma
- `supabase:ready`: Recebido quando o Supabase está pronto para uso

## Integração com Outros Componentes

### Sistema de Autenticação

O Ribbon integra-se com o sistema de autenticação para exibir informações do usuário logado e permitir o logout diretamente da interface:

- Exibe o email do usuário atual
- Fornece acesso às configurações do perfil
- Implementa o botão de logout na aba "Projetos"

### Sistema de Módulos

O Ribbon carrega módulos no iframe de acordo com a aba selecionada:

- Cada aba tem uma URL associada para carregar o módulo correspondente
- A comunicação com os módulos é feita via `postMessage`
- Eventos personalizados podem ser trocados entre o Ribbon e os módulos

## Extensão do Componente

### Adição de Novas Abas

Para adicionar uma nova aba ao Ribbon:

1. Edite o arquivo `ribbon-config.js` e adicione a nova aba à array `tabs`
2. Defina o ID, label, ícone e URL do conteúdo
3. Adicione os grupos e botões necessários
4. Atualize os arquivos de tradução com as novas strings

### Adição de Novos Botões

Para adicionar um novo botão a um grupo existente:

1. Edite o arquivo `ribbon-config.js` e localize o grupo desejado
2. Adicione o novo botão à array `buttons` do grupo
3. Defina um ID único, ícone, label e ação
4. Implemente a ação correspondente no arquivo `ribbon-actions.js`
5. Atualize os arquivos de tradução com as novas strings

### Adição de Novos Idiomas

Para adicionar suporte a um novo idioma:

1. Crie um novo arquivo de tradução no formato `[idioma].js` na pasta `public/components/ribbon/js/langs/`
2. Utilize a mesma estrutura de objeto `ribbon_[idioma]` com a hierarquia de traduções
3. Adicione a nova tag `<script>` no HTML para carregar o arquivo
4. Atualize a lista de idiomas suportados no `RibbonI18nManager` (`supportedLocales`)

## Boas Práticas

1. **Centralização da Configuração**: Mantenha toda a configuração do Ribbon no arquivo `ribbon-config.js`
2. **Arquitetura Baseada em Eventos**: Use eventos customizados para comunicação entre componentes
3. **Separação de Responsabilidades**: Mantenha a lógica de negócio separada da renderização da interface
4. **Internacionalização Completa**: Traduza todas as strings visíveis ao usuário
5. **Logging Detalhado**: Utilize logs para facilitar a depuração

## Solução de Problemas

### Problemas Comuns

1. **Ribbon não carrega corretamente**:
   - Verifique se todos os arquivos JS estão sendo carregados
   - Verifique erros no console do navegador
   - Verifique se o RibbonConfig está definido corretamente

2. **Botões não funcionam**:
   - Verifique se a ação está definida corretamente no botão
   - Verifique se há um listener para o evento `ribbon:action`
   - Verifique se a função correspondente está implementada em `ribbon-actions.js`

3. **Traduções não são aplicadas**:
   - Verifique se o arquivo de idioma está sendo carregado
   - Verifique se a estrutura do objeto de tradução segue a mesma hierarquia do RibbonConfig
   - Verifique se o idioma está definido corretamente no `localStorage`

## Estado Atual e Implementações Futuras

### Implementado

- Estrutura básica do Ribbon
- Sistema de configuração centralizada
- Renderização dinâmica baseada na configuração
- Sistema de eventos para comunicação
- Integração com sistema de autenticação
- Sistema completo de internacionalização com suporte a 6 idiomas

### Planejado para Futuras Versões

- Temas personalizáveis
- Persistência de estado do Ribbon (abas abertas, configurações)
- Customização de botões por usuário
- Atalhos de teclado para ações comuns
- Modo responsivo para dispositivos móveis 