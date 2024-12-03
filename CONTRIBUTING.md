# Contributing

You want to help this module developement and we are gratefull for your help. Please be sure you read all this before you started development.
The following content assume you have sufficient knowledge to hangle Git and publishing content on a distant repository.
If you dont, you might ask for assitance on it.

## Local install 

- [ ] NodeJS is installed and ready to serve 🫡. This module use Node Componements so you will need it to get propper setup. Otherwise check how to [install NodeJS](https://nodejs.org/en/download/package-manager)
- [ ] Git clone project from github to have access to distant repository and be sure you are up to date with it. If you feel it, create manually remotes.
- [ ] Install node_modules packages. Open a terminal in the module folder and launch `npm install` to set up all depencies. Tere is only Dev dependecies so no worry for production. Please avoir package install before pushing in a branch or explain the needs during the pull request.
- [ ] Update the module.json file and set `module.json@esmodules` path to `src/js/main.js`. That way you will be able to add code without compilation. If you develop with Vite on FOundry you might have hot reaload and you might update the files auto compile.

## Developemnt 

- [ ] Create a branch locally and publish it on the local repository
- [ ] Respect [Git conventions for commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) to help the code review
- [ ] Compile assets (js and CSS) with npm run build
- [ ] Once your code is up, set the  `module.json@esmodules` path to `scripts/main.js`
- [ ] Create a merge request for your branch on master and provide all datas to facilitate the review and merge. Describe the tests needed to makes sure it all works.
