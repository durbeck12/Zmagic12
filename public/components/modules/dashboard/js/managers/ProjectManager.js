import SupabaseConfig from '../utils/SupabaseClient.js';

class ProjectManager {
    constructor() {
        this.supabase = SupabaseConfig.getClient();
        this.projects = [];
        this.userData = null;
        this.uiManager = null;
        this.initEventListeners();
    }

    setUIManager(uiManager) {
        this.uiManager = uiManager;
    }

    initEventListeners() {
        // Ouvir evento de novo projeto do UIManager
        document.addEventListener('newProject', async (event) => {
            console.log('Evento newProject recebido:', event.detail);
            const projectData = event.detail;
            try {
                const newProject = await this.createProject(projectData);
                console.log('Novo projeto criado:', newProject);
                this.uiManager?.showSuccess('Projeto criado com sucesso', 'dashboard.success.project_created');
            } catch (error) {
                console.error('Erro ao criar projeto:', error);
                this.uiManager?.showError('Erro ao criar projeto. Por favor, tente novamente.');
            }
        });

        // Ouvir eventos de ações em projetos
        document.addEventListener('editProject', async (event) => {
            console.log('Evento editProject recebido:', event.detail);
            const projectData = event.detail;
            try {
                const updatedProject = await this.handleProjectEdit(projectData);
                if (updatedProject.success) {
                    console.log('Projeto atualizado:', updatedProject);
                    this.uiManager?.showSuccess(updatedProject.message, 'dashboard.success.project_updated');
                    // Disparar evento de atualização
                    document.dispatchEvent(new CustomEvent('projectUpdated', { 
                        detail: updatedProject.data 
                    }));
                } else {
                    throw new Error(updatedProject.message);
                }
            } catch (error) {
                console.error('Erro ao editar projeto:', error);
                this.uiManager?.showError('Erro ao editar projeto. Por favor, tente novamente.');
            }
        });

        document.addEventListener('useTemplate', async (event) => {
            console.log('Evento useTemplate recebido:', event.detail);
            const template = event.detail;
            try {
                // Criar um novo projeto baseado no template
                const newProject = await this.duplicateProject(template.id);
                console.log('Novo projeto criado a partir do template:', newProject);
            } catch (error) {
                console.error('Erro ao usar template:', error);
                this.uiManager?.showError(`Erro ao usar template: ${error.message}`);
            }
        });

        document.addEventListener('deleteProject', async (event) => {
            console.log('Evento deleteProject recebido:', event.detail);
            const { id, silent } = event.detail;
            try {
                await this.deleteProject(id);
                console.log('Projeto excluído com sucesso:', id);
                
                // Mostrar mensagem de sucesso apenas se não for silencioso
                if (!silent) {
                    this.uiManager?.showSuccess('Projeto excluído com sucesso', 'dashboard.success.project_deleted');
                }
                
                // Remover da lista local
                this.projects = this.projects.filter(project => project.id !== id);
                
                // Disparar evento para notificar outros componentes
                const event = new CustomEvent('projectDeleted', { detail: { id } });
                document.dispatchEvent(event);
            } catch (error) {
                console.error('Erro ao excluir projeto:', error);
                // Mostrar erro apenas se não for silencioso
                if (!silent) {
                    this.uiManager?.showError('Erro ao excluir projeto. Por favor, tente novamente.');
                }
            }
        });

        document.addEventListener('archiveProject', async (event) => {
            console.log('Evento archiveProject recebido:', event.detail);
            const project = event.detail;
            try {
                const updatedProject = await this.toggleProjectArchiveState(project.id);
                console.log('Estado de arquivo do projeto alterado:', updatedProject);
                
                // O evento projectArchiveToggled é disparado dentro do método toggleProjectArchiveState
            } catch (error) {
                console.error('Erro ao arquivar/desarquivar projeto:', error);
                this.uiManager?.showError('Erro ao alterar estado do projeto. Por favor, tente novamente.');
            }
        });

        document.addEventListener('unarchiveProject', async (event) => {
            console.log('Evento unarchiveProject recebido:', event.detail);
            const project = event.detail;
            try {
                const updatedProject = await this.toggleProjectArchiveState(project.id);
                console.log('Estado de arquivo do projeto alterado:', updatedProject);
                
                // O evento projectArchiveToggled é disparado dentro do método toggleProjectArchiveState
            } catch (error) {
                console.error('Erro ao arquivar/desarquivar projeto:', error);
                this.uiManager?.showError('Erro ao alterar estado do projeto. Por favor, tente novamente.');
            }
        });

        // Novo listener para copiar projeto para templates
        document.addEventListener('copyToTemplate', async (event) => {
            console.log('Evento copyToTemplate recebido:', event.detail);
            const { projectId } = event.detail;
            try {
                await this.copyProjectToTemplate(projectId);
                console.log('Projeto copiado para templates com sucesso:', projectId);
                // O evento forceReloadAllProjects será disparado para atualizar a UI
            } catch (error) {
                console.error('Erro ao copiar projeto para templates:', error);
                this.uiManager?.showError('Erro ao copiar para templates. Por favor, tente novamente.');
            }
        });

        // Escutar eventos de alteração para atualizar a UI
        document.addEventListener('projectDeleted', (event) => {
            const { id } = event.detail;
            // Remover o projeto da lista local
            this.projects = this.projects.filter(project => project.id !== id);
        });
    }

