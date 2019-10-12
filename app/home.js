const { remote } = require('electron');
const mainProcess = remote.require('./main.js');
const sfdxUtils = require('./shared/sfdxUtils.js');
const ui = require('./shared/ui.js');
const fixPath = require('fix-path'); 
fixPath();

const currentWindow = remote.getCurrentWindow();

ui.setupFooter('footer', mainProcess.getUsername(), mainProcess.getDevhubusername());
sfdxUtils.setHomeDir(mainProcess.getHomeDir());

const helpButton = document.querySelector('#help-button');
helpButton.addEventListener('click', () => {
    mainProcess.createWindow('help.html', 500, 750, 50, 50, {name: 'CLI Gui', command: 'CLI Gui'});
});

const dirButton = document.querySelector('#dir-button');
dirButton.addEventListener('click', () => {
    const dir=mainProcess.getDirectoryFromUser(currentWindow, process.cwd());
    if (dir) {
        process.chdir(dir);
        mainProcess.changeDirectory(dir);
        ui.setupFooter('footer', mainProcess.getUsername(), mainProcess.getDevhubusername());
    }
});

let tabsHtml='';
let contentHtml='';
let count=0;
for (let group of mainProcess.commands.groups) {
    let classes='slds-tabs_default__item';
    if (0===count) {
        classes+=' slds-is-active';
    }
    
    tabsHtml+='<li class="' + classes + '" title="' + group.name + '" role="presentation" id="tab-' + group.name + '">\n' + 
          '    <a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="' + (0===count?'true':'false') +'"\n' + 
          '    aria-controls="tab-' + group.name + '" id="tab-' + group.name + '-link">' + group.label + '</a>\n' + 
          '</li>\n';

    contentHtml+='<div id="tab-' + group.name + '-content" class="slds-tabs_default__content slds-' + (0===count?'show':'hide') + ' slds-m-around_small" role="tabpanel"\n' +
                 '                aria-labelledby="tab-' + group.name + '">\n' + 
                 '    <div class="slds-grid slds-gutters slds-wrap">\n ';
    for (let command of group.commands) {
        contentHtml+='        <div class="slds-col">\n' + 
                   '            <button class="slds-button slds-button_outline-brand slds-p-top_large slds-p-bottom_large" id="' + command.name + '-btn">'+ command.label + '</button>\n' +
                   '        </div>\n';
    }
    contentHtml+='    </div>\n' + 
                 '</div>\n'

    count++;
}

const tabsEle=document.querySelector('#tabs');
tabsEle.innerHTML=tabsHtml;

const tabsContentEle=document.querySelector('#tab-contents');
tabsContentEle.innerHTML=contentHtml;

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
            console.log('mainProcess = ' + JSON.stringify(mainProcess));
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

