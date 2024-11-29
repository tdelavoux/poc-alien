import { getAlienConfigration } from '../services/AlienService.js';
import { ChatMessageService } from '../services/ChatMessageService.js';
import { getModuleConfigration } from '../config.js';

export class Roller{

    static RollTypeEnum = {
        skill: 'skill',
        attribute: 'attribute'
    }

    constructor(token, rollType, rollKey, isPush = false) {
        this.token      = token;
        this.type       = rollType;
        this.key        = rollKey;
        this.isPush     = isPush;
        this.rollName   = 'randomRoll';
        this.diceNumber = 0;
        this.template   = 'rollRequest.html';
    }

    async createRollNotification(users = []){
        await this.determineDicesForRoll();
        const config = getModuleConfigration();
        const templatePath = `${config.templatePath}${this.template}`;
        const content = await renderTemplate(templatePath, {tokenId: this.token.getId(), tokenName: this.token.getName(), label:this.rollName, number: this.diceNumber});

        const chatMessageData = {
            whisper: users,
            type: CONST.CHAT_MESSAGE_STYLES.OTHER,
            content: content,
            flags: {
                "GmRollRequest" : {
                    interactiveButton: true,
                    rollType: this.key
                },
            }
        };

        await ChatMessageService.create(chatMessageData);
    }

    async determineDicesForRoll(){
        const alienConfig = await getAlienConfigration(); 
        switch(this.type){
            case Roller.RollTypeEnum.skill: 
                const attributeLinked = alienConfig?.skills[this.key]?.ability;
                this.diceNumber = this.token.getSkill(this.key) + this.token.getAttribute(attributeLinked);
                this.rollName   = alienConfig?.skills[this.key]?.label ?? 'undefined roll';
                break;
            case Roller.RollTypeEnum.attribute: 
                this.diceNumber = this.token.getAttribute(this.key);
                this.rollName   = alienConfig?.attributes[this.key]?.label ?? 'undefined roll';
                break;
        }
    }

    async characterRoll(){
        await this.determineDicesForRoll();
        await game.alienrpg.yze.yzeRoll(
            'character',
            false,
            this.isPush,
            this.rollName,
            this.diceNumber,
            game.i18n.localize('ALIENRPG.Black'),
            this.token.getStressValue(),
            game.i18n.localize('ALIENRPG.Yellow'),
            this.token.getActor().id,
            "randomStringValue",
            1,
            null
        );
    }
}
