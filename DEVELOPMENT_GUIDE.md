# ZMagic12 - Guia de Desenvolvimento

## Visão Geral
ZMagic12 é uma plataforma modular para criação e gestão de aplicações de baixo código, formulários e macros. A aplicação é estruturada em componentes independentes que se comunicam através de eventos, permitindo uma arquitetura flexível e escalável.

## Estrutura do Projeto
```
ZMagic12/
├── core/                    # Componentes centrais
│   ├── api/                 # Integrações com APIs externas
│   ├── auth/                # Sistema de autenticação
├── public/                  # Arquivos públicos e componentes
│   ├── main/                # Arquivos principais da aplicação
│   │   ├── css/             # Estilos CSS
│   │   ├── images/          # Imagens e recursos visuais
│   │   ├── js/              # Scripts JavaScript
│   │   │   ├── langs/       # Arquivos de idiomas
│   │   ├── modules/         # Módulos da aplicação
│   │   │   ├── documentation/ # Sistema de documentação
│   │   │   ├── marketplace/   # Sistema de marketplace
│   ├── components/          # Componentes modulares
├── config/                  # Configurações globais
```

## Stack Tecnológica
- **Frontend**: JavaScript puro (Vanilla JS)
- **Estilização**: CSS com variáveis para temas consistentes
- **Backend**: Supabase (planejado)
- **Persistência**: LocalStorage (atual), PostgreSQL via Supabase (planejado)
- **Autenticação**: Sistema próprio (atual), Supabase Auth (planejado)

## Sistema de Internacionalização (i18n)

Padrão unificado para todos os módulos:
1. **Estrutura de Pastas**:
   ```
   /js/langs/
     pt-PT.js
     en-US.js
     fr-FR.js
     es-ES.js
     de-DE.js
     zh-CN.js
   ```

2. **Sincronização**:
   - Todos os módulos escutam mudanças no localStorage ('locale')
   - Evento 'languageChanged' é disparado globalmente

3. **Chaves de Tradução**:
   - Formato: "módulo.seção.chave" (ex: "dashboard.header.new_project")
   - Devem existir em todos os arquivos de idioma

### Implementação
- Gerenciado pelo arquivo `public/main/js/i18n.js`
- Arquivos de idioma em `public/main/js/langs/`
- As traduções são armazenadas em variáveis globais nomeadas segundo o padrão `window.pt_PT`, `window.en_US`, etc.
- A preferência de idioma é salva no `localStorage` sob a chave 'locale'
- Os elementos HTML usam o atributo `data-i18n` para serem traduzidos dinamicamente
- Para atributos HTML, usa-se `data-i18n-attr="attr1:key1,attr2:key2"` onde:
  - `attr1`, `attr2` são os nomes dos atributos (ex: placeholder, title, alt)
  - `key1`, `key2` são as chaves de tradução (ex: documentation.search_placeholder)

### Integração entre Sistemas
- O sistema de autenticação (em `core/auth/`) utiliza a mesma preferência de idioma definida na página principal
- A chave de armazenamento 'locale' é compartilhada entre todos os módulos da aplicação
- Isso garante uma experiência consistente para o usuário, mantendo o idioma selecionado em todas as páginas

### Caminhos de Arquivos
- O sistema detecta automaticamente a localização atual (raiz ou subpasta) e ajusta os caminhos dos arquivos de idioma
- Para páginas na raiz: `public/main/js/langs/[idioma].js`
- Para páginas na subpasta documentation: `../js/langs/[idioma].js`
- Para garantir compatibilidade, arquivos de idioma são duplicados na pasta `public/main/documentation/js/langs/`

### Implementação em Módulos
- Módulos na estrutura `public/main/modules/` devem implementar seu próprio sistema de i18n
- Abordagem recomendada para novos módulos:
  1. Criar arquivos de idioma no diretório `js/langs/` do módulo
  2. Carregar os arquivos diretamente via tags `<script>` no HTML do módulo
  3. Implementar uma versão específica do gerenciador de i18n (ver `i18n-marketplace.js` como exemplo)
  4. Manter compatibilidade com o sistema principal usando a mesma estrutura de chaves
  5. Utilizar o mesmo valor de localStorage ('locale') para garantir consistência entre módulos
  6. Implementar mecanismos de fallback para maior robustez
