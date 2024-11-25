export class Tokens{

    constructor(token){
        this.token = token;
        if (!this.tokenIsValidActor()) {
            throw new Error("Token is not a suitable actor");
        }
    }

    /**
     * Renvoie la valeur de skill d'un token
     * @param {String} skillName 
     * @returns {Integer}
     */
    getSkill(skillName) {
        if (!this.token.actor?.system?.skills[skillName]) {
            console.error(`Skill ${attributeName} not found`);
        }
        return this.token.actor?.system?.skills[skillName]?.value ?? 0;
    }

    /**
     * Renvoie la valeur d'attribut d'un token
     * @param {String} attributeName 
     * @returns {Integer}
     */
    getAttribute(attributeName) {
        if (!this.token.actor?.system?.attributes[attributeName]) {
            console.error(`Attribute ${attributeName} not found`);
        }
        return this.token.actor?.system?.attributes[attributeName]?.value ?? 0;
    }

    /**
     * Renvoie la valeur de strass du token
     * this.actor.getRollData().header.stress.value ?? found in zyeRoll
     */
    getStressValue(){
        return this.token.actor.system.header.stress.value;
    }

    /**
     * Renvoie l'état de panique d'un token
     * TODO factchecker le bon fonctionnement. La value à un défini un état paniqué. Le last roll contient la value de celle-çi
     */
    getPanicValue(){
        return this.token.actor.system?.general?.panic?.value === 1 ? this.token.actor.system?.general?.panic?.lastRoll : 0;
    }

    /**
     * Renvoie le dernier message de panique associé au token
     */
    getLastPanicMessage(){
        return this.token.actor.morePanic(this.getPanicValue());
    }

    getId(){
        return this.token.id;
    }

    getName(){
        return this.token.name;
    }

    getOwners(){
        return game?.users?.find(u => u.character === this.token.actor);
    }

    tokenIsValidActor(){
        return !!this.token && !!this.token.actor;
    }

    static getTokenFromId(tokenId){
        const token = canvas.tokens.get(tokenId);
        return new this(token); 
    }


    // ----------------------------------------------------------------------------------------------------------------

    /**
     * Renvoie la liste des tokens de joueurs. Retire les monstres et les PNJ Hostiles
     * TODO gerer en settings les affichages
     * 
     * @param {Object} tokenList 
     * @returns 
     */
    static getPlayersFromList(tokenList){
        try{
            return tokenList.filter(token => {
                return token.actor && 
                       token.actor.type !== "creature" 
                       && token.actor.type !== "vehicles"
                       && token.document.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
            });
        }catch{
            console.error('Not a suitable list of tokens');
            return {};
        }
    }
}