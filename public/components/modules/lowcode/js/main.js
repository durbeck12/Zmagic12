import { ModuleBase } from '/public/components/modules/module-template.js';

class LowCodeModule extends ModuleBase {
    constructor() {
        super({
            moduleId: 'lowcode-module',
            moduleName: 'Low Code Editor',
            capabilities: {
                save: true,
                preview: false
            }
        });
    }

    _handleSaveCommand(data) {
        console.log('Salvando flow...');
        setTimeout(() => {
            this.markClean();
            this._sendMessageToParent('save_success', { message: 'Flow salvo com sucesso!' });
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const lowcodeModule = new LowCodeModule();
    lowcodeModule.init();
});