- Esta abordagem evita problemas de caminhos de arquivos e proporciona independência entre módulos

### Como Adicionar Novas Traduções
1. Adicione novas chaves nos arquivos de idioma existentes
2. Mantenha a mesma estrutura hierárquica em todos os arquivos
3. Use o formato "section.key" nos atributos data-i18n
4. Para novos idiomas, replique os arquivos na pasta documentation

## Componentes Principais

### Página Inicial (index.html)
- Apresentação da plataforma ZMagic12
- Selector de idiomas
- Links para as diferentes seções
- Seções principais:
  - **Hero**: Introdução à plataforma
  - **Features**: Recursos principais da plataforma
  - **Pricing**: Planos e preços (mensal: 10€, anual: 100€)
  - **Footer**: Informações de contato e links úteis

### Sistema de Documentação
- Estruturado como um módulo em `public/main/modules/documentation/index.html`
- Navegação intuitiva com menu lateral e seções organizadas
- Suporte completo a múltiplos idiomas através do sistema i18n
- Sistema de internacionalização próprio:
  - Implementado em `public/main/modules/documentation/js/i18n-documentation.js`
  - Carrega os arquivos de idioma diretamente via tags `<script>` no HTML
  - Funciona independentemente do sistema i18n principal, sem referências cruzadas
  - Mantém a mesma estrutura e funcionalidade do sistema principal
  - Resolve problemas de caminho que ocorriam com a implementação anterior
  - Inclui mecanismos de fallback para maior robustez
- Categorias principais:
  - **Primeiros Passos**: Introdução, instalação e guias rápidos
  - **Componentes**: Detalhes sobre Form Builder, Macro Code e Low Code
  - **Tutoriais**: Instruções passo a passo para criar formulários e macros
  - **Recursos**: FAQs e downloads
- Recursos de mídia suportados:
  - Imagens ilustrativas
  - Vídeos tutoriais (via placeholders)
  - Downloads de documentação em PDF
- **Importante**: Os caminhos para recursos e arquivos JS são ajustados dinamicamente 
  com base na localização atual (raiz vs. subpasta), permitindo que o sistema de 
  internacionalização funcione corretamente em todas as páginas

### Sistema de Preços
- Dois planos disponíveis:
  - **Plano Mensal**: 10€ por mês
  - **Plano Anual**: 100€ por ano (economia de 20€)
- Cada plano inclui:
  - Acesso a todos os módulos
  - Projetos ilimitados
  - Suporte da comunidade
  - Atualizações regulares
- O plano anual oferece adicionalmente:
  - Suporte prioritário
  - Destaque como "MAIS POPULAR"

### Sistema de Autenticação
O sistema de autenticação foi implementado com suporte completo a 6 idiomas, armazenamento seguro de credenciais, funcionamento offline e integração com Supabase.

#### Principais arquivos:
- `core/auth/css/auth.css`: Estilos para os formulários de autenticação
- `core/auth/js/auth.js`: Lógica principal de autenticação (login, registro, recuperação de senha)
- `core/auth/js/i18n-auth.js`: Sistema de internacionalização específico para autenticação
- `core/auth/js/langs/*.js`: Arquivos de idioma para autenticação (pt-PT, en-US, fr-FR, es-ES, de-DE, zh-CN)
- `core/auth/*.html`: Páginas de autenticação (login, registro, recuperação de senha, perfil)

#### Características principais:
1. **Armazenamento seguro**: Utiliza criptografia AES para armazenar dados sensíveis no localStorage
2. **Internacionalização completa**: Suporte a 6 idiomas em todos os formulários e no perfil do usuário
3. **Compartilhamento de preferências**: Utiliza a mesma preferência de idioma definida na página principal
4. **Funcionamento offline**: Capaz de autenticar usuários sem conexão com a internet
5. **Design responsivo**: Adapta-se a diferentes tamanhos de tela
6. **Integração com Supabase**: Utiliza o Supabase para autenticação quando online
7. **Armazenamento de sessão**: Gerencia o estado de login do usuário entre páginas
8. **Recuperação de senha**: Sistema completo de recuperação de senha
9. **Detecção de sessão ativa**: Interface melhorada para usuários já autenticados, permitindo continuar ou encerrar sessão
10. **Perfil de usuário internacionalizado**: Página de perfil com interface traduzida nos 6 idiomas suportados

