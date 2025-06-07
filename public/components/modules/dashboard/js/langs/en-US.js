// Verifica se a variável já existe para evitar redeclaração
if (typeof window.en_US === 'undefined') {
    window.en_US = {
        // Dashboard
        "dashboard": {
            // Cabeçalho
            "header": {
                "new_project": "New Project"
            },
            
            // Tabs
            "tabs": {
                "projects": "My Projects",
                "archived": "Archived",
                "templates": "Templates"
            },
            
            // Modal de novo projeto
            "new_project_modal": {
                "title": "New Project",
                "name_label": "Project Name",
                "description_label": "Description",
                "create_as_template": "Create as template",
                "cancel_button": "Cancel",
                "create_button": "Create Project"
            },
            
            // Modal de edição de projeto
            "edit_project_modal": {
                "title": "Edit Project",
                "name_label": "Project Name",
                "description_label": "Description",
                "cancel_button": "Cancel",
                "save_button": "Save Changes"
            },
            
            // Projetos
            "projects": {
                "empty_state": "You don't have any projects yet. Click 'New Project' to get started.",
                "created_at": "Created on",
                "last_modified": "Last modified",
                "edit": "Edit",
                "delete": "Delete",
                "archive": "Archive",
                "unarchive": "Unarchive",
                "open": "Open",
                "make_template": "Copy to Templates",
                "use_template": "Use as Template"
            },
            
            // Templates
            "templates": {
                "empty_state": "You don't have any templates yet. You can create a template or save an existing project as a template.",
                "created_at": "Created on",
                "last_modified": "Last modified",
                "edit": "Edit",
                "delete": "Delete",
                "make_regular": "Convert to Project",
                "use_template": "Use as Template"
            },
            
            // Arquivados
            "archived": {
                "empty_state": "You don't have any archived projects.",
                "created_at": "Created on",
                "last_modified": "Last modified",
                "edit": "Edit",
                "delete": "Delete",
                "unarchive": "Unarchive"
            },
            
            // Modal de confirmação de exclusão
            "delete_modal": {
                "title": "Confirm Deletion",
                "confirm_text": "Are you sure you want to delete the project",
                "warning": "This action cannot be undone.",
                "cancel_button": "Cancel",
                "delete_button": "Delete Project"
            },
            
            // Modal de criação a partir de template
            "new_from_template": {
                "title": "New Project from Template",
                "name_label": "New Project Name",
                "description_label": "Description",
                "template_info": "Based on template",
                "cancel_button": "Cancel",
                "create_button": "Create Project"
            },
            
            // Modal de projeto criado
            "project_created_modal": {
                "title": "Project Created",
                "message": "The project",
                "message_end": "has been successfully created and is available in the \"My Projects\" tab.",
                "ok_button": "OK"
            },
            
            // Card de projeto
            "project_card": {
                "no_description": "No description",
                "edit_button": "Edit Project",
                "created_label": "Created:",
                "updated_label": "Updated:",
                "edit_button_title": "Edit",
                "archive_button_title": "Archive",
                "delete_button_title": "Delete",
                "unarchive_button_title": "Unarchive",
                "use_template_button_title": "Use Template"
            },
            
            // Carregamento
            "loading": "Loading...",
            
            // Mensagens de sucesso
            "success": {
                "project_created": "Project created successfully",
                "project_updated": "Project updated successfully",
                "project_deleted": "Project deleted successfully",
                "project_archived": "Project archived successfully",
                "project_unarchived": "Project unarchived successfully",
                "template_created": "Template created successfully",
                "project_copied": "Project copied to Templates successfully",
                "projects_updated": "Projects updated successfully"
            },
            
            // Mensagens de erro
            "error": {
                "load_projects": "Error loading projects. Please try again.",
                "create_project": "Error creating project. Please try again.",
                "update_project": "Error updating project. Please try again.",
                "delete_project": "Error deleting project. Please try again.",
                "archive_project": "Error archiving project. Please try again.",
                "unarchive_project": "Error unarchiving project. Please try again.",
                "load_dashboard": "Error loading dashboard. Please reload the page."
            }
        }
    };
} 