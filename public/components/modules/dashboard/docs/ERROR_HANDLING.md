# Sistema de Tratamento de Erros - Dashboard

Este documento descreve o sistema centralizado de tratamento de erros do Dashboard, implementado através da classe `ErrorHandler`.

## 📋 Visão Geral

O sistema de tratamento de erros foi projetado para:

1. **Centralizar** o tratamento de erros em um único local
2. **Categorizar** erros em tipos específicos
3. **Padronizar** mensagens de erro por categoria
4. **Simplificar** o tratamento de erros em toda a aplicação
5. **Melhorar** a experiência do usuário com mensagens amigáveis

## 🔍 Categorias de Erro

O sistema classifica os erros em seis categorias principais:

| Categoria | Descrição | Exemplo |
|-----------|-----------|---------|
| `AUTH` | Erros de autenticação | Credenciais inválidas, sessão expirada |
| `DATABASE` | Erros de banco de dados | Falha na consulta, violação de constraints |
| `NETWORK` | Erros de rede | Falha na conexão, timeout |
| `VALIDATION` | Erros de validação | Dados inválidos, campos obrigatórios |
| `PERMISSION` | Erros de permissão | Acesso negado, permissões insuficientes |
| `UNKNOWN` | Erros desconhecidos | Qualquer erro não categorizado |

## 🛠️ Como Usar

### Importando o ErrorHandler

```javascript
import errorHandler from '../utils/ErrorHandler.js';
```

### Tratando Erros em Blocos Try/Catch

```javascript
try {
    // Código que pode gerar um erro
    await this.projectManager.createProject(projectData);
} catch (error) {
    // Usar o ErrorHandler para tratar o erro
    const errorInfo = errorHandler.handleError(error);
    
    // Exibir mensagem para o usuário
    this.uiManager.showError(errorInfo.message, errorInfo.i18n);
}
```

### Especificando Subtipos de Erro

Para erros mais específicos dentro de uma categoria:

```javascript
try {
    // Tentar carregar um projeto
    const project = await this.projectManager.getProjectById(id);
} catch (error) {
    // Especificar um subtipo de erro de banco de dados (notFound)
    const errorInfo = errorHandler.handleError(error, { subtype: 'notFound' });
    this.uiManager.showError(errorInfo.message, errorInfo.i18n);
}
```

## 📊 Códigos de Erro Específicos

O sistema mapeia automaticamente vários códigos de erro conhecidos para categorias apropriadas:

### Supabase - Autenticação
- `PGRST301`, `PGRST302`: Erros de autenticação
- `invalid_grant`, `invalid_credentials`: Problemas com credenciais
- `email_not_confirmed`, `user_not_found`: Problemas com conta

### Supabase - Banco de Dados
- `PGRST401`, `PGRST402`, `PGRST403`: Erros de consulta
- `23505`: Violação de unicidade
- `22P02`: Representação de texto inválida

### Outros
- `failed_fetch`, `network_error`, `timeout`: Problemas de rede
- `insufficient_permissions`, `not_authorized`: Problemas de permissão

## 🔄 Migração de Código Existente

Ao converter código existente para usar o novo sistema:

1. Substitua usos diretos de `console.error` e mensagens hardcoded
2. Migre mensagens de erro de `SupabaseConfig` e outros componentes
3. Utilize `errorHandler.handleError()` para obter mensagens consistentes
4. Aproveite as chaves i18n para internacionalização

### Exemplo de Migração

**Antes:**
```javascript
try {
    await this.supabase.from('projects').insert(projectData);
} catch (error) {
    console.error('Erro ao criar projeto:', error);
    this.uiManager.showError('Erro ao criar projeto. Por favor, tente novamente.');
}
```

**Depois:**
```javascript
try {
    await this.supabase.from('projects').insert(projectData);
} catch (error) {
    const errorInfo = errorHandler.handleError(error);
    this.uiManager.showError(errorInfo.message, errorInfo.i18n);
}
```

## 🚀 Benefícios

- **Consistência**: Mensagens de erro padronizadas em toda a aplicação
- **Manutenção**: Um único ponto para atualizar mensagens de erro
- **Internacionalização**: Suporte incorporado para i18n
- **Depuração**: Registro melhorado de erros no console
- **UX**: Mensagens mais amigáveis e contextuais para os usuários 