#### Testando o sistema de autenticação:
1. **Modo Online**:
   - Requer acesso ao Supabase
   - Funcionalidades completas: registro, login, recuperação de senha, gestão de perfil
   - Dados são sincronizados com o servidor
   - O idioma é configurado automaticamente com base na preferência definida na página principal
   - Se o usuário já estiver autenticado, mostra interface específica com opções para continuar ou encerrar sessão

2. **Modo Offline**:
   - Ativado automaticamente quando não há conexão com a internet
   - Utiliza credenciais armazenadas localmente
   - Credenciais padrão: `teste@mail.com` / `senha123`
   - Funcionalidades limitadas (não permite registro de novos usuários)
   - Mantém a mesma preferência de idioma da página principal
   - Se o usuário já estiver autenticado offline, mostra a mesma interface de usuário já logado

3. **Mudança de idioma**:
   - O idioma deve ser selecionado na página principal
   - A preferência é armazenada no localStorage e compartilhada por toda a aplicação
   - As páginas de autenticação e perfil adotam automaticamente o idioma definido
   - Elementos com atributos `data-i18n` são traduzidos dinamicamente quando o idioma é alterado
   - Todas as páginas, incluindo o perfil, seguem o mesmo padrão de nomenclatura para as chaves de tradução

4. **Verificação de sessão**:
   - A sessão expira após 12 horas (configurável)
   - Para fins de teste, a configuração atual permite sessões mais longas no modo offline
   - Ao acessar a página de login com sessão ativa, o usuário visualiza seu email e opções para continuar com a sessão atual ou fazer logout

## Padrões de Código

### JavaScript
- Use camelCase para nomes de variáveis e funções
- Organize o código em classes para componentes principais
- Use comentários para documentar funcionalidades complexas
- Carregue arquivos JS no final do body sempre que possível

### CSS
- Use variáveis CSS para cores e valores recorrentes
- Organize estilos por componente
- Siga uma estrutura consistente (layout, aparência, estados)

### HTML
- Use tags semânticas
- Utilize o atributo data-i18n para textos que precisam de tradução
- Mantenha a indentação consistente (2 espaços)

## Estado Atual e Histórico de Desenvolvimento

### Versão Atual: 0.1.20

#### Implementado
- Estrutura básica do projeto
- Sistema de internacionalização (i18n) com suporte a 6 idiomas
- Página inicial com apresentação da plataforma
- Layout responsivo básico
- Sistema de preços com planos mensal e anual
- Sistema de documentação com suporte a múltiplos idiomas e recursos multimídia
- Correções de caminhos e carregamento de recursos para garantir compatibilidade em subpastas
- Melhorias no sistema i18n com detecção automática de localização e suporte a atributos HTML
- Implementação completa de todos os 6 idiomas (pt-PT, en-US, fr-FR, es-ES, de-DE, zh-CN) na área de documentação
- Reorganização da estrutura de pastas (imagens movidas para public/main/images)
- Sistema completo de autenticação com formulários de login, registro e recuperação de senha
- Suporte a 6 idiomas em todas as páginas de autenticação
- Armazenamento seguro de credenciais no localStorage
- Integração das preferências de idioma entre todos os sistemas (o idioma selecionado na página principal é usado em toda a aplicação)
- Remoção de seletores de idioma duplicados nas páginas de autenticação
- Simplificação da página de login com remoção do modo de teste, mantendo a detecção automática de conectividade
- Melhoria na experiência de login para usuários já autenticados, com interface dedicada que mostra o email do usuário e oferece opções para continuar com a sessão ou fazer logout
- Adição de funcionalidade de "voltar ao topo" no logo do cabeçalho, permitindo que usuários retornem ao topo da página com um clique
- Simplificação da navegação com a remoção do botão "Acessar Plataforma" do menu principal e da página de documentação
- Reorganização de módulos em estrutura padronizada com a pasta `modules/` contendo:
  - Sistema de documentação em `modules/documentation/`
  - Sistema de marketplace em `modules/marketplace/`
