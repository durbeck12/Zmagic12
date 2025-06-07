// Verifica si la variable ya existe para evitar redeclaración
if (typeof window.es_ES === 'undefined') {
    window.es_ES = {
        // Dashboard
        "dashboard": {
            // Cabecera
            "header": {
                "new_project": "Nuevo Proyecto"
            },
            
            // Pestañas
            "tabs": {
                "projects": "Mis Proyectos",
                "archived": "Archivados",
                "templates": "Plantillas"
            },
            
            // Modal de nuevo proyecto
            "new_project_modal": {
                "title": "Nuevo Proyecto",
                "name_label": "Nombre del Proyecto",
                "description_label": "Descripción",
                "create_as_template": "Crear como plantilla",
                "cancel_button": "Cancelar",
                "create_button": "Crear Proyecto"
            },
            
            // Modal de edición de proyecto
            "edit_project_modal": {
                "title": "Editar Proyecto",
                "name_label": "Nombre del Proyecto",
                "description_label": "Descripción",
                "cancel_button": "Cancelar",
                "save_button": "Guardar Cambios"
            },
            
            // Proyectos
            "projects": {
                "empty_state": "Aún no tienes proyectos. Haz clic en 'Nuevo Proyecto' para comenzar.",
                "created_at": "Creado el",
                "last_modified": "Última modificación",
                "edit": "Editar",
                "delete": "Eliminar",
                "archive": "Archivar",
                "unarchive": "Desarchivar",
                "open": "Abrir",
                "make_template": "Copiar a Plantillas",
                "use_template": "Usar como Plantilla"
            },
            
            // Plantillas
            "templates": {
                "empty_state": "Aún no tienes plantillas. Puedes crear una plantilla o guardar un proyecto existente como plantilla.",
                "created_at": "Creada el",
                "last_modified": "Última modificación",
                "edit": "Editar",
                "delete": "Eliminar",
                "make_regular": "Convertir a Proyecto",
                "use_template": "Usar como Plantilla"
            },
            
            // Archivados
            "archived": {
                "empty_state": "No tienes proyectos archivados.",
                "created_at": "Creado el",
                "last_modified": "Última modificación",
                "edit": "Editar",
                "delete": "Eliminar",
                "unarchive": "Desarchivar"
            },
            
            // Modal de confirmación de eliminación
            "delete_modal": {
                "title": "Confirmar Eliminación",
                "confirm_text": "¿Estás seguro de que deseas eliminar el proyecto",
                "warning": "Esta acción no se puede deshacer.",
                "cancel_button": "Cancelar",
                "delete_button": "Eliminar Proyecto"
            },
            
            // Modal de creación a partir de plantilla
            "new_from_template": {
                "title": "Nuevo Proyecto desde Plantilla",
                "name_label": "Nombre del Nuevo Proyecto",
                "description_label": "Descripción",
                "template_info": "Basado en la plantilla",
                "cancel_button": "Cancelar",
                "create_button": "Crear Proyecto"
            },
            
            // Modal de proyecto creado
            "project_created_modal": {
                "title": "Proyecto Creado",
                "message": "El proyecto",
                "message_end": "ha sido creado exitosamente y está disponible en la pestaña \"Mis Proyectos\".",
                "ok_button": "Aceptar"
            },
            
            // Tarjeta de proyecto
            "project_card": {
                "no_description": "Sin descripción",
                "edit_button": "Editar Proyecto",
                "created_label": "Creado:",
                "updated_label": "Actualizado:",
                "edit_button_title": "Editar",
                "archive_button_title": "Archivar",
                "delete_button_title": "Eliminar",
                "unarchive_button_title": "Desarchivar",
                "use_template_button_title": "Usar Plantilla"
            },
            
            // Cargando
            "loading": "Cargando...",
            
            // Mensajes de éxito
            "success": {
                "project_created": "Proyecto creado exitosamente",
                "project_updated": "Proyecto actualizado exitosamente",
                "project_deleted": "Proyecto eliminado exitosamente",
                "project_archived": "Proyecto archivado exitosamente",
                "project_unarchived": "Proyecto desarchivado exitosamente",
                "template_created": "Plantilla creada exitosamente",
                "project_copied": "Proyecto copiado a Plantillas exitosamente",
                "projects_updated": "Proyectos actualizados exitosamente"
            },
            
            // Mensajes de error
            "error": {
                "load_projects": "Error al cargar proyectos. Por favor, inténtalo de nuevo.",
                "create_project": "Error al crear el proyecto. Por favor, inténtalo de nuevo.",
                "update_project": "Error al actualizar el proyecto. Por favor, inténtalo de nuevo.",
                "delete_project": "Error al eliminar el proyecto. Por favor, inténtalo de nuevo.",
                "archive_project": "Error al archivar el proyecto. Por favor, inténtalo de nuevo.",
                "unarchive_project": "Error al desarchivar el proyecto. Por favor, inténtalo de nuevo.",
                "load_dashboard": "Error al cargar el dashboard. Por favor, recarga la página."
            }
        }
    };
}
