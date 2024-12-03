import { Tokens }                from './Tokens.js';
import { getModuleConfigration } from '../config.js';
import { getAlienConfigration }  from '../services/AlienService.js';
import { Roller }                from './Roller.js';
import { RollService }           from '../services/RollService.js';
import { ChatMessageService }    from '../services/ChatMessageService.js';

export class Modale{
    
    constructor(trigger) {

        if(!trigger){
            console.warn('Trigger is not a valid HTML element. Module cannot be set');
            return;
        }

        this.trigger           = trigger;
        this.rootNode          = null;
        this.template          = `modale.html`;
        this.templateRollLigne = `roll-line.html`;
        this.templatePanic     = `panic-line.html`;
        this.trigger?.addEventListener('click', () => this.toggle());
    }

    // Crée la modale et son contenu
    async create(){
        const self        = this;
        const config      = getModuleConfigration();
        const alienConfig = await getAlienConfigration();
        // Obligé de tout loader pour un render 🥲
        const templatePath = `${config.templatePath}${this.template}`;
        const tokens       = Tokens.getPlayersFromList(canvas.tokens.placeables);
        const skills       = alienConfig.skills;
        const attributes   = alienConfig.attributes;
        const content      = await renderTemplate(templatePath, {tokens: tokens, skills:skills, attributes: attributes});
        const dialog       = new Dialog({
            title  : game.i18n.localize("DICEROLLREQUEST.MODALE.modaleTitle"),
            content: content,
            buttons: {},
            render : (html) => {
                // JQ 🤮
                let dialogElement = html?.closest('.dialog');
                if(!dialogElement.find('.header-button.minimize').length){
                    let header       = dialogElement?.find('.window-header .close');
                    let customButton = $(`<a class="header-button control minimize">${game.i18n.localize("DICEROLLREQUEST.MODALE.minimizeButton")}</a>`);
                    customButton?.on('click', () => self.rootNode?.minimize());
                    header.before(customButton);
                }

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

    async update(){
        if(!this.rootNode){return;}
        // Obligé de tout loader pour un render 🥲
        const config                     = getModuleConfigration();
        const alienConfig                = await getAlienConfigration();
        const templatePath               = `${config.templatePath}${this.template}`;
        const tokens                     = Tokens.getPlayersFromList(canvas.tokens.placeables);
        const skills                     = alienConfig.skills;
        const attributes                 = alienConfig.attributes;
        const content                    = await renderTemplate(templatePath, {tokens: tokens, skills:skills, attributes: attributes});
              this.rootNode.data.content = content;
        this.rootNode?.render(true);
    }

    // Ajoute l'interactivité dans le formulaire
    applyFormListeners(html){
        const button = document.getElementById('arr-roll-button');
        button.addEventListener('click', () => {
            this.formAction();
        });

        // Ajouter des écouteurs d'événements pour la désélection
        html.find('.arr-attribute-input').on('change', function() {
            this.checked && html.find('.arr-skill-input').prop('checked', false);
        });

        html.find('.arr-skill-input').on('change', function() {
            this.checked && html.find('.arr-attribute-input').prop('checked', false);
        });

        const cleanupButton = document.getElementById('arr-cleanup-pending-requests');
        cleanupButton.addEventListener('click', () => {
            ChatMessageService.cleanChatMessageByClassName('alien-request-roll');
            ui.notifications.warn(game.i18n.localize("DICEROLLREQUEST.MODALE.pendingNotificationsCleared"));
        });

        const updateButton = document.getElementById('arr-update-modal-content');
        updateButton.addEventListener('click', () => {
            this.update();
        });
    }

    // Lancement du traitement du formulaire
    formAction(){
        const selectedTokens    = Array.from(document.querySelectorAll('.arr-token-input:checked')).map(input => input.value);
        const selectedAttribute = document.querySelector('.arr-attribute-input:checked');
        const selectedSkill     = document.querySelector('.arr-skill-input:checked');
        const rollType          = selectedAttribute ? Roller.RollTypeEnum.attribute : Roller.RollTypeEnum.skill;
        const rollKey           = selectedAttribute ? selectedAttribute?.value : selectedSkill?.value;
        const rollForAbsent     = document.querySelector('#arr-roll-for-missing:checked')?.checked;
        const rollForPresent    = document.querySelector('#arr-force-for-present:checked')?.checked;

        if(selectedTokens.length < 1 || !rollKey){
            ui.notifications.warn(game.i18n.localize("DICEROLLREQUEST.MODALE.noElementSelectedNotification"));
            return;
        }
        selectedTokens.forEach((tokenId) => {
            const token = Tokens.getTokenFromId(tokenId);
            if(!token){return}
            const roll = new Roller(token, rollType, rollKey);

            const owningPlayers = token.getOwners(true);

            (owningPlayers.length === 0 ? rollForAbsent : rollForPresent) ? 
                roll.characterRoll(): 
                roll.createRollNotification(owningPlayers?.map((el) => el.id));
        });
    }

    // Insère une ligne de roll dans la table des résultats 
    async logRollResult(token, roll){

        const target = document.querySelector(`#arr-token-item-${token.getId()} .arr-last-roll-result`);
        if(!target){return;}

        const config           = getModuleConfigration();
        const templatePath     = `${config.templatePath}${this.templateRollLigne}`;
        const rollResults      = RollService.getDicesFromRoll(roll);
        target.innerHTML       = await renderTemplate(templatePath, {token: token.token, roll:rollResults });

        await this.syncPanic(token);
    }

    // Met a jour le / les états de panique pour les tokens ciblés
    // Accepte les Tokens du module, les Token d'Alien & les token ID
    async syncPanic(... tokens){
        
        const config = getModuleConfigration();
        [...tokens].forEach(async (token) => {
                  token  = token instanceof Tokens ? token : Tokens.getTokenFromId(token?.id ?? token);
            const target = document.querySelector(`#arr-token-item-${token.getId()} .arr-panic-state`);
            if(!target){return;}

            const panic = {
                isPanic     : token.getPanicValue(),
                panicMessage: token.getLastPanicMessage()
            };

            const templatePath     = `${config.templatePath}${this.templatePanic}`;
            const view             = await renderTemplate(templatePath, {token: token.token, panic:panic });
                  target.innerHTML = view;
        });
    }


}
