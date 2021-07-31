const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const sfdxUtils = require('./shared/sfdxUtils.js');
const ui = require('./shared/ui.js');
const path=require('path');
const fse=require('fs-extra');
const logging = require('./shared/logging.js');
const orgUtils = require('./shared/orgUtils.js');
const { parseArgsStringToArgv } = require('string-argv');
const fixPath = require('fix-path'); 
fixPath();

logging.addModal('logging');

let faves;
let faveMap;

let faveInput=document.querySelector('#fav-input');

const setupFaves = () => {
    faveMap=new Map();
    faves=mainProcess.getFaves();
    let faveList=document.querySelector('#fav-list');
    faveInput.value='';
    faveList.innerHTML='';
    for (let idx=0; idx<faves.length; idx++) {
        let fave=faves[idx];
        let option=document.createElement('option');
        option.value=fave.label;
        option.label=fave.label;
        faveList.appendChild(option);
        faveMap.set(fave.label, fave);
    }
};

setupFaves();

ipcRenderer.on('favourites', (event) => {
    setupFaves();
});

let openFaveButton=document.querySelector('#open-fav-button');
let runFaveButton=document.querySelector('#run-fav-button');
let chosenFave;
faveInput.addEventListener('change', () => {
    chosenFave=faveMap.get(faveInput.value);
    if (null!=chosenFave) {
        openFaveButton.disabled=false;
        runFaveButton.disabled=false;
    }
    else {
        openFaveButton.disabled=true;
        runFaveButton.disabled=true;
    }
});


openFaveButton.addEventListener('click', ()=> {
    const theDir=chosenFave.directory||process.cwd();
    mainProcess.createWindow('command.html', 900, 1200, 10, 10, {command: 'favourite', fullCommand: chosenFave.command, favourite: chosenFave, dir: theDir});
});

let command;
runFaveButton.addEventListener('click', ()=> {
    const currDir=process.cwd();
    //let commandStr=chosenFave.command.replace(/\\\ /g, " ").trim();
    let commandStr=chosenFave.command;
    if (confirm('This will execute\n' + commandStr + '\nAre you sure?')) {
        const commandSplit=parseArgsStringToArgv(commandStr);
        const exeName=commandSplit[0];
        const subCommand=commandSplit[1];
        for (let group of mainProcess.commands.groups) {
            for (let groupCommand of group.commands) {
                if ( (groupCommand.command==exeName) && 
                        (groupCommand.subcommand==subCommand) ) {
                    command=groupCommand;
                }
            }
        }
    
        commandSplit.splice(0, 2);
        let paramStr=commandSplit.join(' ');
    
        console.log('Command = ' + JSON.stringify(command));
        console.log('paramStr = ' + JSON.stringify(paramStr));
    
        const theDir=chosenFave.directory||process.cwd();
        if (currDir!=theDir) {
            process.chdir(theDir);
        }
    
        sfdxUtils.executeSfdxWithLogging(command, paramStr, completed);
    
        if (currDir!=theDir) {
            process.chdir(currDir);
        }
    }
});

const completed = (success, result) => {
    if (success) {
        orgUtils.openOrgIfConfigured(command, result.result.username);
        if (command.refreshOrgs) {
            logging.log('Refreshing org list');
            mainProcess.refreshOrgs();
        }
        
        if (command.refreshConfig) {
            logging.log('Refreshing config');
            mainProcess.refreshConfig();
        }

        if ( ('user'==command.openFile) && 
             (result.result!='No rule violations found.') ) {
            const openFile=document.querySelector('#open-file-cb:checked');
            if (null!=openFile) {
                const val=openFile.value;
                if (val=='open-file')
                {
                    for (let param of command.params)
                    {
                        if (param.name===command.openFileParam)
                        {
                            const filename=param.input.value;
                            let openCmd=(process.platform === "win32"?'start':'open');
                            if (process)
                            child_process. execSync(openCmd + ' ' + filename);
                        }
                    }
                }
            }
        }
    
    }
}


