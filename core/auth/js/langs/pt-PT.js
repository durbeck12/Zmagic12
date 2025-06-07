/**
 * Arquivo de idioma para Português (Portugal)
 * Sistema de Autenticação
 */


// Export translations for module compatibility
if (typeof module !== "undefined" && module.exports) {
    module.exports = window.auth_pt_PT;
} 

if (typeof window.auth_pt_PT === "undefined") {
    window.auth_pt_PT = {
        // Geral
        "app_name": "ZMagic12",
        "language": {
            "pt_PT": "Português (Portugal)",
            "en_US": "Inglês (EUA)",
            "fr_FR": "Francês (França)",
            "es_ES": "Espanhol (Espanha)",
            "de_DE": "Alemão (Alemanha)",
            "zh_CN": "Chinês (Simplificado)"
        },

        // Login
        "login": {
            "title": "Aceda à sua conta",
            "email_label": "Email",
            "password_label": "Palavra-passe",
            "remember_me": "Lembrar-me",
            "submit_button": "Entrar",
            "register_link": "Não tem uma conta?",
            "forgot_password_link": "Esqueceu a sua palavra-passe?",
            "error_invalid_credentials": "Email ou palavra-passe inválidos.",
            "error_empty_fields": "Por favor preencha todos os campos.",
            "error_generic": "Ocorreu um erro ao iniciar sessão. Por favor tente novamente.",
            "error_account_inactive": "Esta conta está inactiva. Por favor contacte o suporte.",
            "success_message": "Sessão iniciada com sucesso! A redirigir...",
            "loading": "A carregar...",
            "back_link": "Voltar à página inicial",
            "offline_mode": "Modo offline",
            "already_logged_in": "Utilizador já autenticado:",
            "user_logged_in_message": "Utilizador já autenticado",
            "logout_button": "Terminar sessão",
            "continue_button": "Continuar com esta conta",
            "connection_restored": "Ligação restabelecida",
            "connection_lost": "Ligação perdida",
            "connection_error": "Erro de ligação"
        },

        // Registo
        "register": {
            "title": "Crie a sua conta",
            "name_label": "Nome",
            "email_label": "Email",
            "password_label": "Palavra-passe",
            "confirm_password_label": "Confirmar Palavra-passe",
            "submit_button": "Registar",
            "login_link": "Já tem uma conta?",
            "error_passwords_dont_match": "As palavras-passe não coincidem.",
            "error_email_in_use": "Este email já está em uso.",
            "error_generic": "Ocorreu um erro durante o registo. Por favor tente novamente.",
            "success_message": "Registo efectuado com sucesso! A redirigir...",
            "back_link": "Voltar à página inicial"
        },

        // Recuperação de Palavra-passe
        "recovery": {
            "title": "Recupere a sua palavra-passe",
            "email_label": "Email",
            "submit_button": "Enviar Ligação de Recuperação",
            "login_link": "Lembrou-se da sua palavra-passe?",
            "error_generic": "Ocorreu um erro ao enviar o email de recuperação. Por favor tente novamente.",
            "success_message": "Email de recuperação enviado! Por favor verifique a sua caixa de entrada.",
            "back_link": "Voltar à página inicial"
        },
        
        // Perfil
        "profile": {
            "page_title": "Perfil do Utilizador - ZMagic12",
            "title": "Perfil do Utilizador",
            "loading": "A carregar...",
            "loading_activities": "A carregar actividades...",
            "user_avatar": "Avatar do Utilizador",
            "user_type_prefix": "Tipo de utilizador: A carregar...",
            
            "tabs": {
                "personal_info": "Informação Pessoal",
                "account_settings": "Definições da Conta",
                "activity": "Actividade",
                "subscription": "Subscrição"
            },
            
            "fields": {
                "full_name": "Nome Completo",
                "organization": "Organização",
                "phone": "Número de Telefone",
                "country": "País",
                "newsletter": "Receber notificações e novidades por email"
            },
            
            "account_settings": {
                "title": "Definições da Conta",
                "email": "Email",
                "role": "Função",
                "created_at": "Conta criada em",
                "last_signin": "Último acesso",
                "terms": "Termos e Condições",
                "security": "Segurança",
                "change_password": "Alterar Palavra-passe"
            },
            
            "activity": {
                "title": "Actividade da Conta",
                "projects": "Projectos",
                "templates": "Modelos",
                "archived": "Arquivados",
                "last_accesses": "Actividade Recente"
            },
            
            "subscription": {
                "title": "Informação de Subscrição",
                "current_plan": "Plano Actual",
                "start_date": "Data de Início",
                "validity": "Válido Até",
                "upgrade_plan": "Melhorar Plano"
            },
            
            "buttons": {
                "save": "Guardar Alterações",
                "cancel": "Cancelar"
            }
        }
    };
} 