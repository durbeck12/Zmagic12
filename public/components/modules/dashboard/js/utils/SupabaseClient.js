import errorHandler from './ErrorHandler.js';

class SupabaseConfig {
    static SUPABASE_URL = 'https://xjmpohdtonzeafylahmr.supabase.co';
    static SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbXBvaGR0b256ZWFmeWxhaG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY3NDUsImV4cCI6MjA1NTgxMjc0NX0.Q6aWS0jKc2-FDkhn5bkr8QUFcdQwkvPpDwfzJYWI1Ek';
    static #instance = null;

    static getClient() {
        if (!this.#instance) {
            try {
                const options = {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true
                    },
                    global: {
                        headers: {
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        }
                    }
                };
                
                this.#instance = supabase.createClient(this.SUPABASE_URL, this.SUPABASE_KEY, options);
                
                // Adicionar interceptor para logs em ambiente de desenvolvimento
                if (this.isDevelopment()) {
                    console.log('Supabase client initialized in development mode');
                }
            } catch (error) {
                const errorInfo = errorHandler.handleError(error);
                console.error('[SupabaseConfig] Error initializing Supabase client:', errorInfo.message);
                throw new Error('Failed to initialize Supabase client');
            }
        }
        return this.#instance;
    }

    static isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('codesandbox');
    }

    static async getCurrentSession() {
        try {
            const client = this.getClient();
            const { data: { session }, error } = await client.auth.getSession();
            
            if (error) throw error;
            return session;
        } catch (error) {
            const errorInfo = errorHandler.handleError(error, { 
                subtype: 'expired'
            });
            console.error('[SupabaseConfig] Error getting current session:', errorInfo.message);
            return null;
        }
    }

    /**
     * Método interno para obter dados básicos do usuário autenticado
     * Este método deve ser usado apenas internamente pelo UserManager
     * @private
     * @returns {Promise<Object|null>} Dados básicos do usuário ou null se não estiver autenticado
     */
    static async getAuthUser() {
        try {
            const client = this.getClient();
            const { data: { user }, error } = await client.auth.getUser();
            
            if (error) throw error;
            return user;
        } catch (error) {
            const errorInfo = errorHandler.handleError(error);
            console.error('[SupabaseConfig] Error getting auth user:', errorInfo.message);
            return null;
        }
    }

    /**
     * Trata erros do Supabase utilizando o sistema centralizado de tratamento de erros
     * @param {Error} error - O erro a ser tratado
     * @param {Object} options - Opções adicionais
     * @returns {string} Mensagem de erro amigável
     * @deprecated Use errorHandler.handleError diretamente
     */
    static handleError(error, options = {}) {
        console.warn('[SupabaseConfig] handleError está deprecado. Use errorHandler.handleError diretamente.');
        const errorInfo = errorHandler.handleError(error, options);
        return errorInfo.message;
    }

    static isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}

export default SupabaseConfig; 