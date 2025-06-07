/**
 * Sistema de comandos para ações de projetos
 * Este arquivo contém funções para executar comandos relacionados aos projetos
 */

// Objeto para armazenar comandos disponíveis
const commands = {};

/**
 * Comando para editar um projeto
 * @param {Object} params - Parâmetros do comando
 * @param {string} params.projectId - ID do projeto a ser editado
 */
commands.editProject = function(params) {
    console.log('Comando editProject executado com parâmetros:', params);
    
    // Verificar se o ID do projeto foi fornecido
    if (!params || !params.projectId) {
        console.error('ID do projeto não fornecido para o comando editProject');
        return;
    }
    
    // Abrir o projeto em uma nova janela/aba
    try {
        // Construir URL para a página de edição
        const projectId = params.projectId;
        const editUrl = `/project-editor.html?id=${projectId}`;
        
        // Abrir em uma nova janela/aba
        window.open(editUrl, '_blank');
        console.log(`Nova janela aberta para edição do projeto ${projectId}`);
        
        return true;
    } catch (error) {
        console.error('Erro ao abrir a janela de edição:', error);
        return false;
    }
};

/**
 * Função principal para executar comandos
 * @param {string} commandName - Nome do comando a ser executado
 * @param {Object} params - Parâmetros para o comando
 * @returns {*} - Resultado do comando, se houver
 */
export function executeCommand(commandName, params) {
    if (!commandName) {
        console.error('Nome do comando não fornecido');
        return;
    }
    
    // Verificar se o comando existe
    if (typeof commands[commandName] !== 'function') {
        console.error(`Comando "${commandName}" não encontrado`);
        return;
    }
    
    // Executar o comando
    try {
        console.log(`Executando comando: ${commandName}`);
        return commands[commandName](params);
    } catch (error) {
        console.error(`Erro ao executar comando ${commandName}:`, error);
    }
}

// Exportar a função principal
export default executeCommand;

// Adicionar à janela global para acesso direto
window.executeCommand = executeCommand; 