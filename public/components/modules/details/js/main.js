import { ModuleBase } from '/public/components/modules/module-template.js';

class DetailsModule extends ModuleBase {
    constructor() {
        super({
            moduleId: 'details-module',
            moduleName: 'Project Details',
            capabilities: {
                save: true,
                preview: false
            }
        });
        document.querySelector('form').addEventListener('input', () => this.markDirty());
    }

    _handleSaveCommand(data) {
        console.log('Salvando detalhes do projeto...');
        setTimeout(() => {
            this.markClean();
            this._sendMessageToParent('save_success', { message: 'Detalhes salvos com sucesso!' });
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const detailsModule = new DetailsModule();
    detailsModule.init();
});
