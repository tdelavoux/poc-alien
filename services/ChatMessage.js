import { HtmlService } from "./HtmlService.js";
import { Tokens } from "./Tokens.js";

export class ChatMessageService{

    /**
     * Supprime un élément du canal général de l'utilisateur, envoie une demande de suppression aux autres clients et delete le message en BDD
     * 
     * @param {HTMLElement} message 
     * @returns 
     */
    static async deleteMessageFromDomElement(message){
        if(!message){return}
        const id = message.dataset.messageId;
        const instance = ChatMessage.get(id);
        instance?.delete();
        game.socket.emit('delete-message-request', {
            action: 'removeMessage',
            messageId: id
        });
        message.remove();
    }

    /**
     * Clean le canal général défois que des notifications soient restées en suspends
     */
    static cleanChatMessageByClassName(className = 'message'){
        document.querySelectorAll(`.chat-message:has(.${className})`).forEach((message) => {
            ChatMessageService.deleteMessageFromDomElement(message);
        });
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
                ChatMessageService.deleteMessageFromDomElement(button.closest('.chat-message'));
            });
        });

        Hooks.on("preDeleteChatMessage", (message, options, userId) => {
            return message.flags?.GmRollRequest?.allowDelete?.includes(userId) ||game.user.isGM;
        });

        Hooks.on("createChatMessage", (message) => {

            // On peux modifier les donnéer du message en temps réel du coup voir les poosibilités ! 
            // TODO les messages de Panique sont des putains re rolls ? la blague. obligé de filtrer sur un flag random .... Voir pour garder que les roll natifs
            if(message.isRoll && message.flags?.tactorid){
                const tokenId = message.speaker?.token ?? HtmlService.stringToHtmlElement(message.content)?.dataset.actorId;
                const token =  Tokens.getTokenFromId(tokenId);
                message.update({
                    speaker: {alias: token.getName()}
                });
                const roll = message.rolls[0];
                if (roll && token) {
                    modale.logRollResult(token, roll);
                }
            }
        });
    }
}