/**
 * Configuração do Supabase para autenticação e acesso ao banco de dados
 */

// Configurações do Supabase
const SUPABASE_URL = 'https://xjmpohdtonzeafylahmr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbXBvaGR0b256ZWFmeWxhaG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY3NDUsImV4cCI6MjA1NTgxMjc0NX0.Q6aWS0jKc2-FDkhn5bkr8QUFcdQwkvPpDwfzJYWI1Ek';

// Inicializar cliente Supabase (executado imediatamente)
(function() {
  console.log('[SUPABASE_CONFIG] Inicializando cliente Supabase');
  
  // Verificar se o script Supabase já foi carregado
  if (window.supabase) {
    console.log('[SUPABASE_CONFIG] Biblioteca Supabase já carregada');
    initializeClient();
    return;
  }

  // Carregar a biblioteca Supabase via script
  console.log('[SUPABASE_CONFIG] Carregando biblioteca Supabase do CDN');
  loadScriptDynamically('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.8/dist/umd/supabase.min.js', function() {
    console.log('[SUPABASE_CONFIG] Biblioteca Supabase carregada com sucesso');
    initializeClient();
  }, function() {
    console.error('[SUPABASE_CONFIG] Falha ao carregar biblioteca Supabase, tentando CDN alternativo');
    // Tentar CDN alternativo
    loadScriptDynamically('https://unpkg.com/@supabase/supabase-js@2.39.8/dist/umd/supabase.min.js', function() {
      console.log('[SUPABASE_CONFIG] Biblioteca Supabase carregada com sucesso (CDN alternativo)');
      initializeClient();
    }, function() {
      console.error('[SUPABASE_CONFIG] Falha ao carregar biblioteca Supabase. Criando cliente mock para modo offline');
      window.supabase = createMockClient();
      document.dispatchEvent(new CustomEvent('supabase:ready', { detail: { offline: true } }));
    });
  });

  /**
   * Carrega um script dinamicamente
   */
  function loadScriptDynamically(url, onSuccess, onError) {
    const scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.async = true;
    
    scriptTag.onload = onSuccess;
    scriptTag.onerror = onError;
    
    document.head.appendChild(scriptTag);
  }

  /**
   * Inicializa o cliente Supabase
   */
  function initializeClient() {
    try {
      if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
        window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('[SUPABASE_CONFIG] Cliente Supabase inicializado com sucesso');
      } 
      else if (typeof supabaseJs !== 'undefined' && typeof supabaseJs.createClient === 'function') {
        window.supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('[SUPABASE_CONFIG] Cliente Supabase inicializado via objeto supabaseJs');
      }
      else if (typeof createClient === 'function') {
        window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('[SUPABASE_CONFIG] Cliente Supabase inicializado via função createClient');
      }
      else {
        throw new Error('API do Supabase não encontrada no escopo global');
      }
      
      // Verificar sessão atual do usuário
      checkCurrentSession();
      
      // Disparar evento para notificar que o Supabase está pronto
      document.dispatchEvent(new CustomEvent('supabase:ready', { detail: { offline: false } }));
    } 
    catch (error) {
      console.error('[SUPABASE_CONFIG] Erro ao inicializar cliente Supabase:', error);
      
      // Criar um cliente mock para permitir que a aplicação continue
      window.supabase = createMockClient();
      document.dispatchEvent(new CustomEvent('supabase:ready', { detail: { offline: true, error: error.message } }));
    }
  }

  /**
   * Verifica se há uma sessão ativa do usuário
   */
  async function checkCurrentSession() {
    try {
      // Verificar se há uma sessão existente
      const { data, error } = await window.supabase.auth.getSession();
      
      if (error) {
        console.error('[SUPABASE_CONFIG] Erro ao verificar sessão:', error.message);
        return;
      }
      
      if (data && data.session) {
        console.log('[SUPABASE_CONFIG] Sessão existente detectada para:', data.session.user.email);
        
        // Disparar evento de usuário logado
        const userLoginEvent = new CustomEvent('user:login', {
          detail: {
            user: data.session.user,
            session: data.session
          },
          bubbles: true,
          cancelable: true
        });
        document.dispatchEvent(userLoginEvent);
        window.dispatchEvent(new CustomEvent('login:success', { detail: { user: data.session.user } }));
      } else {
        console.log('[SUPABASE_CONFIG] Nenhuma sessão ativa encontrada');
      }
    } catch (error) {
      console.error('[SUPABASE_CONFIG] Erro ao verificar sessão:', error);
    }
  }

  /**
   * Cria um cliente Supabase mock para modo offline
   */
  function createMockClient() {
    console.log('[SUPABASE_CONFIG] Criando cliente Supabase mock para modo offline');
    
    // Verificar se há dados de usuário mock no localStorage
    let mockUser = null;
    try {
      const stored = localStorage.getItem('supabase.auth.token');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.currentSession && parsed.currentSession.user) {
          mockUser = parsed.currentSession.user;
          console.log('[SUPABASE_CONFIG] Usando dados de usuário do localStorage:', mockUser.email);
        }
      }
    } catch (e) {
      console.error('[SUPABASE_CONFIG] Erro ao verificar localStorage:', e);
    }
    
    // Se não há dados no localStorage, usar usuário padrão
    if (!mockUser) {
      mockUser = { 
        id: 'test-user-123', 
        email: 'teste@exemplo.com',
        user_metadata: { name: 'Usuário de Teste' }
      };
    }
    
    // Projetos fictícios para teste
    const mockProjects = [
      { id: 'p1', name: 'Projeto Demo 1', description: 'Projeto para demonstração', user_id: mockUser.id, status: 'active', updated_at: new Date().toISOString() },
      { id: 'p2', name: 'Projeto Demo 2', description: 'Outro projeto para demonstração', user_id: mockUser.id, status: 'active', updated_at: new Date(Date.now() - 86400000).toISOString() }
    ];
    
    // Cliente mock que implementa as funções básicas
    return {
      auth: {
        getSession: () => Promise.resolve({ 
          data: { 
            session: { 
              access_token: 'mock-token', 
              user: mockUser 
            } 
          }, 
          error: null 
        }),
        getUser: () => Promise.resolve({ 
          data: { user: mockUser }, 
          error: null 
        }),
        signInWithPassword: () => Promise.resolve({ 
          data: { 
            user: mockUser, 
            session: { access_token: 'mock-token' } 
          }, 
          error: null 
        }),
        signUp: (credentials) => Promise.resolve({ 
          data: { 
            user: { 
              id: 'new-user-' + Date.now(), 
              email: credentials?.email || 'novo@exemplo.com' 
            }, 
            session: { access_token: 'mock-token' } 
          }, 
          error: null 
        }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: (table) => ({
        select: () => ({
          eq: (field, value) => ({
            order: () => Promise.resolve({ 
              data: table === 'projects' ? mockProjects.filter(p => p[field] === value) : [], 
              error: null 
            }),
            single: () => Promise.resolve({ 
              data: table === 'projects' ? mockProjects.find(p => p[field] === value) : null, 
              error: null 
            })
          }),
          limit: () => Promise.resolve({ 
            data: table === 'projects' ? mockProjects.slice(0, 5) : [], 
            error: null 
          })
        }),
        insert: (items) => ({
          select: () => Promise.resolve({ 
            data: items.map((item, index) => ({
              ...item,
              id: `new-${table}-${Date.now()}-${index}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })), 
            error: null 
          })
        }),
        update: (updates) => ({
          eq: (field, value) => Promise.resolve({ 
            data: { ...updates, id: value, updated_at: new Date().toISOString() }, 
            error: null 
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      })
    };
  }
})();

// Função para verificar se o Supabase está disponível
window.isSupabaseAvailable = function() {
  return !!window.supabase;
};

// Inicialização do cliente Supabase
// Este arquivo configura e exporta o cliente para toda a aplicação

// Carregar Supabase via CDN - Verificando o nome correto do objeto global
function initializeSupabase() {
  const SUPABASE_URL = 'https://xjmpohdtonzeafylahmr.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbXBvaGR0b256ZWFmeWxhaG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY3NDUsImV4cCI6MjA1NTgxMjc0NX0.Q6aWS0jKc2-FDkhn5bkr8QUFcdQwkvPpDwfzJYWI1Ek';

  try {
    // Verificar se o objeto supabaseJs está disponível (via CDN)
    if (window.supabaseJs) {
      console.log('Usando cliente Supabase via CDN (supabaseJs)');
      const supabaseClient = window.supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);
      window.supabase = supabaseClient;
      return supabaseClient;
    } 
    
    // Verificar se há outro nome para o objeto Supabase
    else if (window.supabase) {
      console.log('Objeto supabase já disponível no escopo global');
      return window.supabase;
    } 
    
    // Em caso de falha, criar um cliente alternativo ou mock
    else {
      console.warn('Cliente Supabase não encontrado, criando cliente alternativo');
      return createAlternativeClient();
    }
  } catch (error) {
    console.error('Erro ao inicializar Supabase:', error);
    return createAlternativeClient();
  }
}

// Criar cliente alternativo para modo offline
function createAlternativeClient() {
  // Criar cliente mock para permitir operações básicas sem conexão
  const mockClient = {
    auth: {
      signIn: () => Promise.resolve({ user: { id: 'test-user-1', email: 'test@example.com' }, error: null }),
      signUp: () => Promise.resolve({ user: { id: 'test-user-1', email: 'test@example.com' }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      user: () => ({ id: 'test-user-1', email: 'test@example.com' }),
      session: () => ({ user: { id: 'test-user-1', email: 'test@example.com' } })
    },
    from: (table) => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: {}, error: null })
      }),
      insert: () => Promise.resolve({ data: { id: 'new-id' }, error: null }),
      update: () => Promise.resolve({ data: {}, error: null }),
      delete: () => Promise.resolve({ data: {}, error: null }),
    })
  };
  
  console.log('Cliente mock do Supabase criado para modo offline');
  window.supabase = mockClient;
  window.isTestMode = true;
  return mockClient;
}

// Executar imediatamente para inicializar
(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeSupabase();
      console.log('Supabase inicializado via DOMContentLoaded');
    });
  } else {
    initializeSupabase();
    console.log('Supabase inicializado imediatamente');
  }
})();

// Também exportar como módulo ES para compatibilidade
const supabaseClient = initializeSupabase();
export default supabaseClient; 