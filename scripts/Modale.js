import { Tokens } from '../services/Tokens.js';
import { getModuleConfigration } from './config.js';
import { getAlienConfigration } from '../services/Alien.js';
import { Roller } from './Roller.js';
import { RollService } from '../services/RollService.js';
import { ChatMessageService } from '../services/ChatMessage.js';

// TODO géréer si pas de tokens actifs ou pas de skills / attributs trouvés ? 
export class Modale{
    
    constructor(trigger) {

        if(!trigger){
            console.warn('Trigger is not a valid HTML element. Module cannot be set');
            return;
        }

        this.trigger  = trigger;
        this.rootNode  = null;
        this.template    = `modale.html`;
        this.templateRollLigne = `roll-line.html`;
        this.templatePanic = `panic-line.html`;
        this.trigger?.addEventListener('click', () => this.toggle());
    }

    // Crée la modale et son contenu
    async create(){
        const self = this;
        const config = await getModuleConfigration();
        const alienConfig = await getAlienConfigration();
        
        const templatePath = `${config.templatePath}${self.template}`;

        const tokens     = Tokens.getPlayersFromList(canvas.tokens.placeables);
        const skills     =  alienConfig.skills;
        const attributes =  alienConfig.attributes;

        const content = await renderTemplate(templatePath, {tokens: tokens, skills:skills, attributes: attributes});
        const dialog  = new Dialog({
            title: `${config.moduleId} - ${config.moduleTitle}`,
            content: content,
            buttons: {},
            render: (html) => {
                // JQ 🤮
                let dialogElement = html.closest('.dialog'); 
                let header = dialogElement.find('.window-header .close');
                let customButton = $('<a class="header-button control minimize">Minimize</a>');
                customButton?.on('click', () => self.rootNode.minimize());
                header.before(customButton);

                self.applyFormListeners(html);
                this.syncPanic(...tokens);
            },
            close: () => {
                self.rootNode = null;
            }
        }, {width: 600});
    
        dialog.render(true);
        self.rootNode = dialog;
    }

    // Toggle la Modale
    toggle(){
        if(!this.rootNode){
            this.create();
            return;
        }
        this.rootNode.close();
    }

    // Ajoute l'interactivité dans le formulaire
    applyFormListeners(html){
        const self = this;
        const button = document.getElementById('rollDice');
        button.addEventListener('click', () => {
            this.formAction();
        });

        // Ajouter des écouteurs d'événements pour la désélection
        html.find('.attribute-item input').on('change', function() {
            this.checked && html.find('.skill-item input').prop('checked', false);
        });

        html.find('.skill-item input').on('change', function() {
            this.checked && html.find('.attribute-item input').prop('checked', false);
        });

        const cleanupButton = document.getElementById('cleanup-pending-requests');
        cleanupButton.addEventListener('click', () => {
            ChatMessageService.cleanChatMessageByClassName('alien-request-roll');
            ui.notifications.warn("Pending Notifications has been cleared");
        });
    }

    // Lancement du traitement du formulaire
    formAction(){
        const selectedTokens    = Array.from(document.querySelectorAll('#tokenList input:checked')).map(input => input.value);
        const selectedAttribute = document.querySelector('.attribute-item input:checked');
        const selectedSkill     = document.querySelector('.skill-item input:checked');
        const rollType = selectedAttribute ? Roller.RollTypeEnum.attribute : Roller.RollTypeEnum.skill;
        const rollKey  = selectedAttribute ? selectedAttribute?.value : selectedSkill?.value;
        const rollForAbsent = document.querySelector('#rollForMissing:checked')?.checked;

        if(selectedTokens.length < 1 || !rollKey){
            ui.notifications.warn("You need to select at least a token and a skill or attribute");
            return;
        }
        selectedTokens.forEach((tokenId) => {
            const token = Tokens.getTokenFromId(tokenId);
            if(!token){return}
            const roll  = new Roller(token, rollType, rollKey);

            const owningPlayers = token.getOwners(true);

            rollForAbsent && owningPlayers.length === 0 ? 
                roll.characterRoll() :
                roll.createRollNotification(owningPlayers?.map((el) => el.id));
        });
    }

    // Insère une ligne de roll dans la table des résultats 
    async logRollResult(token, roll){

        const target = document.querySelector(`#token-item-${token.getId()} .last-roll-result`);
        if(!target){return;}

        const config = await getModuleConfigration();
        const templatePath = `${config.templatePath}${this.templateRollLigne}`;
        const rollResults = RollService.getDicesFromRoll(roll);
        const view = await renderTemplate(templatePath, {token: token.token, roll:rollResults });
        target.innerHTML = view;

        await this.syncPanic(token);
    }

    // Met a jour le / les états de panique pour les tokens ciblés
    // Accepte les Tokens du module, les Token d'Alien & les token ID
    async syncPanic(... tokens){
        
        const config = await getModuleConfigration();
        [...tokens].forEach(async (token) => {
            token = token instanceof Tokens ? token : Tokens.getTokenFromId(token?.id ?? token);
            const target = document.querySelector(`#token-item-${token.getId()} .panic-state`);
            if(!target){return;}

            const panic = {
                isPanic: token.getPanicValue(),
                panicMessage: token.getLastPanicMessage()
            };

            const templatePath = `${config.templatePath}${this.templatePanic}`;
            const view = await renderTemplate(templatePath, {token: token.token, panic:panic });
            target.innerHTML = view;
        });
    }
}
