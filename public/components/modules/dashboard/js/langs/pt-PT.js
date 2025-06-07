// Verifica se a variável já existe para evitar redeclaração
if (typeof window.pt_PT === 'undefined') {
    window.pt_PT = {
        // Dashboard
        "dashboard": {
            // Cabeçalho
            "header": {
                "new_project": "Novo Projecto"
            },
            
            // Separadores
            "tabs": {
                "projects": "Os Meus Projectos",
                "archived": "Arquivados",
                "templates": "Modelos"
            },
            
            // Modal de novo projecto
            "new_project_modal": {
                "title": "Novo Projecto",
                "name_label": "Nome do Projecto",
                "description_label": "Descrição",
                "create_as_template": "Criar como modelo",
                "cancel_button": "Cancelar",
                "create_button": "Criar Projecto"
            },
            
            // Modal de edição de projecto
            "edit_project_modal": {
                "title": "Editar Projecto",
                "name_label": "Nome do Projecto",
                "description_label": "Descrição",
                "cancel_button": "Cancelar",
                "save_button": "Guardar Alterações"
            },
            
            // Projectos
            "projects": {
                "empty_state": "Ainda não tem projectos. Clique em 'Novo Projecto' para começar.",
                "created_at": "Criado em",
                "last_modified": "Última modificação",
                "edit": "Editar",
                "delete": "Eliminar",
                "archive": "Arquivar",
                "unarchive": "Desarquivar",
                "open": "Abrir",
                "make_template": "Copiar para Modelos",
                "use_template": "Usar como Modelo"
            },
            
            // Modelos
            "templates": {
                "empty_state": "Ainda não tem modelos. Pode criar um modelo ou guardar um projecto existente como modelo.",
                "created_at": "Criado em",
                "last_modified": "Última modificação",
                "edit": "Editar",
                "delete": "Eliminar",
                "make_regular": "Converter para Projecto",
                "use_template": "Usar como Modelo"
            },
            
            // Arquivados
            "archived": {
                "empty_state": "Não tem projectos arquivados.",
                "created_at": "Criado em",
                "last_modified": "Última modificação",
                "edit": "Editar",
                "delete": "Eliminar",
                "unarchive": "Desarquivar"
            },
            
            // Modal de confirmação de eliminação
            "delete_modal": {
                "title": "Confirmar Eliminação",
                "confirm_text": "Tem a certeza de que deseja eliminar o projecto",
                "warning": "Esta acção não pode ser desfeita.",
                "cancel_button": "Cancelar",
                "delete_button": "Eliminar Projecto"
            },
            
            // Modal de criação a partir de modelo
            "new_from_template": {
                "title": "Novo Projecto a partir de Modelo",
                "name_label": "Nome do Novo Projecto",
                "description_label": "Descrição",
                "template_info": "Baseado no modelo",
                "cancel_button": "Cancelar",
                "create_button": "Criar Projecto"
            },
            
            // Modal de projecto criado
            "project_created_modal": {
                "title": "Projecto Criado",
                "message": "O projecto",
                "message_end": "foi criado com sucesso e está disponível no separador \"Os Meus Projectos\".",
                "ok_button": "OK"
            },
            
            // Cartão de projecto
            "project_card": {
                "no_description": "Sem descrição",
                "edit_button": "Editar Projecto",
                "created_label": "Criado:",
                "updated_label": "Actualizado:",
                "edit_button_title": "Editar",
                "archive_button_title": "Arquivar",
                "delete_button_title": "Eliminar",
                "unarchive_button_title": "Desarquivar",
                "use_template_button_title": "Usar Modelo"
            },
            
            // Carregamento
            "loading": "A carregar...",
            
            // Mensagens de sucesso
            "success": {
                "project_created": "Projecto criado com sucesso",
                "project_updated": "Projecto actualizado com sucesso",
                "project_deleted": "Projecto eliminado com sucesso",
                "project_archived": "Projecto arquivado com sucesso",
                "project_unarchived": "Projecto desarquivado com sucesso",
                "template_created": "Modelo criado com sucesso",
                "project_copied": "Projecto copiado para Modelos com sucesso",
                "projects_updated": "Projectos actualizados com sucesso"
            },
            
            // Mensagens de erro
            "error": {
                "load_projects": "Erro ao carregar projectos. Por favor, tente novamente.",
                "create_project": "Erro ao criar projecto. Por favor, tente novamente.",
                "update_project": "Erro ao actualizar projecto. Por favor, tente novamente.",
                "delete_project": "Erro ao eliminar projecto. Por favor, tente novamente.",
                "archive_project": "Erro ao arquivar projecto. Por favor, tente novamente.",
                "unarchive_project": "Erro ao desarquivar projecto. Por favor, tente novamente.",
                "load_dashboard": "Erro ao carregar o painel de controlo. Por favor, recarregue a página."
            }
        }
    };
} 