/**
 * Classe responsável pelo tratamento centralizado de erros no Dashboard
 * Implementa categorização de erros, mensagens padronizadas e utilitários para manusear erros
 */
class ErrorHandler {
    constructor() {
        // Definir categorias de erro
        this.errorTypes = {
            AUTH: 'auth',           // Erros de autenticação
            DATABASE: 'database',   // Erros de banco de dados
            NETWORK: 'network',     // Erros de rede
            VALIDATION: 'validation', // Erros de validação
            PERMISSION: 'permission', // Erros de permissão
            UNKNOWN: 'unknown'      // Erros desconhecidos
        };
        
        // Mapeamento de códigos de erro para categorias
        this.errorCodeMappings = {
            // Códigos de erro Supabase - Autenticação
            'PGRST301': this.errorTypes.AUTH,
            'PGRST302': this.errorTypes.AUTH,
            'invalid_grant': this.errorTypes.AUTH,
            'invalid_credentials': this.errorTypes.AUTH,
            'email_not_confirmed': this.errorTypes.AUTH,
            'user_not_found': this.errorTypes.AUTH,
            
            // Códigos de erro Supabase - Banco de dados
            'PGRST401': this.errorTypes.DATABASE,
            'PGRST402': this.errorTypes.DATABASE,
            'PGRST403': this.errorTypes.DATABASE,
            '23505': this.errorTypes.DATABASE, // Unique violation
            '22P02': this.errorTypes.VALIDATION, // Invalid text representation
            
            // Códigos de erro Rede
            'failed_fetch': this.errorTypes.NETWORK,
            'network_error': this.errorTypes.NETWORK,
            'timeout': this.errorTypes.NETWORK,
            
            // Códigos de erro Permissão
            'insufficient_permissions': this.errorTypes.PERMISSION,
            'not_authorized': this.errorTypes.PERMISSION
        };
        
        // Mensagens padronizadas por categoria
        this.defaultMessages = {
            [this.errorTypes.AUTH]: {
                generic: 'Erro de autenticação. Por favor, faça login novamente.',
                expired: 'Sua sessão expirou. Por favor, faça login novamente.',
                invalid: 'Credenciais inválidas. Verifique seu email e senha.',
                i18n: 'dashboard.error.auth'
            },
            [this.errorTypes.DATABASE]: {
                generic: 'Erro ao acessar dados. Por favor, tente novamente.',
                notFound: 'O recurso solicitado não foi encontrado.',
                constraint: 'Não foi possível salvar devido a restrições do banco de dados.',
                i18n: 'dashboard.error.database'
            },
            [this.errorTypes.NETWORK]: {
                generic: 'Erro de conexão. Verifique sua internet e tente novamente.',
                timeout: 'A operação excedeu o tempo limite. Tente novamente.',
                i18n: 'dashboard.error.network'
            },
            [this.errorTypes.VALIDATION]: {
                generic: 'Os dados fornecidos são inválidos.',
                required: 'Por favor, preencha todos os campos obrigatórios.',
                format: 'O formato dos dados é inválido.',
                i18n: 'dashboard.error.validation'
            },
            [this.errorTypes.PERMISSION]: {
                generic: 'Você não tem permissão para realizar esta ação.',
                i18n: 'dashboard.error.permission'
            },
            [this.errorTypes.UNKNOWN]: {
                generic: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
                i18n: 'dashboard.error.unknown'
            }
        };

        console.log('[ErrorHandler] Initialized');
    }

    /**
     * Categoriza um erro com base na sua estrutura e código
     * @param {Error|Object} error - O erro a ser categorizado
     * @returns {string} O tipo de erro
     */
    categorizeError(error) {
        // Se não temos erro ou é uma string, retorna desconhecido
        if (!error) return this.errorTypes.UNKNOWN;
        if (typeof error === 'string') return this.errorTypes.UNKNOWN;
        
        // Verificar código de erro para Supabase
        if (error.code && this.errorCodeMappings[error.code]) {
            return this.errorCodeMappings[error.code];
        }
        
        // Verificar por erros de rede
        if (error.message && (
            error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError') ||
            error.message.includes('network') ||
            error instanceof TypeError && error.message.includes('fetch')
        )) {
            return this.errorTypes.NETWORK;
        }
        
        // Verificar por erros de autenticação
        if (
            (error.error === 'invalid_grant') ||
            (error.message && error.message.includes('auth')) ||
            (error.status === 401 || error.status === 403)
        ) {
            return this.errorTypes.AUTH;
        }
        
        // Verificar erros de validação
        if (
            (error.message && error.message.includes('validation')) ||
            (error.message && error.message.includes('invalid'))
        ) {
            return this.errorTypes.VALIDATION;
        }
        
        // Verificar erros de banco de dados específicos
        if (
            (error.message && error.message.includes('database')) ||
            (error.code && (error.code.startsWith('22') || error.code.startsWith('23')))
        ) {
            return this.errorTypes.DATABASE;
        }
        
        return this.errorTypes.UNKNOWN;
    }

