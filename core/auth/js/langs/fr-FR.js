// Vérifie si la variable est déjà définie pour éviter l'écrasement
if (typeof window.auth_fr_FR === "undefined") {
    // Définir les traductions pour le français
    window.auth_fr_FR = {
        // Général
        "app_name": "ZMagic12",
        "language": {
            "pt_PT": "Português (Portugal)",
            "en_US": "English (US)",
            "fr_FR": "Français (France)",
            "es_ES": "Español (España)",
            "de_DE": "Deutsch (Deutschland)",
            "zh_CN": "中文 (简体)"
        },

        // Connexion
        "login": {
            "title": "Accéder à votre compte",
            "email_label": "Email",
            "password_label": "Mot de passe",
            "remember_me": "Se souvenir de moi",
            "submit_button": "Se connecter",
            "register_link": "Vous n'avez pas de compte?",
            "forgot_password_link": "Mot de passe oublié?",
            "error_invalid_credentials": "Email ou mot de passe invalide.",
            "error_empty_fields": "Veuillez remplir tous les champs.",
            "error_generic": "Une erreur s'est produite lors de la connexion. Veuillez réessayer.",
            "success_message": "Connexion réussie! Redirection en cours...",
            "loading": "Chargement...",
            "back_link": "Retour à la page d'accueil",
            "offline_mode": "Mode hors ligne",
            "already_logged_in": "Utilisateur déjà connecté:",
            "user_logged_in_message": "Utilisateur déjà connecté",
            "logout_button": "Déconnexion",
            "continue_button": "Continuer avec ce compte",
            "connection_restored": "Connexion rétablie",
            "connection_lost": "Connexion perdue",
            "connection_error": "Erreur de connexion"
        },

        // Inscription
        "register": {
            "title": "Créer votre compte",
            "name_label": "Nom",
            "email_label": "Email",
            "password_label": "Mot de passe",
            "confirm_password_label": "Confirmer le mot de passe",
            "submit_button": "S'inscrire",
            "login_link": "Vous avez déjà un compte?",
            "error_passwords_dont_match": "Les mots de passe ne correspondent pas.",
            "error_email_in_use": "Cet email est déjà utilisé.",
            "error_generic": "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
            "success_message": "Inscription réussie! Redirection en cours...",
            "back_link": "Retour à la page d'accueil"
        },

        // Récupération de mot de passe
        "recovery": {
            "title": "Récupérer votre mot de passe",
            "email_label": "Email",
            "submit_button": "Envoyer le lien de récupération",
            "login_link": "Vous vous souvenez de votre mot de passe?",
            "error_generic": "Une erreur s'est produite lors de l'envoi de l'email de récupération. Veuillez réessayer.",
            "success_message": "Email de récupération envoyé! Veuillez vérifier votre boîte de réception.",
            "back_link": "Retour à la page d'accueil"
        },
        
        // Profil
        "profile": {
            "page_title": "Profil Utilisateur - ZMagic12",
            "title": "Profil Utilisateur",
            "loading": "Chargement...",
            "loading_activities": "Chargement des activités...",
            "user_avatar": "Avatar de l'utilisateur",
            "user_type_prefix": "Type d'utilisateur: Chargement...",
            
            "tabs": {
                "personal_info": "Informations Personnelles",
                "account_settings": "Paramètres du Compte",
                "activity": "Activité",
                "subscription": "Abonnement"
            },
            
            "fields": {
                "full_name": "Nom Complet",
                "organization": "Organisation",
                "phone": "Numéro de Téléphone",
                "country": "Pays",
                "newsletter": "Recevoir des notifications et des actualités par email"
            },
            
            "account_settings": {
                "title": "Paramètres du Compte",
                "email": "Email",
                "role": "Rôle",
                "created_at": "Compte créé le",
                "last_signin": "Dernière connexion",
                "terms": "Conditions Générales",
                "security": "Sécurité",
                "change_password": "Changer le Mot de Passe"
            },
            
            "activity": {
                "title": "Activité du Compte",
                "projects": "Projets",
                "templates": "Modèles",
                "archived": "Archivés",
                "last_accesses": "Activités Récentes"
            },
            
            "subscription": {
                "title": "Informations d'Abonnement",
                "current_plan": "Forfait Actuel",
                "start_date": "Date de Début",
                "validity": "Valable Jusqu'au",
                "upgrade_plan": "Mettre à Niveau"
            },
            
            "buttons": {
                "save": "Enregistrer les Modifications",
                "cancel": "Annuler"
            }
        }
    };
}

// Exporter les traductions pour la compatibilité des modules
if (typeof module !== "undefined" && module.exports) {
    module.exports = window.auth_fr_FR;
} 