    async loadUserProjects(userId, forceReload = false) {
        console.log(`[ProjectManager] Carregando projetos ativos para usuário: ${userId}${forceReload ? ' (forçando recarga)' : ''}`);
        
        try {
            // Se já temos projetos em cache e não estamos forçando recarga, retornar os projetos em cache
            if (this.projects.length > 0 && !forceReload) {
                const activeProjects = this.projects.filter(project => 
                    !project.archived_proj && !project.template_proj);
                console.log(`[ProjectManager] Retornando ${activeProjects.length} projetos ativos do cache`);
                return activeProjects;
            }
            
            // Buscar todos os projetos não arquivados e não templates
            console.log('[ProjectManager] Buscando projetos ativos do servidor...');
            const { data: projects, error } = await this.supabase
                .from('projects')
                .select('*')
                .eq('user_id', userId)
                .eq('archived_proj', false)
                .eq('template_proj', false)
                .order('updated_at', { ascending: false });
            
            if (error) {
                console.error('[ProjectManager] Erro ao carregar projetos ativos:', error);
                throw error;
            }
            
            // Se forceReload, atualizar o cache
            if (forceReload) {
                // Atualizar apenas os projetos ativos no cache
                const otherProjects = this.projects.filter(project => 
                    project.archived_proj || project.template_proj);
                
                this.projects = [...projects, ...otherProjects];
                console.log(`[ProjectManager] Cache atualizado com ${projects.length} projetos ativos`);
            } else {
                // Guardar em cache apenas se for a primeira carga
                if (this.projects.length === 0) {
                    this.projects = projects;
                    console.log(`[ProjectManager] Projetos salvos em cache: ${projects.length}`);
                }
            }
            
            console.log(`[ProjectManager] Retornando ${projects.length} projetos ativos`);
            return projects;
        } catch (error) {
            console.error('[ProjectManager] Erro ao carregar projetos ativos:', error);
            throw error;
        }
    }

    async updateProject(projectId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('projects')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }

    async deleteProject(projectId) {
        try {
            const { error } = await this.supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }

    async loadArchivedProjects(userId, forceReload = false) {
        console.log(`[ProjectManager] Carregando projetos arquivados para usuário: ${userId}${forceReload ? ' (forçando recarga)' : ''}`);
        
        try {
            // Buscar todos os projetos arquivados diretamente do servidor para garantir dados completos
            console.log('[ProjectManager] Buscando projetos arquivados do servidor...');
            const { data: archivedProjects, error } = await this.supabase
                .from('projects')
                .select('*')
                .eq('user_id', userId)
                .eq('archived_proj', true)
                .eq('template_proj', false)
                .order('updated_at', { ascending: false });
            
            if (error) {
                console.error('[ProjectManager] Erro ao carregar projetos arquivados:', error);
                throw error;
            }
            
            // Atualizar o cache sempre para manter sincronizado com o servidor
            // Manter os outros tipos de projetos no cache
            const otherProjects = this.projects.filter(project => 
                !project.archived_proj || project.template_proj);
                
            this.projects = [...otherProjects, ...archivedProjects];
            console.log(`[ProjectManager] Cache atualizado com ${archivedProjects.length} projetos arquivados`);
            
            console.log(`[ProjectManager] Retornando ${archivedProjects.length} projetos arquivados`);
            return archivedProjects;
        } catch (error) {
            console.error('[ProjectManager] Erro ao carregar projetos arquivados:', error);
            throw error;
        }
    }

    async loadTemplates(userId, forceReload = false) {
        console.log(`[ProjectManager] Carregando templates para usuário: ${userId}${forceReload ? ' (forçando recarga)' : ''}`);
        
        try {
            // Se não estamos forçando recarga, verificar se já temos templates em cache
            if (!forceReload) {
                const templates = this.projects.filter(project => project.template_proj);
                    
                if (templates.length > 0) {
                    console.log(`[ProjectManager] Retornando ${templates.length} templates do cache`);
                    return templates;
                }
            }
            
            // Buscar todos os templates
            console.log('[ProjectManager] Buscando templates do servidor...');
            const { data: templates, error } = await this.supabase
                .from('projects')
                .select('*')
                .eq('user_id', userId)
                .eq('template_proj', true)
                .order('updated_at', { ascending: false });
            
            if (error) {
                console.error('[ProjectManager] Erro ao carregar templates:', error);
                throw error;
            }
            
            // Atualizar o cache se necessário
            if (forceReload) {
                // Manter os outros tipos de projetos no cache
                const otherProjects = this.projects.filter(project => !project.template_proj);
                    
                this.projects = [...otherProjects, ...templates];
                console.log(`[ProjectManager] Cache atualizado com ${templates.length} templates`);
            } else {
                // Adicionar ao cache se ainda não existirem
                const existingIds = new Set(this.projects.map(p => p.id));
                const newTemplates = templates.filter(p => !existingIds.has(p.id));
                
                if (newTemplates.length > 0) {
                    this.projects = [...this.projects, ...newTemplates];
                    console.log(`[ProjectManager] Adicionados ${newTemplates.length} novos templates ao cache`);
                }
            }
            
            console.log(`[ProjectManager] Retornando ${templates.length} templates`);
            return templates;
        } catch (error) {
            console.error('[ProjectManager] Erro ao carregar templates:', error);
            throw error;
        }
    }

    async handleProjectEdit(projectData) {
        console.log('Iniciando edição do projeto:', projectData);
        try {
            // 0. Validar dados de entrada
            if (!projectData || !projectData.id) {
                console.error('Dados do projeto inválidos:', projectData);
                throw new Error('Dados do projeto inválidos');
            }

            // 1. Buscar dados atuais para backup
            console.log('Buscando dados atuais do projeto...');
            const { data: currentData, error: fetchError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('id', projectData.id)
                .single();

            if (fetchError) {
                console.error('Erro ao buscar dados atuais:', fetchError);
                throw fetchError;
            }

            if (!currentData) {
                console.error('Projeto não encontrado');
                throw new Error('Projeto não encontrado no banco de dados');
            }

            // 2. Fazer o update
            console.log('Atualizando projeto no Supabase...');
            const { error: updateError } = await this.supabase
                .from('projects')
                .update({
                    internal_name: projectData.internal_name.trim(),
                    internal_description: projectData.internal_description?.trim() || '',
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectData.id);

            if (updateError) {
                console.error('Erro ao atualizar projeto no Supabase:', updateError);
                throw updateError;
            }

            // 3. Buscar dados atualizados
            console.log('Buscando dados atualizados...');
            const { data: updatedData, error: fetchUpdatedError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('id', projectData.id)
                .single();

            if (fetchUpdatedError) {
                console.error('Erro ao buscar projeto atualizado:', fetchUpdatedError);
                throw fetchUpdatedError;
            }

            if (!updatedData) {
                console.error('Nenhum dado retornado após atualização');
                throw new Error('Falha ao atualizar projeto - nenhum dado retornado');
            }

            // 4. Validar dados atualizados
            if (!this.validateProjectData(updatedData)) {
                console.error('Dados atualizados inválidos:', updatedData);
                throw new Error('Dados atualizados inválidos');
            }

            console.log('Projeto atualizado com sucesso:', updatedData);

            // 5. Atualizar lista local e cache
            this.updateLocalProjectData(updatedData);

            // 6. Disparar evento de atualização
            console.log('Disparando evento projectUpdated com os dados atualizados');
            document.dispatchEvent(new CustomEvent('projectUpdated', { 
                detail: updatedData 
            }));

            return {
                success: true,
                message: 'Projeto atualizado com sucesso',
                data: updatedData
            };
        } catch (error) {
            console.error('Erro completo ao atualizar projeto:', error);
            if (this.uiManager) {
                this.uiManager.showError(error.message || 'Erro ao atualizar projeto');
            }
            return {
                success: false,
                message: error.message || 'Erro ao atualizar projeto'
            };
        }
    }

    validateProjectData(data) {
        return data && 
               data.id && 
               data.internal_name && 
               typeof data.archived_proj === 'boolean' &&
               typeof data.template_proj === 'boolean' &&
               data.updated_at;
    }

    updateLocalProjectData(updatedData) {
        console.log('Atualizando dados locais do projeto:', updatedData.id);
        
        // Atualizar na lista principal
        const index = this.projects.findIndex(p => p.id === updatedData.id);
        if (index !== -1) {
            console.log('Atualizando projeto na lista local, índice:', index);
            this.projects[index] = updatedData;
        } else {
            console.log('Projeto não encontrado na lista local, adicionando...');
            this.projects.push(updatedData);
        }

        // Atualizar em outras listas se necessário
        if (this.archivedProjects) {
            const archivedIndex = this.archivedProjects.findIndex(p => p.id === updatedData.id);
            if (archivedIndex !== -1) {
                this.archivedProjects[archivedIndex] = updatedData;
            }
        }

        if (this.templateProjects) {
            const templateIndex = this.templateProjects.findIndex(p => p.id === updatedData.id);
            if (templateIndex !== -1) {
                this.templateProjects[templateIndex] = updatedData;
            }
        }
    }

    async createProject(projectData) {
        try {
            if (!this.userData?.id) throw new Error('User ID is required');

            const { data, error } = await this.supabase
                .from('projects')
                .insert([{
                    user_id: this.userData.id,
                    internal_name: projectData.internal_name,
                    internal_description: projectData.internal_description || '',
                    template_proj: projectData.template_proj || false,
                    archived_proj: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            
            // Atualizar lista de projetos se estiver na tab correta
            const event = new CustomEvent('projectCreated', { detail: data });
            document.dispatchEvent(event);
            
            return data;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    async toggleProjectArchiveState(projectId) {
        // Esse método é um alias para toggleArchiveProject
        // para manter a compatibilidade após alterações recentes
        console.log('[ProjectManager] Chamando toggleArchiveProject via toggleProjectArchiveState');
        return this.toggleArchiveProject(projectId);
    }

    async toggleArchiveProject(projectId) {
        let projectData = null;
        try {
            // 1. Buscar dados atuais
            console.log('Buscando projeto:', projectId);
            const { data: currentData, error: fetchError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (fetchError) {
                console.error('Erro ao buscar projeto:', fetchError);
                throw fetchError;
            }
            if (!currentData) {
                console.error('Projeto não encontrado');
                throw new Error('Projeto não encontrado no banco de dados');
            }
            
            console.log('Projeto encontrado:', currentData);
            projectData = currentData;

            // 2. Atualizar o status de arquivo
            const newArchivedStatus = !projectData.archived_proj;
            console.log('Atualizando status para:', newArchivedStatus);
            
            // Primeiro fazemos o update
            const { error: updateError } = await this.supabase
                .from('projects')
                .update({
                    archived_proj: newArchivedStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId);

            if (updateError) {
                console.error('Erro ao atualizar projeto:', updateError);
                throw updateError;
            }

            // Depois buscamos os dados atualizados
            const { data: updatedData, error: fetchUpdatedError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (fetchUpdatedError) {
                console.error('Erro ao buscar projeto atualizado:', fetchUpdatedError);
                throw fetchUpdatedError;
            }

            if (!updatedData) {
                console.error('Nenhum dado retornado após atualização');
                throw new Error('Falha ao atualizar projeto - nenhum dado retornado');
            }

            console.log('Projeto atualizado:', updatedData);

            // 3. Atualizar lista local
            const index = this.projects.findIndex(p => p.id === projectId);
            if (index !== -1) {
                this.projects[index] = updatedData;
            }

            // Mostrar mensagem de sucesso usando a chave i18n apropriada
            if (newArchivedStatus) {
                console.log('[ARCHIVE] Mostrando mensagem de arquivamento com a chave: dashboard.success.project_archived');
                this.uiManager?.showSuccess('', 'dashboard.success.project_archived');
            } else {
                console.log('[UNARCHIVE] Mostrando mensagem de desarquivamento com a chave: dashboard.success.project_unarchived');
                this.uiManager?.showSuccess('', 'dashboard.success.project_unarchived');
            }

            // 4. Disparar evento
            const event = new CustomEvent('projectArchiveToggled', { 
                detail: updatedData
            });
            document.dispatchEvent(event);

            return updatedData;
        } catch (error) {
            console.error('Error toggling project archive state:', error);
            
            // 5. Em caso de erro, usar dados originais para manter UI consistente
            if (projectData) {
                const event = new CustomEvent('projectArchiveToggled', { 
                    detail: {
                        ...projectData,
                        archived_proj: !projectData.archived_proj
                    }
                });
                document.dispatchEvent(event);
            }
            throw error;
        }
    }

    async toggleTemplateProject(projectId) {
        try {
            // Primeiro, buscar o projeto diretamente do banco de dados
            const { data: projectData, error: fetchError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (fetchError) throw fetchError;
            if (!projectData) throw new Error('Projeto não encontrado no banco de dados');

            // Atualizar o status de template
            const { data, error } = await this.supabase
                .from('projects')
                .update({
                    template_proj: !projectData.template_proj,
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId)
                .select()
                .single();

            if (error) throw error;

            // Atualizar lista local se o projeto estiver nela
            const index = this.projects.findIndex(p => p.id === projectId);
            if (index !== -1) {
                this.projects[index] = data;
            }

            // Disparar evento de atualização
            const event = new CustomEvent('projectTemplateToggled', { detail: data });
            document.dispatchEvent(event);

            return data;
        } catch (error) {
            console.error('Error toggling project template state:', error);
            throw error;
        }
    }

    async duplicateProject(projectId) {
        console.log('[DUPLICATE] Iniciando processo de duplicação para template:', projectId);
        try {
            // 1. Buscar template
            const { data: templateProjectData, error: templateError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (templateError || !templateProjectData) {
                console.error('[DUPLICATE ERRO] Template não encontrado:', templateError);
                throw new Error('Template não encontrado ou dados inválidos');
            }

            console.log('[DUPLICATE] Template encontrado:', templateProjectData);

            // Verificar se o usuário está autenticado
            if (!this.userData?.id) {
                console.error('[DUPLICATE ERRO] ID do usuário não encontrado');
                throw new Error('Usuário não autenticado');
            }

            // 2. Filtrar campos do template - Remover explicitamente todos os campos que não devem ser copiados
            const { 
                id, 
                created_at, 
                updated_at,
                ...cleanTemplate 
            } = templateProjectData;

            // 3. Preparar novo projeto com todos os campos necessários
            const newProjectData = {
                ...cleanTemplate,
                user_id: this.userData.id,
                internal_name: `${templateProjectData.internal_name} (Cópia)`,
                template_proj: false,
                archived_proj: false
                // Não incluir created_at e updated_at para permitir que o Supabase os defina automaticamente
            };

            console.log('[DUPLICATE] Dados preparados:', newProjectData);
            
            // 4. Criar novo projeto no Supabase - Simplificando a query
            console.log('[DUPLICATE] Inserindo no banco de dados...');
            const insertResult = await this.supabase
                .from('projects')
                .insert(newProjectData);
            
            if (insertResult.error) {
                console.error('[DUPLICATE ERRO] Erro ao inserir projeto:', insertResult.error);
                throw new Error(`Falha ao criar projeto: ${insertResult.error.message}`);
            }
            
            console.log('[DUPLICATE] Projeto inserido, buscando dados...');
            
            // 5. Buscar o projeto recém-criado (já que insert pode não retornar os dados completos)
            const { data: newProject, error: fetchError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('user_id', this.userData.id)
                .eq('internal_name', `${templateProjectData.internal_name} (Cópia)`)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (fetchError) {
                console.error('[DUPLICATE ERRO] Erro ao buscar projeto criado:', fetchError);
                throw new Error(`Falha ao recuperar projeto criado: ${fetchError.message}`);
            }

            if (!newProject) {
                console.error('[DUPLICATE ERRO] Projeto criado não encontrado na consulta');
                throw new Error('Falha ao criar projeto: projeto não encontrado após criação');
            }

            console.log('[DUPLICATE] Novo projeto encontrado:', newProject);

            // 6. Atualizar lista local
            this.projects = [newProject, ...this.projects];
            console.log('[DUPLICATE] Projeto adicionado à lista local');

            // 7. Mostrar modal de edição - Não mudamos de tab aqui, 
            // pois isso será controlado pelo modal dependendo da ação do usuário
            console.log('[DUPLICATE] Abrindo modal de edição...');
            const modalEvent = new CustomEvent('showNewFromTemplate', {
                detail: {
                    newProject,
                    templateProject: templateProjectData
                }
            });
            document.dispatchEvent(modalEvent);

            return newProject;
        } catch (error) {
            console.error('[DUPLICATE ERRO] Falha na duplicação:', error);
            this.uiManager?.showError(`Falha na duplicação: ${error.message}`);
            throw error;
        }
    }

    // Novo método para copiar um projeto como template
    async copyProjectToTemplate(projectId) {
        console.log('[TEMPLATE_COPY] Iniciando cópia do projeto para templates:', projectId);
        try {
            // 1. Buscar projeto original
            const { data: projectData, error: fetchError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (fetchError || !projectData) {
                console.error('[TEMPLATE_COPY] Projeto não encontrado:', fetchError);
                throw new Error('Projeto não encontrado ou dados inválidos');
            }

            console.log('[TEMPLATE_COPY] Projeto encontrado:', projectData);

            // Verificar se o usuário está autenticado
            if (!this.userData?.id) {
                console.error('[TEMPLATE_COPY] ID do usuário não encontrado');
                throw new Error('Usuário não autenticado');
            }

            // 2. Filtrar campos do projeto - Remover explicitamente todos os campos que não devem ser copiados
            const { 
                id, 
                created_at, 
                updated_at,
                ...cleanProject 
            } = projectData;

            // 3. Preparar novo projeto com todos os campos necessários
            const newTemplateData = {
                ...cleanProject,
                user_id: this.userData.id,
                internal_name: `${projectData.internal_name} (Template)`,
                template_proj: true,
                archived_proj: false
            };

            console.log('[TEMPLATE_COPY] Dados preparados:', newTemplateData);
            
            // 4. Criar template no Supabase
            console.log('[TEMPLATE_COPY] Inserindo no banco de dados...');
            const insertResult = await this.supabase
                .from('projects')
                .insert(newTemplateData);
            
            if (insertResult.error) {
                console.error('[TEMPLATE_COPY] Erro ao inserir template:', insertResult.error);
                throw new Error(`Falha ao criar template: ${insertResult.error.message}`);
            }
            
            console.log('[TEMPLATE_COPY] Template inserido, buscando dados...');
            
            // 5. Buscar o template recém-criado
            const { data: newTemplate, error: templateFetchError } = await this.supabase
                .from('projects')
                .select('*')
                .eq('user_id', this.userData.id)
                .eq('internal_name', `${projectData.internal_name} (Template)`)
                .eq('template_proj', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (templateFetchError) {
                console.error('[TEMPLATE_COPY] Erro ao buscar template criado:', templateFetchError);
                throw new Error(`Falha ao recuperar template criado: ${templateFetchError.message}`);
            }

            if (!newTemplate) {
                console.error('[TEMPLATE_COPY] Template criado não encontrado na consulta');
                throw new Error('Falha ao criar template: projeto não encontrado após criação');
            }

            console.log('[TEMPLATE_COPY] Novo template encontrado:', newTemplate);

            // 6. Atualizar lista local
            this.projects = [newTemplate, ...this.projects];
            console.log('[TEMPLATE_COPY] Template adicionado à lista local');

            // 7. Forçar atualização das listas para mostrar o novo template
            document.dispatchEvent(new CustomEvent('forceReloadAllProjects'));
            
            return newTemplate;
        } catch (error) {
            console.error('[TEMPLATE_COPY] Falha na cópia para template:', error);
            this.uiManager?.showError(`Falha ao copiar para template: ${error.message}`);
            throw error;
        }
    }

    /**
     * Busca um projeto específico pelo ID
     * @param {string} projectId - ID do projeto a ser buscado
     * @returns {Object|null} - Objeto do projeto ou null se não encontrado
     */
    getProjectById(projectId) {
        if (!projectId) {
            console.error('[ProjectManager] ID do projeto não fornecido');
            return null;
        }
        
        console.log('[ProjectManager] Buscando projeto por ID:', projectId);
        
        // Verificar primeiro no cache de projetos ativos
        if (this.userProjects) {
            const project = this.userProjects.find(p => p.id === projectId);
            if (project) {
                console.log('[ProjectManager] Projeto encontrado nos projetos ativos');
                return project;
            }
        }
        
        // Verificar em projetos arquivados
        if (this.archivedProjects) {
            const project = this.archivedProjects.find(p => p.id === projectId);
            if (project) {
                console.log('[ProjectManager] Projeto encontrado nos projetos arquivados');
                return project;
            }
        }
        
        // Verificar em templates
        if (this.templates) {
            const project = this.templates.find(p => p.id === projectId);
            if (project) {
                console.log('[ProjectManager] Projeto encontrado nos templates');
                return project;
            }
        }
        
        console.log('[ProjectManager] Projeto não encontrado com ID:', projectId);
        return null;
    }
}

export default ProjectManager; 