- Preparação do módulo marketplace com estrutura inicial e suporte a internacionalização:
  - Interface inicial com mensagem "em breve" e introdução ao marketplace
  - Arquivos de tradução completos em 6 idiomas (pt-PT, en-US, fr-FR, es-ES, de-DE, zh-CN)
  - Campo de busca e elementos básicos de UI preparados para expansão futura
  - Integração completa com o sistema i18n existente
- Implementação de um sistema de internacionalização dedicado para o módulo Marketplace:
  - Criação do arquivo `i18n-marketplace.js` específico para o módulo
  - Carregamento direto dos arquivos de idioma no HTML, evitando problemas de caminho
  - Gestão independente de traduções, mantendo compatibilidade com o sistema principal
  - Correção de problemas de carregamento de arquivos de idioma em subdiretórios
- Implementação de um sistema de internacionalização dedicado para o módulo Documentação:
  - Criação do arquivo `i18n-documentation.js` específico para o módulo
  - Carregamento direto dos arquivos de idioma no HTML, evitando problemas de caminho 404
  - Gestão independente de traduções, mantendo compatibilidade com o sistema principal
  - Resolução de erros relacionados a caminhos incorretos de arquivos de idioma
  - Implementação de mecanismos de fallback para garantir robustez mesmo em caso de falhas no carregamento
- Padronização da estrutura dos cabeçalhos em todas as páginas:
  - Uniformização do formato do cabeçalho entre a página principal, documentação e marketplace
  - Resolução de inconsistências visuais na transição entre páginas
  - Adição do atributo `title="Voltar ao topo"` ao logo em todas as páginas
  - Preservação das classes `active` para indicação da página atual
  - Manutenção dos caminhos relativos corretos para cada contexto de página
- Correções de bugs e melhorias no sistema de internacionalização:
  - Remoção de dependências do sistema global i18n nos módulos documentation e marketplace
  - Correção de referências incorretas a objetos não definidos
  - Atualização de caminhos para arquivos de recursos (favicon, imagens)
  - Simplificação do código para melhor manutenção
  - Implementação de mecanismo de fallback para garantir funcionamento mesmo se o carregamento de scripts falhar
  - Melhoria da robustez geral do sistema de tradução

#### Em Desenvolvimento
- Sistema de autenticação
- Dashboard de usuário
- Gerenciamento de projetos
- Marketplace completo com listagem de produtos, categorias e sistema de pagamento

## IMPORTANTE: Preservação do Estado Atual
O estado atual da aplicação deve ser mantido intacto nas fases seguintes de desenvolvimento. As seguintes diretrizes devem ser observadas:

1. **Não modificar estruturas existentes**: A organização atual de arquivos e pastas deve ser preservada
2. **Preservar sistemas de internacionalização**: Os sistemas i18n implementados para cada módulo não devem ser alterados
3. **Manter consistência visual**: Os elementos de UI e estilos existentes devem ser respeitados em futuros desenvolvimentos
4. **Desenvolvimento incremental**: Novos recursos devem ser adicionados como extensões dos módulos existentes, sem modificar o que já está implementado
5. **Documentação**: Qualquer alteração futura deve ser documentada neste guia com justificativa clara

Estas diretrizes garantem a estabilidade da plataforma e a compatibilidade com os recursos já implementados. Quaisquer alterações nas estruturas ou sistemas existentes devem ser explicitamente solicitadas e aprovadas antes da implementação.

## Banco de Dados (Planejado)
- **Provedor**: Supabase
- **Tabelas Principais**:
  - users: Informações dos usuários
  - projects: Projetos criados pelos usuários
  - templates: Templates disponíveis para projetos
  - forms: Formulários criados
  - macros: Macros desenvolvidas
  - subscriptions: Assinaturas e planos dos usuários

## Como Contribuir para este Guia
Este guia deve ser atualizado sempre que houver:
1. Novos recursos ou componentes
2. Alterações na estrutura do projeto
3. Mudanças nos padrões de código
4. Integrações com novos serviços
5. Implementação de novas funcionalidades

