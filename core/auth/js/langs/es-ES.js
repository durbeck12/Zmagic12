// Verifica si la variable ya está definida para evitar sobrescritura
if (typeof window.auth_es_ES === "undefined") {
    // Define las traducciones para español
    window.auth_es_ES = {
        // General
        "app_name": "ZMagic12",
        "language": {
            "pt_PT": "Português (Portugal)",
            "en_US": "English (US)",
            "fr_FR": "Français (France)",
            "es_ES": "Español (España)",
            "de_DE": "Deutsch (Deutschland)",
            "zh_CN": "中文 (简体)"
        },

        // Inicio de sesión
        "login": {
            "title": "Accede a tu cuenta",
            "email_label": "Email",
            "password_label": "Contraseña",
            "remember_me": "Recordarme",
            "submit_button": "Iniciar sesión",
            "register_link": "¿No tienes una cuenta?",
            "forgot_password_link": "¿Olvidaste tu contraseña?",
            "error_invalid_credentials": "Email o contraseña inválidos.",
            "error_empty_fields": "Por favor, completa todos los campos.",
            "error_generic": "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.",
            "success_message": "¡Inicio de sesión exitoso! Redireccionando...",
            "loading": "Cargando...",
            "back_link": "Volver a la página principal",
            "offline_mode": "Modo sin conexión",
            "already_logged_in": "Usuario ya conectado:",
            "user_logged_in_message": "Usuario ya conectado",
            "logout_button": "Cerrar sesión",
            "continue_button": "Continuar con esta cuenta",
            "connection_restored": "Conexión restaurada",
            "connection_lost": "Conexión perdida",
            "connection_error": "Error de conexión"
        },

        // Registro
        "register": {
            "title": "Crea tu cuenta",
            "name_label": "Nombre",
            "email_label": "Email",
            "password_label": "Contraseña",
            "confirm_password_label": "Confirmar contraseña",
            "submit_button": "Registrarse",
            "login_link": "¿Ya tienes una cuenta?",
            "error_passwords_dont_match": "Las contraseñas no coinciden.",
            "error_email_in_use": "Este email ya está en uso.",
            "error_generic": "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.",
            "success_message": "¡Registro exitoso! Redireccionando...",
            "back_link": "Volver a la página principal"
        },

        // Recuperación de contraseña
        "recovery": {
            "title": "Recupera tu contraseña",
            "email_label": "Email",
            "submit_button": "Enviar enlace de recuperación",
            "login_link": "¿Recordaste tu contraseña?",
            "error_generic": "Ocurrió un error al enviar el email de recuperación. Por favor, inténtalo de nuevo.",
            "success_message": "¡Email de recuperación enviado! Por favor, revisa tu bandeja de entrada.",
            "back_link": "Volver a la página principal"
        },
        
        // Perfil
        "profile": {
            "page_title": "Perfil de Usuario - ZMagic12",
            "title": "Perfil de Usuario",
            "loading": "Cargando...",
            "loading_activities": "Cargando actividades...",
            "user_avatar": "Avatar del Usuario",
            "user_type_prefix": "Tipo de usuario: Cargando...",
            
            "tabs": {
                "personal_info": "Información Personal",
                "account_settings": "Configuración de la Cuenta",
                "activity": "Actividad",
                "subscription": "Suscripción"
            },
            
            "fields": {
                "full_name": "Nombre Completo",
                "organization": "Organización",
                "phone": "Número de Teléfono",
                "country": "País",
                "newsletter": "Recibir notificaciones y novedades por email"
            },
            
            "account_settings": {
                "title": "Configuración de la Cuenta",
                "email": "Email",
                "role": "Rol",
                "created_at": "Cuenta creada el",
                "last_signin": "Último acceso",
                "terms": "Términos y Condiciones",
                "security": "Seguridad",
                "change_password": "Cambiar Contraseña"
            },
            
            "activity": {
                "title": "Actividad de la Cuenta",
                "projects": "Proyectos",
                "templates": "Plantillas",
                "archived": "Archivados",
                "last_accesses": "Actividad Reciente"
            },
            
            "subscription": {
                "title": "Información de Suscripción",
                "current_plan": "Plan Actual",
                "start_date": "Fecha de Inicio",
                "validity": "Válido Hasta",
                "upgrade_plan": "Actualizar Plan"
            },
            
            "buttons": {
                "save": "Guardar Cambios",
                "cancel": "Cancelar"
            }
        }
    };
}

// Exporta las traducciones para compatibilidad con módulos
if (typeof module !== "undefined" && module.exports) {
    module.exports = window.auth_es_ES;
} 