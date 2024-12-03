let configuration = null;
const moduleId = 'alien-roll-request'

export function getModuleConfigration(){

    // retrive from cache data
    if(configuration){ return configuration;}
    const tempPath =  `/modules/${moduleId}/templates/`;

    configuration = {
        moduleId: moduleId,
        templatePath: tempPath
    };
    return configuration;
}

export function registerModuleSettings(){
    game.settings.register(moduleId, "hostile", {
        name: "Hostile Tokens",
        hint: "Unable or disable hostile tokens",
        scope: "world",
        config: true, 
        type: Boolean, 
        default: false, 
    });
}
