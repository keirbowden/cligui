const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const sfdxUtils = require('./shared/sfdxUtils.js');
const paramUtils = require('./shared/paramUtils.js');
const ui = require('./shared/ui.js');
const orgUtils = require('./shared/orgUtils.js');

const currentWindow = remote.getCurrentWindow();
const logging = require('./shared/logging.js');

const fixPath = require('fix-path'); 
fixPath();

sfdxUtils.setHomeDir(mainProcess.getHomeDir());
logging.addModal('logging');

let command;
let orgs;
let config;
let username;
let devhubusername;

let executableEle=document.querySelector('#command');
let executeButton=document.querySelector('#execute-button');

executeButton.addEventListener('click', () => {
    executeCommand();
});

const setDirectory = (dir) => {
    process.chdir(dir);
    config=sfdxUtils.getConfig();
    username=config.username;
    devhubusername=config.devhubusername;
    ui.setupFooter('footer', username, devhubusername);
}

const dirButton = document.querySelector('#dir-button');
dirButton.addEventListener('click', () => {
    const dir=mainProcess.getDirectoryFromUser(currentWindow, process.cwd());
    if (dir) {
        setDirectory(dir);
    }
});

ipcRenderer.on('params', (event, params) => {
    dir=params.dir;
    setDirectory(dir);
    
    command=params.command;
    ui.setupHeader(command);

    orgs=mainProcess.getOrgs();
    paramUtils.addParams('params', command, orgs);
    paramUtils.addHandlers(command, updateCommand, username, devhubusername);

    executeButton.innerHTML=command.executelabel;
    updateCommand();
});        

const updateCommand = () => {
    let executable=command.command + ' ' + command.subcommand + getParams();
    executableEle.innerHTML=(executable);
}

const getParams = () => {
    let disable=false;
    let paramStr='';

    for (let param of command.params) {
        let val;
        switch (param.type) {
            case 'org':
                let username;
                val=param.input.value;
                if ( (''!==val) && (null!=(username=orgUtils.isValidUsername(orgs, val))) ) {
                    paramStr+=' ' + param.flag +' ' + username;
                }
                else {
                    disable=true;
                }
                break;
            ;;

            case 'number':
                val=param.input.value;
                if ( (''!==val) && (val>=param.min) && (val<=param.max) ) {
                    paramStr+=' ' + param.flag +' ' + val;
                }
                else {
                    disable=true;
                }
                break;
            ;;

            case 'text':
                val=param.input.value;
                if (''!==val) {
                    paramStr+=' ' + param.flag +' ' + val;
                }
                break;
            ;;

            case 'file':
                val=param.input.value;
                if (''!==val){
                    paramStr+=' ' + param.flag +' ' + val;
                }
                else {
                    disable=true;
                }
                break;
            ;;

            case 'checkbox':
                let ele=document.querySelector('#' + param.name + '-cb:checked')
                console.log('Ele = ' + ele);
                if (null!=ele) {
                    const val=ele.value;
                    console.log('Val = ' + val + ' param nam ' + param.name);
                    if (val==param.name) {

                        paramStr+=' ' + param.flag;
                    }
                }
                
                break;
            ;;

            case 'select':
                let selectedIndex=param.input.selectedIndex;
                paramStr+=' ' + param.flag +' ' + param.values[selectedIndex];
                break;
            ;;
        }
    }

    if (command.additionalflags) {
        paramStr+=' ' + command.additionalflags;
    }
    executeButton.disabled=disable;

    return paramStr;
}

const executeCommand = () => {
    sfdxUtils.executeSfdxWithLogging(command.startMessage, command.completeMessage, true, 
                                     command.subcommand, getParams(), completed);
};

const completed = (result) => {
    if (result.status==0) {
        orgUtils.openOrgIfConfigured(command, result.result.username);
        if (command.refreshOrgs) {
            logging.log('Refreshing org list');
            mainProcess.refreshOrgs();
        }
        
        // clear form
        // aliasInput.value='';
        // duration.value='';
        // defaultUserCheckbox.checked=false;
        // openOrgCheckbox.checked=false;        
    }
}

ipcRenderer.on('broadcast', (event, message) => {
    ui.setupFooter('footer', username, devhubusername, message);
    logging.log(message);
});