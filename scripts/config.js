let configuration = null;

export async function getModuleConfigration(){

    // retrive from cache data
    if(configuration){ return configuration;}

    const moduleInfos = await getModuleInfos();
    const tempPath =  `/modules/${moduleInfos.id}/templates/`;

    configuration = {
        moduleId: moduleInfos.id,
        moduleTitle: moduleInfos.title,
        templatePath: tempPath
    };

    return configuration;
}

async function getModuleInfos(){
    const moduleJsonPath = new URL('../module.json', import.meta.url).href; // Adjust path if necessary
    const response = await fetch(moduleJsonPath);
    if (!response.ok) throw new Error(`Failed to load module.json: ${response.statusText}`);
  
    return await response.json();
}