const addGroupMarkup=((group, count)=>{
    let classes=['slds-tabs_default__item'];
    if (0===count) {
        classes.push('slds-is-active');
    }
    let tabsEle=document.createElement('li');
    tabsEle.classList.add(...classes);
    tabsEle.title=group.name;
    tabsEle.setAttribute('role', 'presentation');
    tabsEle.id='tab-'+ group.name;
    
    let tabLinkEle=document.createElement('a');
    tabLinkEle.classList.add('slds-tabs_default__link');
    tabLinkEle.setAttribute('href', 'javascript:void(0);')
    tabLinkEle.setAttribute('role', 'tab')
    tabLinkEle.setAttribute('tabindex', count)
    tabLinkEle.setAttribute('aria-selected', (0===count?'true':'false'));
    tabLinkEle.setAttribute('aria-controls', group.name);
    tabLinkEle.id='tab-' + group.name + '-link';
    tabLinkEle.innerText=group.label;

    tabsEle.appendChild(tabLinkEle);

    const tabContainer=document.querySelector('#tabs');
    tabContainer.appendChild(tabsEle);
    
    let contentEle=document.createElement('div');
    contentEle.id='tab-' + group.name + '-content';
    contentEle.classList.add('slds-tabs_default__content');
    contentEle.classList.add('slds-' + (0===count?'show':'hide'));
    contentEle.classList.add('slds-m-around_small');
    contentEle.setAttribute('role', 'tabpanel');
    contentEle.setAttribute('aria-labelledby', 'tab-' + group.name);

    let gridEle=document.createElement('div');
    gridEle.classList.add('slds-grid');
    gridEle.classList.add('slds-gutters');
    gridEle.classList.add('slds-wrap');
    contentEle.appendChild(gridEle);

    const tabsContentContainer=document.querySelector('#tab-contents');
    tabsContentContainer.appendChild(contentEle);

    for (let command of group.commands) {

        let colEle=document.createElement('div');
        colEle.classList.add('slds-col');
        colEle.classList.add('slds-size_1-of-4');
        colEle.classList.add('slds-p-bottom_medium');

        let colButEle=document.createElement('button');
        colButEle.classList.add('command-button');
        colButEle.classList.add('slds-button');
        colButEle.classList.add('slds-button_' + (command.type?command.type:'outline-brand'));
        colButEle.classList.add('slds-p-top_large');
        colButEle.classList.add('slds-p-bottom_large');
        colButEle.id=command.name + '-btn';
        colButEle.innerText=command.label;
        colEle.appendChild(colButEle);
        
        gridEle.appendChild(colEle);
    }
});

const currentWindow = remote.getCurrentWindow();

ui.setupFooter('footer', mainProcess.getConfig());

let count=0;
for (let group of mainProcess.commands.groups) {
    addGroupMarkup(group, count);
    count++;
}

for (let group of mainProcess.commands.groups) {
    group.link=document.querySelector('#tab-' + group.name + '-link');
    group.link.addEventListener('click', () => {
        activateTab(group);
    });
    group.tab=document.querySelector('#tab-' + group.name);
    group.content=document.querySelector('#tab-' + group.name + '-content');

    for (let command of group.commands) {
        command.button=document.querySelector('#' + command.name + '-btn');
        command.button.addEventListener('click', () => {
            mainProcess.createWindow('command.html', 900, 1200, 10, 10, {command: command, dir: process.cwd()});
        });
    }
}

ui.addSpinner('spinner');    
let spinEle=document.querySelector('#spinner');
sfdxUtils.loadOrgs(mainProcess, spinEle);

const activateTab=(group) => {
    removeActiveTab();
    group.tab.classList.add('slds-is-active');
    group.content.classList.add('slds-show');
    group.content.classList.remove('slds-hide');
}

const removeActiveTab=() => {
    for (let group of mainProcess.commands.groups) {
        group.tab.classList.remove('slds-is-active');
        group.content.classList.add('slds-hide');
        group.content.classList.remove('slds-show');
    }
}
const helpButton = document.querySelector('#help-button');
helpButton.addEventListener('click', () => {
    mainProcess.createWindow('help.html', 500, 750, 50, 50, {name: 'CLI Gui', command: 'gui'});
});

const orgsButton = document.querySelector('#orgs-button');
orgsButton.addEventListener('click', () => {
    mainProcess.refreshOrgs();
});

const dirButton = document.querySelector('#dir-button');
dirButton.addEventListener('click', () => {
    const dir=mainProcess.getDirectoryFromUser(currentWindow, process.cwd());
    if (dir) {
        process.chdir(dir);
        mainProcess.changeDirectory(dir);
        ui.setupFooter('footer', mainProcess.getConfig());
    }
});

 const addOrgOption = (datalist, org, scratch) => {
     option=document.createElement('option');
     option.value=orgUtils.getOrgValue(org, scratch);
     option.label=orgUtils.getOrgValue(org, scratch);
     datalist.appendChild(option);
 }
 

let guiDir=mainProcess.getGUIDir();
/*let personalCommandFile=path.join(guiDir, 'commands.js');
if (!fse.existsSync(personalCommandFile)) {
    const ccBtn=document.createElement('button');
    ccBtn.id='orgs-button';
    ccBtn.classList.add('slds-button');
    ccBtn.classList.add('slds-button_neutral');
    ccBtn.innerText='Write Local Command File';
    ccBtn.addEventListener('click', () => {
        ui.executeWithSpinner(spinEle, () => {
            const fileContent=fse.readFileSync(require.resolve('./shared/commands'));
            if (!fse.existsSync(guiDir)) {
                fse.mkdirSync(guiDir);
            }
            let personalCommandFile=path.join(guiDir, 'commands.js');
            fse.writeFileSync(personalCommandFile, fileContent);
            while (customCommandsButtonContainer.firstChild) {
                customCommandsButtonContainer.removeChild(customCommandsButtonContainer.firstChild);
            }
        });
    });
    customCommandsButtonContainer.appendChild(ccBtn);
}
*/1
ipcRenderer.on('broadcast', (event, message) => {
    ui.setupFooter('footer', mainProcess.getConfig(), message);
});

ipcRenderer.on('config', (event) => {
    ui.setupFooter('footer', mainProcess.getConfig());
});

