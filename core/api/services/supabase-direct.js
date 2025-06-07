/**
 * Configuração direta do Supabase sem carregamento dinâmico
 * Este arquivo deve ser usado como um <script> com type="module"
 */

// Importar diretamente do CDN
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// Configurações do Supabase
const supabaseUrl = 'https://xjmpohdtonzeafylahmr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbXBvaGR0b256ZWFmeWxhaG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY3NDUsImV4cCI6MjA1NTgxMjc0NX0.Q6aWS0jKc2-FDkhn5bkr8QUFcdQwkvPpDwfzJYWI1Ek';

// Criar e exportar o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Expor para o escopo global também (para compatibilidade)
window.supabase = supabase;

// Notificar que o Supabase está pronto
document.dispatchEvent(new CustomEvent('supabase:ready'));

// Exportar o cliente
export default supabase; 