> **Nota**: Este documento serve como fonte única de verdade para o desenvolvimento do ZMagic12. Mantenha-o atualizado para garantir a consistência e qualidade do código. 

### Sistema de Marketplace
- Estruturado como um módulo em `public/main/modules/marketplace/index.html`
- Contém uma página inicial com a mensagem "em breve" e recursos básicos de UI
- Suporte completo a múltiplos idiomas através do sistema i18n
- Sistema de internacionalização próprio:
  - Implementado em `public/main/modules/marketplace/js/i18n-marketplace.js`
  - Carrega os arquivos de idioma diretamente via tags `<script>` no HTML
  - Funciona independentemente do sistema i18n principal, sem referências cruzadas
  - Mantém a mesma estrutura e funcionalidade do sistema principal
  - Resolve problemas de caminho que ocorriam com a implementação anterior
- Componentes principais:
  - **Interface de Busca**: Campo de pesquisa e botão para futura implementação
  - **Mensagem Introdutória**: Explicação sobre o propósito do marketplace
  - **Layout Responsivo**: Design que se adapta a diferentes tamanhos de tela
- O módulo marketplace está preparado para funcionar como um espaço dedicado à venda de projetos desenvolvidos pelos usuários
- Quando completamente implementado, permitirá:
  - Listagem e venda de formulários customizados
  - Macros desenvolvidas pelos usuários
  - Templates e soluções completas
  - Sistema de categorização e filtros
  - Mecanismo de busca por palavras-chave 

### Sistema de Integração Ribbon-Login

A plataforma implementa um sistema de integração entre a Ribbon (barra de ferramentas superior) e o sistema de autenticação, permitindo o logout diretamente pela interface principal.

#### Estrutura de Comunicação

- **Botão de Logout na Ribbon**:
  - Definido em `public/components/ribbon/config/ribbon-config.js` com a ação `exitAccount`
  - Visualmente acessível no grupo "Account" da aba "Projetos"
  - Dispara a ação sem necessidade de redirecionamento para página de login

- **Sistema de Ações da Ribbon**:
  - Implementado em `public/components/ribbon/js/ribbon-actions.js`
  - Gerencia a execução de ações específicas dos botões da Ribbon
  - Utiliza um padrão event-listener para capturar e processar ações solicitadas
  - Manipula a ação `exitAccount` para executar o logout de forma segura

#### Fluxo de Logout

1. **Disparo da Ação**:
   - Usuário clica no botão "Logout" na Ribbon
   - O evento `ribbon:action` é disparado com a ação `exitAccount`
   - A classe `RibbonActions` captura este evento e executa o método correspondente

2. **Processamento do Logout**:
   - A função `exitAccount()` verifica a disponibilidade do `AuthManager`
   - Se disponível, executa `AuthManager.logout()` que realiza as seguintes operações:
     - Chama `supabaseClient.auth.signOut()` para encerrar a sessão no Supabase
     - Limpa os dados de autenticação armazenados localmente
   - Em caso de erro ou indisponibilidade do `AuthManager`, executa um fallback:
     - Remove manualmente as chaves relevantes do `localStorage`
     - Força o redirecionamento para a página de login

3. **Redirecionamento**:
   - Após o logout bem-sucedido, redireciona o usuário para `/core/auth/login.html`
   - A página de login detecta que não há sessão ativa e exibe o formulário de login

#### Implementação de Segurança

- **Limpeza de Dados**: Garante a remoção completa de tokens e dados do usuário
- **Tratamento de Erros**: Implementa fallbacks para situações onde o AuthManager não está disponível
- **Logging Detalhado**: Registra cada etapa do processo para facilitar a depuração
- **Feedback Visual**: Alerta o usuário em caso de erros no processo de logout

#### Extensão do Sistema

Para adicionar novas ações à Ribbon:

1. Defina o botão com a propriedade `action` em `ribbon-config.js`
2. Adicione um novo caso no switch da função `handleAction()` em `ribbon-actions.js`
3. Implemente a função correspondente na classe `RibbonActions`

Este sistema de integração garante uma experiência fluida para o usuário, permitindo o gerenciamento da sessão diretamente pela interface principal da aplicação sem necessidade de navegar para páginas específicas de autenticação.

