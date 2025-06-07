import { ModuleBase } from '/public/components/modules/module-template.js';

class MacrosModule extends ModuleBase {
    constructor() {
        super({
            moduleId: 'macros-module',
            moduleName: 'Editor de Macros',
            capabilities: {
                save: true,
                preview: false
            }
        });
        document.querySelector('.btn').addEventListener('click', () => this.markDirty());
    }

    _handleSaveCommand(data) {
        console.log('Salvando macros...');
        setTimeout(() => {
            this.markClean();
            this._sendMessageToParent('save_success', { message: 'Macro salva com sucesso!' });
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const macrosModule = new MacrosModule();
    macrosModule.init();
});
