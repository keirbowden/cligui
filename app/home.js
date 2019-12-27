const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const sfdxUtils = require('./shared/sfdxUtils.js');
const ui = require('./shared/ui.js');
const path=require('path');
const fse=require('fs-extra');
const fixPath = require('fix-path'); 
fixPath();

const currentWindow = remote.getCurrentWindow();

ui.setupFooter('footer', mainProcess.getConfig());

let count=0;
for (let group of mainProcess.commands.groups) {
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

const customCommandsButtonContainer=document.querySelector('#custom-commands-button-container');
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