### Sistema de Internacionalização do Ribbon

O componente Ribbon implementa um sistema de internacionalização completo que permite traduzir toda a interface para os 6 idiomas suportados pela aplicação. Este sistema segue o mesmo padrão implementado nos outros módulos, utilizando a preferência de idioma armazenada no `localStorage` e arquivos de tradução específicos.

#### Arquivos Principais

- **Sistema de Gerenciamento de Idiomas**:
  - `public/components/ribbon/js/i18n-ribbon.js`: Gerenciador de internacionalização específico para o Ribbon

- **Arquivos de Tradução**:
  - `public/components/ribbon/js/langs/pt-PT.js`: Português (Portugal)
  - `public/components/ribbon/js/langs/en-US.js`: Inglês (EUA)
  - `public/components/ribbon/js/langs/fr-FR.js`: Francês (França)
  - `public/components/ribbon/js/langs/es-ES.js`: Espanhol (Espanha)
  - `public/components/ribbon/js/langs/de-DE.js`: Alemão (Alemanha)
  - `public/components/ribbon/js/langs/zh-CN.js`: Chinês Simplificado

#### Funcionamento do Sistema

1. **Inicialização**:
   - Na inicialização, o sistema detecta o idioma atual no `localStorage` (chave 'locale')
   - Caso não encontre, utiliza o idioma padrão 'pt-PT'
   - Carrega os arquivos de tradução correspondentes via tags `<script>` no HTML

2. **Atualização da Interface**:
   - Os textos do Ribbon são atualizados automaticamente quando o idioma é alterado
   - A estrutura de tradução segue a mesma hierarquia do `RibbonConfig`
   - As traduções são aplicadas a abas, grupos e botões

3. **Sincronização com Outros Módulos**:
   - Qualquer alteração de idioma em outras partes da aplicação é detectada
   - Um listener do evento `storage` monitora alterações na chave 'locale'
   - Quando detectada uma alteração, o sistema atualiza automaticamente a interface

4. **Implementação**:
   - Integrado com o `RibbonManager`, que inclui um método `renderRibbon()` para atualizar a interface
   - Eventos customizados (`ribbon:translations:updated`) são disparados após a aplicação das traduções
   - Sistema de fallback utiliza textos padrão caso as traduções não sejam encontradas

#### Extensão do Sistema

Para adicionar suporte a novos idiomas:

1. Crie um novo arquivo de tradução no formato `[idioma].js` na pasta `public/components/ribbon/js/langs/`
2. Utilize a mesma estrutura de objeto `ribbon_[idioma]` com a hierarquia de traduções
3. Adicione a nova tag `<script>` no HTML para carregar o arquivo
4. Atualize a lista de idiomas suportados no `RibbonI18nManager` (`supportedLocales`)

Este sistema garante que a interface do Ribbon se mantenha consistente com o restante da aplicação quando o usuário altera o idioma, sem necessidade de recarregar a página ou reiniciar a aplicação.

### Sistema de Dashboard
- Estruturado como um módulo em `public/components/modules/dashboard/index.html`
- Fornece uma interface para gerenciamento de projetos, templates e projetos arquivados
- Apresenta uma visualização em grid dos projetos do usuário
- Permite criar, editar, arquivar, excluir e usar projetos como templates
- Interface responsiva que se adapta a diferentes tamanhos de tela
- Sistema de internacionalização completo suportando 6 idiomas:
  - Implementado em `public/components/modules/dashboard/js/i18n-dashboard.js`
  - Carrega os arquivos de idioma diretamente via tags `<script>` no HTML
  - Funciona independentemente do sistema i18n principal, sem referências cruzadas
  - Mantém a mesma estrutura e funcionalidade do sistema principal
  - Solução de problemas de caminho que ocorriam com a implementação anterior
  - Suporte especial para tradução de elementos gerados dinamicamente via JavaScript
- Recursos principais:
  - Visualização em grid de projetos com imagens e descrições
  - Ações rápidas para cada projeto (editar, arquivar, excluir, etc.)
  - Modal de criação de novo projeto
  - Funcionalidade de edição de projetos existentes
  - Sistema de tabs para organizar projetos ativos, arquivados e templates