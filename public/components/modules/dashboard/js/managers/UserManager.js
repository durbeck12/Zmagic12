import SupabaseConfig from '../utils/SupabaseClient.js';

class UserManager {
    constructor() {
        this.supabase = SupabaseConfig.getClient();
        this.userData = null;
        this.profilesTableExists = false; // Flag para controlar se a tabela profiles existe
        this.initEventListeners();
        
        // Verificar se a tabela profiles existe
        this.checkProfilesTable();
    }
    
    /**
     * Verifica se a tabela profiles existe no banco de dados
     */
    async checkProfilesTable() {
        try {
            console.log('[UserManager] Verificando se a tabela profiles existe...');
            
            // Tentativa de uma consulta simples para verificar a existência da tabela
            const { data, error } = await this.supabase
                .from('profiles')
                .select('count')
                .limit(1);
            
            // Se não houver erro, a tabela existe
            if (!error) {
                console.log('[UserManager] Tabela profiles existe e está acessível');
                this.profilesTableExists = true;
            } else {
                // Se o erro for porque a tabela não existe
                if (error.code === '42P01') { // código PostgreSQL para "tabela não existe"
                    console.warn('[UserManager] Tabela profiles não existe no banco de dados');
                    this.profilesTableExists = false;
                } else {
                    // Outro tipo de erro (permissões, etc)
                    console.error('[UserManager] Erro ao verificar tabela profiles:', error);
                    this.profilesTableExists = false;
                }
            }
        } catch (error) {
            console.error('[UserManager] Exceção ao verificar tabela profiles:', error);
            this.profilesTableExists = false;
        }
    }

