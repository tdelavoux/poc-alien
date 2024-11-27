import { ChatMessageService } from "../services/ChatMessage.js";

import { Modale } from "./Modale.js";
import { getModuleConfigration } from './config.js';

let config = {};


Hooks.once("ready", async () => {

    // Charge une première fois les données de configuration pour que les autres modules utilisent le cache du singleton
    config = await getModuleConfigration();

    // Initialise la fenêtre modale
    const modale = new Modale(document.querySelector("#chat-controls .chat-control-icon"));

    // Initialise les listener du Chat de nettoyage des éléments périmés.
    game.user.isGM && ChatMessageService.cleanChatMessageByClassName('alien-request-roll');
    ChatMessageService.setMessageCreationListener(modale);
});