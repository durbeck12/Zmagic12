# Plano de Migração para ES Modules - Dashboard

Este documento descreve a estratégia para completar a migração do código do Dashboard para ES Modules, resolvendo problemas existentes e garantindo consistência em todo o módulo.

## 📋 Estado Atual

O módulo Dashboard utiliza uma mistura de:
- ES Modules com `import`/`export` (abordagem moderna e preferida)
- Variáveis globais via `window` (abordagem legada)
- Scripts carregados como módulos, mas que criam variáveis globais

Esta inconsistência causa problemas:
- Dependências circulares
- Variáveis não disponíveis no momento esperado
- Comportamento inconsistente entre ambientes de desenvolvimento e produção
- Problemas de carregamento em templates e iframe

## 🎯 Objetivos

1. Padronizar todo o código do Dashboard para usar ES Modules
2. Eliminar dependências circulares entre módulos
3. Remover todas as variáveis globais desnecessárias via `window`
4. Fornecer compatibilidade para código legado durante a transição
5. Garantir funcionamento consistente em navegadores modernos

## 🔧 Estratégia de Migração

### 1. Auditoria e Documentação
- [ ] Criar inventário de todos os arquivos JS no módulo Dashboard
- [ ] Documentar padrões de importação/exportação atuais
- [ ] Identificar variáveis globais e seu propósito
- [ ] Mapear dependências entre arquivos para identificar ciclos

### 2. Estabelecer Padrões
- [ ] Definir convenções de nomeação para exports (default vs named)
- [ ] Estabelecer padrão para estrutura de imports
- [ ] Criar diretrizes para compatibilidade com código legado
- [ ] Definir abordagem para testes de módulos

### 3. Resolver Problemas Específicos
- [x] Corrigir carregamento do sistema i18n (módulo e global)
- [ ] Resolver problema de inicialização do DashboardModule em iframes
- [ ] Eliminar dependências circulares entre managers
- [ ] Padronizar carregamento de eventos entre módulos

### 4. Implementar Classes de Compatibilidade
- [ ] Criar adaptadores para APIs legadas
- [ ] Implementar camada de compatibilidade para código que espera variáveis globais
- [ ] Desenvolver utilitários de migração para ajudar na transição
- [ ] Documentar uso da camada de compatibilidade

### 5. Testes e Validação
- [ ] Criar testes automatizados para ciclo de vida dos módulos
- [ ] Implementar testes para carregamento em diferentes contextos (iframe, janela principal)
- [ ] Validar ordem de inicialização em todos os cenários
- [ ] Testar com diferentes navegadores e versões

## 📝 Detalhes de Implementação

### Fase 1: Preparação (1-2 semanas)
- Completar auditoria de código
- Estabelecer sistema para detecção de dependências circulares
- Criar ambiente de teste isolado para módulos
- Documentar estado atual para referência

### Fase 2: Migração de Núcleo (2-3 semanas)
- Migrar arquivos principais para padrão ES Modules puro
- Implementar camada de compatibilidade para suporte legado
- Resolver dependências circulares no core
- Padronizar interfaces entre managers

### Fase 3: Migração de Componentes (2-3 semanas)
- Migrar componentes de UI para ES Modules
- Atualizar testes para funcionamento com módulos
- Implementar lazy loading para componentes secundários
- Validar funcionalidade em diferentes cenários

### Fase 4: Limpeza e Documentação (1-2 semanas)
- Remover código de compatibilidade desnecessário
- Finalizar documentação de padrões
- Criar exemplos de uso para referência
- Atualizar documentação de desenvolvimento

## 🚨 Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Quebra em código legado | Alto | Implementar camada de compatibilidade com fallbacks |
| Degradação de performance | Médio | Medir performance antes/depois com benchmarks |
| Problemas em navegadores específicos | Médio | Testes extensivos em múltiplos navegadores |
| Falhas em carregamento assíncrono | Alto | Implementar sistema robusto de detecção de erros |

## 📊 Métricas de Sucesso

- Redução de 100% nas variáveis globais desnecessárias
- Eliminação de todas as dependências circulares
- Melhoria no tempo de carregamento inicial
- Redução no tamanho total de JavaScript carregado
- Zero regressões funcionais após migração completa 