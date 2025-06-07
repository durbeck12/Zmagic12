// Verifica se a variável já existe para evitar redeclaração
if (typeof window.de_DE === 'undefined') {
    window.de_DE = {
        // Dashboard
        "dashboard": {
            // Cabeçalho
            "header": {
                "new_project": "Neues Projekt"
            },
            
            // Tabs
            "tabs": {
                "projects": "Meine Projekte",
                "archived": "Archiviert",
                "templates": "Vorlagen"
            },
            
            // Modal de novo projeto
            "new_project_modal": {
                "title": "Neues Projekt",
                "name_label": "Projektname",
                "description_label": "Beschreibung",
                "create_as_template": "Als Vorlage erstellen",
                "cancel_button": "Abbrechen",
                "create_button": "Projekt erstellen"
            },
            
            // Modal de edição de projeto
            "edit_project_modal": {
                "title": "Projekt bearbeiten",
                "name_label": "Projektname",
                "description_label": "Beschreibung",
                "cancel_button": "Abbrechen",
                "save_button": "Änderungen speichern"
            },
            
            // Projetos
            "projects": {
                "empty_state": "Sie haben noch keine Projekte. Klicken Sie auf 'Neues Projekt', um zu beginnen.",
                "created_at": "Erstellt am",
                "last_modified": "Zuletzt geändert",
                "edit": "Bearbeiten",
                "delete": "Löschen",
                "archive": "Archivieren",
                "unarchive": "Dearchivieren",
                "open": "Öffnen",
                "make_template": "In Vorlagen kopieren",
                "use_template": "Als Vorlage verwenden"
            },
            
            // Templates
            "templates": {
                "empty_state": "Sie haben noch keine Vorlagen. Sie können eine Vorlage erstellen oder ein vorhandenes Projekt als Vorlage speichern.",
                "created_at": "Erstellt am",
                "last_modified": "Zuletzt geändert",
                "edit": "Bearbeiten",
                "delete": "Löschen",
                "make_regular": "In Projekt umwandeln",
                "use_template": "Als Vorlage verwenden"
            },
            
            // Arquivados
            "archived": {
                "empty_state": "Sie haben keine archivierten Projekte.",
                "created_at": "Erstellt am",
                "last_modified": "Zuletzt geändert",
                "edit": "Bearbeiten",
                "delete": "Löschen",
                "unarchive": "Dearchivieren"
            },
            
            // Modal de confirmação de exclusão
            "delete_modal": {
                "title": "Löschen bestätigen",
                "confirm_text": "Sind Sie sicher, dass Sie das Projekt löschen möchten",
                "warning": "Diese Aktion kann nicht rückgängig gemacht werden.",
                "cancel_button": "Abbrechen",
                "delete_button": "Projekt löschen"
            },
            
            // Modal de criação a partir de template
            "new_from_template": {
                "title": "Neues Projekt aus Vorlage",
                "name_label": "Neuer Projektname",
                "description_label": "Beschreibung",
                "template_info": "Basierend auf Vorlage",
                "cancel_button": "Abbrechen",
                "create_button": "Projekt erstellen"
            },
            
            // Modal de projeto criado
            "project_created_modal": {
                "title": "Projekt erstellt",
                "message": "Das Projekt",
                "message_end": "wurde erfolgreich erstellt und ist im Tab \"Meine Projekte\" verfügbar.",
                "ok_button": "OK"
            },
            
            // Card de projeto
            "project_card": {
                "no_description": "Keine Beschreibung",
                "edit_button": "Projekt bearbeiten",
                "created_label": "Erstellt:",
                "updated_label": "Aktualisiert:",
                "edit_button_title": "Bearbeiten",
                "archive_button_title": "Archivieren",
                "delete_button_title": "Löschen",
                "unarchive_button_title": "Dearchivieren",
                "use_template_button_title": "Als Vorlage verwenden"
            },
            
            // Carregamento
            "loading": "Wird geladen...",
            
            // Mensagens de sucesso
            "success": {
                "project_created": "Projekt erfolgreich erstellt",
                "project_updated": "Projekt erfolgreich aktualisiert",
                "project_deleted": "Projekt erfolgreich gelöscht",
                "project_archived": "Projekt erfolgreich archiviert",
                "project_unarchived": "Projekt erfolgreich dearchiviert",
                "template_created": "Vorlage erfolgreich erstellt",
                "project_copied": "Projekt erfolgreich in Vorlagen kopiert",
                "projects_updated": "Projekte erfolgreich aktualisiert"
            },
            
            // Mensagens de erro
            "error": {
                "load_projects": "Fehler beim Laden der Projekte. Bitte versuchen Sie es erneut.",
                "create_project": "Fehler beim Erstellen des Projekts. Bitte versuchen Sie es erneut.",
                "update_project": "Fehler beim Aktualisieren des Projekts. Bitte versuchen Sie es erneut.",
                "delete_project": "Fehler beim Löschen des Projekts. Bitte versuchen Sie es erneut.",
                "archive_project": "Fehler beim Archivieren des Projekts. Bitte versuchen Sie es erneut.",
                "unarchive_project": "Fehler beim Dearchivieren des Projekts. Bitte versuchen Sie es erneut.",
                "load_dashboard": "Fehler beim Laden des Dashboards. Bitte laden Sie die Seite neu."
            }
        }
    };
} 