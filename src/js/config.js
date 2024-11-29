let configuration = null;
const moduleId = 'alien-roll-request'

export async function getModuleConfigration(){

    // retrive from cache data
    if(configuration){ return configuration;}
    const tempPath =  `/modules/${moduleId}/templates/`;

    configuration = {
        moduleId: moduleId,
        moduleTitle: moduleInfos.title,
        templatePath: tempPath
    };

    return configuration;
}

export async function registerModuleSettings(){
    const config = await getModuleConfigration();
    game.settings.register(moduleId, "hostile", {
        name: "Hostile Tokens",
        hint: "Unable or disable hostile tokens",
        scope: "world",
        config: true, 
        type: Boolean, 
        default: false, 
    });
}