    initEventListeners() {
        // Ouvir mudanças na autenticação
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                this.userData = null;
                window.location.href = '/login';
            } else if (event === 'SIGNED_IN') {
                this.getCurrentUser();
            }
        });
    }

    /**
     * Obtém dados do usuário atual, incluindo informações do perfil quando disponíveis
     * @returns {Promise<Object|null>} Dados completos do usuário ou null se não estiver autenticado
     */
    async getCurrentUser() {
        try {
            // Usar o método interno getAuthUser do SupabaseConfig para obter dados básicos do usuário
            const user = await SupabaseConfig.getAuthUser();
            
            if (!user) return null;

            // Criar userData com dados básicos do usuário
            this.userData = {
                id: user.id,
                email: user.email,
                name: user.email.split('@')[0],
                role: 'user',
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at
            };

            // Só tenta buscar perfil se a tabela existir
            if (this.profilesTableExists) {
                try {
                    // Tente buscar o perfil do usuário com uma query mais simples
                    const { data, error } = await this.supabase
                        .from('profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .limit(1);

                    if (error) {
                        console.warn('[UserManager] Erro ao buscar perfil de usuário:', error);
                    } else if (data && data.length > 0) {
                        const profile = data[0];
                        // Atualize apenas os campos que existem no perfil
                        if (profile.full_name) this.userData.name = profile.full_name;
                        if (profile.avatar_url) this.userData.avatar_url = profile.avatar_url;
                        if (profile.role) this.userData.role = profile.role;
                    } else {
                        // Não tentar criar perfil automaticamente - apenas usar os dados básicos
                        console.log('[UserManager] Perfil não encontrado, usando dados básicos do usuário');
                    }
                } catch (profileError) {
                    console.warn('[UserManager] Erro ao buscar perfil, usando dados básicos do usuário', profileError);
                }
            } else {
                console.log('[UserManager] Tabela profiles não existe, usando apenas dados básicos do usuário');
            }

            // Importante: sempre retorne os dados do usuário mesmo sem perfil
            return this.userData;
        } catch (error) {
            console.error('[UserManager] Error loading user data:', error);
            throw error;
        }
    }

    /**
     * Método para criar perfil manualmente quando necessário
     * Este método não é chamado automaticamente para evitar erros 400
     * Só deve ser usado em seções específicas que exigem perfil completo
     */
    async createDefaultProfile(userId) {
        // Se a tabela não existe, não tenta criar perfil
        if (!this.profilesTableExists) {
            console.warn('[UserManager] Não é possível criar perfil: tabela profiles não existe');
            return false;
        }
    
        try {
            console.log('[UserManager] Tentando criar perfil para usuário:', userId);
            
            // Dados mínimos absolutos (apenas user_id é obrigatório)
            const profileData = {
                user_id: userId
            };
            
            console.log('[UserManager] Dados do perfil a serem inseridos:', profileData);
            
            // Tente criar o perfil com um único campo obrigatório
            const { data, error } = await this.supabase
                .from('profiles')
                .insert(profileData);

            if (error) {
                console.warn('[UserManager] Erro ao criar perfil:', error);
                return false;
            }
            
            console.log('[UserManager] Perfil criado com sucesso');
            return true;
        } catch (error) {
            console.warn('[UserManager] Exceção ao criar perfil:', error);
            return false;
        }
    }

    async updateProfile(updates) {
        // Se a tabela não existe, não tenta atualizar perfil
        if (!this.profilesTableExists) {
            console.warn('[UserManager] Não é possível atualizar perfil: tabela profiles não existe');
            
            // Atualizamos apenas os dados em memória
            if (this.userData) {
                this.userData = {
                    ...this.userData,
                    ...updates
                };
            }
            
            return true;
        }
        
        try {
            if (!this.userData) throw new Error('Usuário não autenticado');

            // Preparar dados básicos com id do usuário
            const profileData = {
                user_id: this.userData.id,
                updated_at: new Date().toISOString(),
                ...updates
            };

            // Usar upsert para criar ou atualizar perfil
            const { data, error } = await this.supabase
                .from('profiles')
                .upsert(profileData, {
                    onConflict: 'user_id',
                    returning: 'minimal'
                });

            if (error) {
                console.error('[UserManager] Erro ao atualizar perfil:', error);
                throw error;
            }

            // Atualizar dados locais
            this.userData = {
                ...this.userData,
                ...updates
            };

            return true;
        } catch (error) {
            console.error('[UserManager] Error updating profile:', error);
            throw error;
        }
    }

    async uploadAvatar(file) {
        try {
            if (!this.userData) throw new Error('Usuário não autenticado');
            if (!file) throw new Error('Nenhum arquivo selecionado');

            const fileExt = file.name.split('.').pop();
            const fileName = `${this.userData.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload do arquivo
            const { error: uploadError } = await this.supabase.storage
                .from('user-content')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Gerar URL pública
            const { data: { publicUrl }, error: urlError } = await this.supabase.storage
                .from('user-content')
                .getPublicUrl(filePath);

            if (urlError) throw urlError;

            // Atualizar perfil com nova URL
            await this.updateProfile({ avatar_url: publicUrl });

            return publicUrl;
        } catch (error) {
            console.error('[UserManager] Error uploading avatar:', error);
            throw error;
        }
    }

    /**
     * Método para desconectar o usuário atual
     * Este é o único método que deve ser usado para fazer logout em toda a aplicação
     * @returns {Promise<boolean>} True se o logout foi bem-sucedido, ou throw error caso contrário
     */
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            this.userData = null;
            console.log('[UserManager] Usuário desconectado com sucesso');
            return true;
        } catch (error) {
            console.error('[UserManager] Error signing out:', error);
            throw error;
        }
    }

    isAuthenticated() {
        return !!this.userData;
    }

    hasRole(role) {
        return this.userData?.role === role;
    }

    getLastActive() {
        return this.userData?.last_sign_in_at 
            ? new Date(this.userData.last_sign_in_at) 
            : null;
    }

    /**
     * Método para garantir que o usuário tenha um perfil completo
     * Pode ser chamado em rotas onde o perfil completo é necessário
     * @returns {boolean} - Se o usuário tem perfil completo
     */
    async ensureUserProfile() {
        // Se a tabela não existe, não podemos garantir um perfil completo
        if (!this.profilesTableExists) {
            console.warn('[UserManager] Não é possível garantir perfil: tabela profiles não existe');
            return false;
        }
        
        if (!this.userData?.id) return false;

        try {
            // Verificar se o usuário já tem perfil
            const { data, error } = await this.supabase
                .from('profiles')
                .select('id')
                .eq('user_id', this.userData.id)
                .maybeSingle();

            if (error) {
                console.warn('[UserManager] Erro ao verificar perfil:', error);
                return false;
            }

            // Se não tem perfil, tentar criar
            if (!data) {
                return await this.createDefaultProfile(this.userData.id);
            }

            return true;
        } catch (error) {
            console.warn('[UserManager] Erro ao garantir perfil:', error);
            return false;
        }
    }
}

export default UserManager; 