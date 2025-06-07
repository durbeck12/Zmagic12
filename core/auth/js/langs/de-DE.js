// Überprüfung zur Vermeidung von Neuerklärung
if (typeof window.auth_de_DE === 'undefined') {
    window.auth_de_DE = {
        // Allgemein
        "app_name": "ZMagic12",
        "language": {
            "pt_PT": "Português (Portugal)",
            "en_US": "English (US)",
            "fr_FR": "Français (France)",
            "es_ES": "Español (España)",
            "de_DE": "Deutsch (Deutschland)",
            "zh_CN": "中文 (简体)"
        },
        
        // Anmeldung
        "login": {
            "title": "Zugang zu Ihrem Konto",
            "email_label": "E-Mail",
            "password_label": "Passwort",
            "remember_me": "Angemeldet bleiben",
            "submit_button": "Anmelden",
            "register_link": "Noch kein Konto?",
            "forgot_password_link": "Passwort vergessen?",
            "error_invalid_credentials": "Ungültige E-Mail oder Passwort.",
            "error_empty_fields": "Bitte füllen Sie alle Felder aus.",
            "error_generic": "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
            "success_message": "Anmeldung erfolgreich! Weiterleitung...",
            "loading": "Wird geladen...",
            "back_link": "Zurück zur Startseite",
            "offline_mode": "Offline-Modus",
            "already_logged_in": "Benutzer bereits angemeldet:",
            "user_logged_in_message": "Benutzer bereits angemeldet",
            "logout_button": "Abmelden",
            "continue_button": "Mit diesem Konto fortfahren",
            "connection_restored": "Verbindung wiederhergestellt",
            "connection_lost": "Verbindung verloren",
            "connection_error": "Verbindungsfehler"
        },
        
        // Registrierung
        "register": {
            "title": "Konto erstellen",
            "name_label": "Name",
            "email_label": "E-Mail",
            "password_label": "Passwort",
            "confirm_password_label": "Passwort bestätigen",
            "submit_button": "Registrieren",
            "login_link": "Bereits ein Konto?",
            "error_passwords_dont_match": "Passwörter stimmen nicht überein.",
            "error_email_in_use": "Diese E-Mail wird bereits verwendet.",
            "error_generic": "Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
            "success_message": "Registrierung erfolgreich! Weiterleitung...",
            "back_link": "Zurück zur Startseite"
        },
        
        // Passwort vergessen
        "forgot_password": {
            "title": "Passwort zurücksetzen",
            "description": "Geben Sie Ihre E-Mail ein, um Anweisungen zur Wiederherstellung zu erhalten",
            "email_label": "E-Mail",
            "submit_button": "Senden",
            "login_link": "Passwort wieder eingefallen? Anmelden",
            "back_link": "Zurück zur Startseite",
            "success_message": "Anweisungen an Ihre E-Mail gesendet!",
            "error_email_not_found": "E-Mail nicht gefunden.",
            "error_generic": "Fehler bei der Verarbeitung der Anfrage."
        },
        
        // Passwortwiederherstellung
        "recovery": {
            "title": "Passwort wiederherstellen",
            "email_label": "E-Mail",
            "submit_button": "Wiederherstellungslink senden",
            "login_link": "Passwort wieder eingefallen?",
            "error_generic": "Beim Senden der Wiederherstellungs-E-Mail ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
            "success_message": "Wiederherstellungs-E-Mail gesendet! Bitte überprüfen Sie Ihren Posteingang.",
            "back_link": "Zurück zur Startseite"
        },
        
        // Profil
        "profile": {
            "page_title": "Benutzerprofil - ZMagic12",
            "title": "Benutzerprofil",
            "loading": "Wird geladen...",
            "loading_activities": "Aktivitäten werden geladen...",
            "user_avatar": "Benutzeravatar",
            "user_type_prefix": "Benutzertyp: Wird geladen...",
            
            "tabs": {
                "personal_info": "Persönliche Informationen",
                "account_settings": "Kontoeinstellungen",
                "activity": "Aktivität",
                "subscription": "Abonnement"
            },
            
            "fields": {
                "full_name": "Vollständiger Name",
                "organization": "Organisation",
                "phone": "Telefonnummer",
                "country": "Land",
                "newsletter": "Benachrichtigungen und Neuigkeiten per E-Mail erhalten"
            },
            
            "account_settings": {
                "title": "Kontoeinstellungen",
                "email": "E-Mail",
                "role": "Rolle",
                "created_at": "Konto erstellt am",
                "last_signin": "Letzter Zugriff",
                "terms": "Allgemeine Geschäftsbedingungen",
                "security": "Sicherheit",
                "change_password": "Passwort ändern"
            },
            
            "activity": {
                "title": "Kontoaktivität",
                "projects": "Projekte",
                "templates": "Vorlagen",
                "archived": "Archiviert",
                "last_accesses": "Letzte Aktivitäten"
            },
            
            "subscription": {
                "title": "Abonnementinformationen",
                "current_plan": "Aktueller Plan",
                "start_date": "Startdatum",
                "validity": "Gültig bis",
                "upgrade_plan": "Plan aktualisieren"
            },
            
            "buttons": {
                "save": "Änderungen speichern",
                "cancel": "Abbrechen"
            }
        }
    };
}

// Exportiert die Übersetzungen für die Modulkompatibilität
if (typeof module !== "undefined" && module.exports) {
    module.exports = window.auth_de_DE;
} 