    /**
     * Obtém uma mensagem de erro adequada com base no erro
     * @param {Error|Object} error - O erro original
     * @param {string} [subtype] - Subtipo específico de erro
     * @returns {Object} Objeto com mensagem e chave i18n
     */
    getErrorMessage(error, subtype) {
        const errorType = this.categorizeError(error);
        const errorMessages = this.defaultMessages[errorType];
        
        // Se temos um subtipo específico e existe mensagem para ele
        if (subtype && errorMessages[subtype]) {
            return {
                message: errorMessages[subtype],
                i18n: errorMessages.i18n
            };
        }
        
        // Obter mensagem específica com base no erro
        let specificMessage = this.getSpecificErrorMessage(error, errorType);
        if (specificMessage) {
            return specificMessage;
        }
        
        // Retornar mensagem genérica para o tipo
        return {
            message: errorMessages.generic,
            i18n: errorMessages.i18n
        };
    }
    
    /**
     * Extrai uma mensagem mais específica com base no erro
     * @private
     * @param {Error|Object} error - O erro original
     * @param {string} errorType - O tipo categorizado de erro
     * @returns {Object|null} Objeto com mensagem e chave i18n, ou null
     */
    getSpecificErrorMessage(error, errorType) {
        // Se for erro Supabase, tentar extrair mensagem específica
        if (error.error_description) {
            return {
                message: error.error_description,
                i18n: this.defaultMessages[errorType].i18n
            };
        }
        
        // Para erros de autenticação
        if (errorType === this.errorTypes.AUTH) {
            if (error.message && error.message.includes('expired')) {
                return {
                    message: this.defaultMessages[errorType].expired,
                    i18n: `${this.defaultMessages[errorType].i18n}.expired`
                };
            }
            
            if (error.message && error.message.includes('invalid credentials')) {
                return {
                    message: this.defaultMessages[errorType].invalid,
                    i18n: `${this.defaultMessages[errorType].i18n}.invalid`
                };
            }
        }
        
        // Para erros de banco de dados
        if (errorType === this.errorTypes.DATABASE) {
            if (error.message && error.message.includes('not found')) {
                return {
                    message: this.defaultMessages[errorType].notFound,
                    i18n: `${this.defaultMessages[errorType].i18n}.not_found`
                };
            }
            
            if (error.code === '23505') { // Unique violation
                return {
                    message: this.defaultMessages[errorType].constraint,
                    i18n: `${this.defaultMessages[errorType].i18n}.constraint`
                };
            }
        }
        
        // Para erros de rede
        if (errorType === this.errorTypes.NETWORK) {
            if (error.message && error.message.includes('timeout')) {
                return {
                    message: this.defaultMessages[errorType].timeout,
                    i18n: `${this.defaultMessages[errorType].i18n}.timeout`
                };
            }
        }
        
        return null;
    }

    /**
     * Trata um erro e retorna uma mensagem amigável
     * @param {Error|Object} error - O erro a ser tratado
     * @param {Object} options - Opções adicionais
     * @param {string} [options.subtype] - Subtipo específico de erro
     * @param {boolean} [options.logError=true] - Se deve registrar o erro no console
     * @returns {Object} Objeto com mensagem e chave i18n
     */
    handleError(error, options = {}) {
        const { subtype, logError = true } = options;
        
        // Registrar o erro no console
        if (logError) {
            console.error('[ErrorHandler] Error handled:', error);
            
            // Incluir stack trace para depuração se disponível
            if (error.stack) {
                console.debug('[ErrorHandler] Stack trace:', error.stack);
            }
        }
        
        // Obter mensagem para o erro
        const errorInfo = this.getErrorMessage(error, subtype);
        
        return errorInfo;
    }
}

// Exportar uma instância única para ser usada em toda a aplicação
const errorHandler = new ErrorHandler();
export default errorHandler; 