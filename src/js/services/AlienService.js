/**
 * Interaction et récupération d'éléments du systeme Alien RPG
 */
const path = '/systems/alienrpg/template.json'

let playableAction = null;

export async function getAlienConfigration(){

    // retrive from cache data
    if(playableAction){ return playableAction;}

    const moduleInfos = await getAlienTemplateDatas();

    playableAction = {
        attributes: moduleInfos.Actor.character.attributes,
        skills: moduleInfos.Actor.character.skills,
    };

    return playableAction;
}

async function getAlienTemplateDatas(){
    const moduleJsonPath = new URL(path, import.meta.url).href; // Adjust path if necessary
    const response = await fetch(moduleJsonPath);
    if (!response.ok) throw new Error(`Failed to load alien template.json: ${response.statusText}`);
  
    return await response.json();
}
