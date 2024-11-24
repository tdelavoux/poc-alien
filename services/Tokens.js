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

    getId(){
        return this.token.id;
    }

    getName(){
        return this.token.name;
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
     * 
     * @param {Object} tokenList 
     * @returns 
     */
    static getPlayersFromList(tokenList){
        try{
            return tokenList.filter(token => {
                return token.actor && 
                       token.actor.type !== "creature" 
                    // TODO ne display pas les PNJ ? 
                    //    && token.document.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
            });
        }catch{
            console.error('Not a suitable list of tokens');
            return {};
        }
    }
}