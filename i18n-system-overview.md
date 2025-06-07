# Sistema de Internacionalização (i18n) do ZMagic12

## Visão Geral da Arquitetura

O ZMagic12 implementa um sistema de internacionalização abrangente baseado em uma arquitetura modular que permite a tradução consistente em diferentes partes da aplicação. A arquitetura é composta por:

1. **Classe Base (SharedI18n)**: Implementa as funcionalidades comuns a todos os gerenciadores de tradução
2. **Gerenciadores Específicos**: Cada módulo possui um gerenciador especializado que estende a classe base
3. **Arquivos de Idioma**: Contêm as traduções para cada idioma suportado
4. **Preferência Compartilhada**: Todos os módulos usam a mesma chave `locale` no localStorage

### Idiomas Suportados

A aplicação suporta os seguintes idiomas:
- 🇵🇹 Português (Portugal) - `pt-PT` (padrão)
- 🇺🇸 Inglês (EUA) - `en-US`
- 🇫🇷 Francês (França) - `fr-FR`
- 🇪🇸 Espanhol (Espanha) - `es-ES`
- 🇩🇪 Alemão (Alemanha) - `de-DE`
- 🇨🇳 Chinês Simplificado - `zh-CN`

## Implementação Base (SharedI18n)

A classe `SharedI18n` (`public/components/shared/js/SharedI18n.js`) serve como base para todos os gerenciadores de tradução e implementa:

- Carregamento dinâmico de arquivos de idioma
- Gerenciamento de cache de traduções
- Tradução de elementos no DOM
- Detecção de mudanças de idioma via localStorage
- Métodos para tradução de texto e atributos

### Principais Métodos

- `init()`: Inicializa o sistema
- `loadTranslations(localeCode)`: Carrega as traduções para um idioma específico
- `updateUI()`: Atualiza todos os elementos da interface com as traduções
- `translate(key)`: Traduz uma chave específica
- `setLanguage(locale)`: Altera o idioma atual
- `translateElement(element)`: Traduz um elemento individual

## Gerenciadores Específicos de Módulos

### 1. Sistema de Autenticação (i18n-auth.js)

O sistema de autenticação implementa um gerenciador próprio em `core/auth/js/i18n-auth.js` com as seguintes características:

- Função auto-executável (padrão antigo)
- Expõe a API via `window.Auth_I18n`
- Usa o prefixo `auth_` para as variáveis globais (`window.auth_pt_PT`, etc.)
- Inclui métodos especializados para a autenticação

```javascript
// Exposição da API
window.Auth_I18n = {
    init,
    setLanguage,
    getCurrentLanguage,
    translate,
    translateElements
};
```

### 2. Sistema do Dashboard (DashboardI18nManager)

O Dashboard utiliza um gerenciador moderno em `public/components/modules/dashboard/js/i18n-dashboard.js` que:

- Estende a classe `SharedI18n` via ES6 imports
- Está implementado como uma classe moderna
- Expõe a API via `window.dashboardI18n`
- Sobrescreve o nome do evento para `dashboard:translations:updated`

```javascript
import SharedI18n from '../../../shared/js/SharedI18n.js';

class DashboardI18nManager extends SharedI18n {
    // Implementação...
}

export default dashboardI18n;
window.dashboardI18n = dashboardI18n;
```

## Estrutura dos Arquivos de Idioma

### Formato de Arquivo

Cada módulo possui seus próprios arquivos de idioma com uma estrutura hierárquica:

```javascript
// Exemplo: core/auth/js/langs/pt-PT.js
if (typeof window.auth_pt_PT === "undefined") {
    window.auth_pt_PT = {
        // Dados gerais
        app: {
            name: "ZeMagic",
            language: "Português",
            languageCode: "pt-PT"
        },
        
        // Seções específicas
        login: {
            title: "Entrar no Sistema",
            subtitle: "Acesse sua conta para continuar",
            // Mais traduções...
        },
        
        // Outras seções...
    };
}
```

### Nomenclatura de Variáveis

Cada módulo usa um prefixo específico para suas variáveis globais de idioma:
- Autenticação: `auth_[locale]` (ex: `window.auth_pt_PT`)
- Dashboard: `dashboard_[locale]` (ex: `window.dashboard_pt_PT`)
- Ribbon: `ribbon_[locale]` (ex: `window.ribbon_pt_PT`)

## Integração entre Módulos

### Compartilhamento de Preferências

Todos os módulos utilizam a mesma chave no localStorage para armazenar a preferência de idioma:

```javascript
// Todos os módulos usam esta mesma chave
localStorage.setItem('locale', selectedLanguage);
```

### Detecção de Mudanças

Quando um módulo altera o idioma, os outros detectam a mudança através de:

1. **Listener de Storage**: Detecta mudanças na chave 'locale' do localStorage
2. **Eventos Customizados**: Cada módulo dispara eventos específicos após atualizar suas traduções

```javascript
// No sistema do Dashboard
document.dispatchEvent(new CustomEvent('dashboard:translations:updated', { 
    detail: { locale: localeCode } 
}));

// No sistema de autenticação
document.dispatchEvent(new CustomEvent('auth:languageChanged', {
    detail: { language }
}));
```

## Uso no HTML

### Elementos Estáticos

```html
<!-- Exemplo de login.html -->
<label for="email" data-i18n="login.email_label">Email</label>
<input type="email" id="email" required>
<button type="submit" data-i18n="login.submit_button">Entrar</button>
```

### Atributos

```html
<!-- Tradução de atributos -->
<input placeholder="Digite seu email" data-i18n-attr="placeholder:login.email_placeholder">
```

### Elementos Dinâmicos

```javascript
// Criando elementos com traduções em JavaScript
const errorMessage = document.createElement('p');
errorMessage.textContent = window.dashboardI18n.translate('errors.login_failed');
container.appendChild(errorMessage);
```

## Fluxo de Inicialização

1. A página carrega e inclui o script de i18n do módulo
2. O sistema de i18n detecta o idioma atual do localStorage (ou usa o padrão)
3. Os arquivos de idioma necessários são carregados
4. Os elementos com atributos `data-i18n` são traduzidos
5. Eventos de atualização são disparados para notificar outros componentes

### Exemplo: Inicialização do Dashboard

```javascript
// Em index.html
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o dashboard
    const dashboard = new DashboardModule();
    window.dashboardInstance = dashboard;
    dashboard.init();
    
    // Garantir que as traduções sejam aplicadas
    if (window.dashboardI18n) {
        window.dashboardI18n.updateUI();
    }
});
```

## Considerações de Segurança e Performance

1. **Carregamento Condicional**: Arquivos de idioma são carregados apenas quando necessários
2. **Verificação de Redefinição**: Todos os arquivos verificam se a variável global já existe antes de redefini-la
3. **Cache de Traduções**: As traduções são armazenadas em memória para acesso rápido
4. **Fallback**: Se um idioma não for encontrado, o sistema usa o idioma padrão (pt-PT)
5. **Controle de Carregamentos Paralelos**: Evita carregar o mesmo arquivo múltiplas vezes

## Conclusão

O sistema de internacionalização do ZMagic12 é uma implementação completa e robusta que:

1. Permite a tradução consistente em diferentes módulos
2. Suporta múltiplos idiomas com uma estrutura comum
3. Sincroniza as preferências de idioma entre módulos
4. Oferece métodos flexíveis para tradução de elementos estáticos e dinâmicos
5. Segue boas práticas de desenvolvimento com uma arquitetura orientada a objetos

Este design modular facilita a manutenção e extensão do sistema para futuros módulos e idiomas adicionais. 