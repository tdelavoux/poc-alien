import { ChatMessageService } from "../services/ChatMessage.js";

import { Modale } from "./Modale.js";
import { getModuleConfigration, registerModuleSettings } from './config.js';

let config = {};


Hooks.once("ready", async () => {

    // Charge une première fois les données de configuration pour que les autres modules utilisent le cache du singleton
    config = await getModuleConfigration();

    // Initialise la fenêtre modale et les listeners pour les GM
    if(game.user.isGM){
        const modale = new Modale(document.querySelector("#chat-controls .chat-control-icon"));
        ChatMessageService.cleanChatMessageByClassName('alien-request-roll');
        ChatMessageService.setMessageCreationListener(modale);

        Hooks.on('createToken', (token) => {
            modale.update();
        });
        
        Hooks.on('deleteToken', (token) => {
            modale.update();
        });
    }

    ChatMessageService.setCommonListeners();
});


Hooks.once("init", async () => {
    await registerModuleSettings();
});