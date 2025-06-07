// Vérifie si la variable existe déjà pour éviter une redéclaration
if (typeof window.fr_FR === 'undefined') {
    window.fr_FR = {
        // Dashboard
        "dashboard": {
            // En-tête
            "header": {
                "new_project": "Nouveau Projet"
            },
            
            // Onglets
            "tabs": {
                "projects": "Mes Projets",
                "archived": "Archivés",
                "templates": "Modèles"
            },
            
            // Modal de nouveau projet
            "new_project_modal": {
                "title": "Nouveau Projet",
                "name_label": "Nom du Projet",
                "description_label": "Description",
                "create_as_template": "Créer comme modèle",
                "cancel_button": "Annuler",
                "create_button": "Créer Projet"
            },
            
            // Modal de modification de projet
            "edit_project_modal": {
                "title": "Modifier Projet",
                "name_label": "Nom du Projet",
                "description_label": "Description",
                "cancel_button": "Annuler",
                "save_button": "Enregistrer les Modifications"
            },
            
            // Projets
            "projects": {
                "empty_state": "Vous n'avez pas encore de projets. Cliquez sur 'Nouveau Projet' pour commencer.",
                "created_at": "Créé le",
                "last_modified": "Dernière modification",
                "edit": "Modifier",
                "delete": "Supprimer",
                "archive": "Archiver",
                "unarchive": "Désarchiver",
                "open": "Ouvrir",
                "make_template": "Copier vers Modèles",
                "use_template": "Utiliser comme Modèle"
            },
            
            // Modèles
            "templates": {
                "empty_state": "Vous n'avez pas encore de modèles. Vous pouvez créer un modèle ou enregistrer un projet existant comme modèle.",
                "created_at": "Créé le",
                "last_modified": "Dernière modification",
                "edit": "Modifier",
                "delete": "Supprimer",
                "make_regular": "Convertir en Projet",
                "use_template": "Utiliser comme Modèle"
            },
            
            // Archivés
            "archived": {
                "empty_state": "Vous n'avez aucun projet archivé.",
                "created_at": "Créé le",
                "last_modified": "Dernière modification",
                "edit": "Modifier",
                "delete": "Supprimer",
                "unarchive": "Désarchiver"
            },
            
            // Modal de confirmation de suppression
            "delete_modal": {
                "title": "Confirmer la Suppression",
                "confirm_text": "Êtes-vous sûr de vouloir supprimer le projet",
                "warning": "Cette action ne peut pas être annulée.",
                "cancel_button": "Annuler",
                "delete_button": "Supprimer le Projet"
            },
            
            // Modal de création à partir d'un modèle
            "new_from_template": {
                "title": "Nouveau Projet à partir d'un Modèle",
                "name_label": "Nom du Nouveau Projet",
                "description_label": "Description",
                "template_info": "Basé sur le modèle",
                "cancel_button": "Annuler",
                "create_button": "Créer Projet"
            },
            
            // Modal de projet créé
            "project_created_modal": {
                "title": "Projet Créé",
                "message": "Le projet",
                "message_end": "a été créé avec succès et est disponible dans l'onglet \"Mes Projets\".",
                "ok_button": "OK"
            },
            
            // Carte de projet
            "project_card": {
                "no_description": "Aucune description",
                "edit_button": "Modifier Projet",
                "created_label": "Créé :",
                "updated_label": "Mis à jour :",
                "edit_button_title": "Modifier",
                "archive_button_title": "Archiver",
                "delete_button_title": "Supprimer",
                "unarchive_button_title": "Désarchiver",
                "use_template_button_title": "Utiliser Modèle"
            },
            
            // Chargement
            "loading": "Chargement...",
            
            // Messages de succès
            "success": {
                "project_created": "Projet créé avec succès",
                "project_updated": "Projet mis à jour avec succès",
                "project_deleted": "Projet supprimé avec succès",
                "project_archived": "Projet archivé avec succès",
                "project_unarchived": "Projet désarchivé avec succès",
                "template_created": "Modèle créé avec succès",
                "project_copied": "Projet copié vers Modèles avec succès",
                "projects_updated": "Projets mis à jour avec succès"
            },
            
            // Messages d'erreur
            "error": {
                "load_projects": "Erreur lors du chargement des projets. Veuillez réessayer.",
                "create_project": "Erreur lors de la création du projet. Veuillez réessayer.",
                "update_project": "Erreur lors de la mise à jour du projet. Veuillez réessayer.",
                "delete_project": "Erreur lors de la suppression du projet. Veuillez réessayer.",
                "archive_project": "Erreur lors de l'archivage du projet. Veuillez réessayer.",
                "unarchive_project": "Erreur lors du désarchivage du projet. Veuillez réessayer.",
                "load_dashboard": "Erreur lors du chargement du tableau de bord. Veuillez recharger la page."
            }
        }
    };
}
