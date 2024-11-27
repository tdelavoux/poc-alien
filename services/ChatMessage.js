import { HtmlService } from "./HtmlService.js";
import { Tokens } from "./Tokens.js";

export class ChatMessageService{

    static async create(chatMessageData){
        await ChatMessage.create(chatMessageData);
    }

    /**
     * Supprime un ChatMessage si le user en est Owner. 
     * Sinon, peut émettre une request de delete aux autres users pour atteindre le propriétaire
     * @param {Object} message 
     * @param {Boolean} emit 
     * @returns 
     */
    static deleteMessage(message, emit = false){
        if(!message || !message instanceof ChatMessage){return}
        if(this.isUserMessageOwner(message)){
            ChatMessageService.deleteMessageFromDb(message); 
        }else if(emit){
            game.socket.emit('module.CustomMods', {
                action: 'delete-roll-request',
                messageId: message.id
            });
        }
    }

    static deleteMessageFromDb(message){
        if(!message || !this.isUserMessageOwner(message)){return}
        message?.delete();
    }

    /**
     * Clean le canal général défois que des notifications soient restées en suspends
     */
    static cleanChatMessageByClassName(className = 'message'){
        document.querySelectorAll(`.chat-message:has(.${className})`).forEach((message) => {
            const instance = ChatMessage.get(message.dataset.messageId);
            ChatMessageService.deleteMessage(instance);
        });
    }

    static isUserMessageOwner(message){
        if(!message || !message instanceof ChatMessage){false}
        return message.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
    }

    /**
     * TODO voir comment passer directement un callback au ChatMessage à sa création, 
     * La méthode du Hook est dégeu et AlienRPG aide clairement pas à interragir avec son module 😢 
     */
    static setMessageCreationListener(modale){
        Hooks.on("renderChatMessage" , (message, html, data) => {
            html.find('.rollable')?.on('click', (element) => {
                const button  = element.currentTarget;
                const dataset = button.dataset;
                const token   = Tokens.getTokenFromId(dataset?.token).token;
                token?.actor?.rollAbility(token?.actor, dataset);
                ChatMessageService.deleteMessage(message, true);
            });
        });

        game.socket.on('module.CustomMods', (data) => {
            if(data.action === 'delete-roll-request'){
                const message = ChatMessage.get(data.messageId);
                ChatMessageService.deleteMessage(message);
            }
        });

        Hooks.on("createChatMessage", (message) => { 

            // TODO les messages de Panique sont des rolls ? Pas de flag permettant de les dinstinguer. Obligé de regarder le contenu pour les distinguer pour le moment. AlienRPGBaseDie vs Die Touver comment faire plus propre
            if(message.isRoll && message.rolls[0]?.terms[0]?.constructor?.name === "AlienRPGBaseDie"){
                const tokenId = message.speaker?.token ?? HtmlService.stringToHtmlElement(message.content)?.dataset.actorId;
                const token =  Tokens.getTokenFromId(tokenId);
                const roll = message.rolls[0];
                if (roll && token) {
                    modale.logRollResult(token, roll);
                }
                // A utiliser plutot que le listener çi dessous si on veux une MAJ que sur un jet et pas dès une mise a jour de l'acteur 
                // else if(message.rolls[0]?.terms[0]?.constructor?.name === "Die"){
                //     modale.syncPanic(token);
                // }
            }
            
            Hooks.on("updateActor", (actor, updates, options, userId) => {
                if(updates.system?.general?.panic){
                    const token = Tokens.getTokenFromActorId(actor.id);
                    modale.syncPanic(token);
                }
            });
        });
    }
}