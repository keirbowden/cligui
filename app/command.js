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

ui.addSpinner('spinner');    
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
    setConfig();
}

const setConfig = () => {
    config=sfdxUtils.getConfig();
    username=config.username;
    devhubusername=config.devhubusername;
    ui.setupFooter('footer', config);    
}

const dirButton = document.querySelector('#dir-button');
dirButton.addEventListener('click', () => {
    const dir=mainProcess.getDirectoryFromUser(currentWindow, process.cwd());
    if (dir) {
        setDirectory(dir);
    }
});

const logButton = document.querySelector('#log-button');
logButton.addEventListener('click', () => {
    logging.toggleModal();
});

ipcRenderer.on('params', (event, params) => {
    dir=params.dir;
    setDirectory(dir);
    
    command=params.command;
    ui.setupHeader(command, mainProcess);

    const instContainer=document.getElementById('instructions');
    instContainer.innerHTML=(command.instructions?command.instructions:'<i>No instructions provided</i>');
    orgs=mainProcess.getOrgs();
    paramUtils.addParams('params', command, orgs);
    paramUtils.addHandlers(command, updateCommand, config, mainProcess, currentWindow);

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
        let separator=(param.separator?param.separator:' ');
        switch (param.type) {
            case 'org':
                let username;
                val=param.input.value;
                if ( (''!==val) && (null!=(username=orgUtils.extractValidUsername(orgs, val))) ) {
                    username=username.replace(/ /g, '\\ ');
                    paramStr+=' ' + param.flag + separator + username;
                }
                else if ( (''===val) && (param.allowEmpty) ) {
                    paramStr+=' ' + param.flag + separator;
                }
                else {
                    disable=true;
                }
                command.username=username;
                
                break;
            ;;

            case 'number':
                val=param.input.value;
                if ( (''!==val) && 
                    ((param.min===undefined) || (val>=param.min)) && 
                    ((param.min===undefined) || (val<=param.max)) ) {
                    paramStr+=' ' + param.flag + separator + val;
                }
                else if (param.required) {
                    disable=true;
                }
                break;
            ;;

            case 'text':
                val=param.input.value;
                let quote='';
                if (''!==val) {
                    val=val.replace(/ /g, '\\ ');
                    paramStr+=' ' + param.flag + separator + quote + val + quote;
                }
                break;
            ;;

            case 'file':
                val=param.input.value;
                if (''!==val){
                    val=val.replace(' ', '\\ ');
                    paramStr+=' ' + param.flag + separator + val;
                }
                else {
                    disable=true;
                }
                break;
            ;;

            case 'checkbox':
                let ele=document.querySelector('#' + param.name + '-cb:checked')
                if (null!=ele) {
                    const val=ele.value;
                    if (val==param.name) {

                        paramStr+=' ' + param.flag;
                    }
                }
                
                break;
            ;;

            case 'select':
            case 'logfile':
            case 'package':
            case 'packageversion':
                let selectedIndex=param.input.selectedIndex;
                if (-1!=selectedIndex) {
                    if (param.type=='package') {
                        command.package=param.values[selectedIndex];
                    }
                    if (!param.internal) {
                        paramStr+=' ' + param.flag + separator + param.values[selectedIndex];
                    }
                }
                else {
                    disable=true;
                }
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
    sfdxUtils.executeSfdxWithLogging(command, getParams(), completed);
};

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
    }
}

ipcRenderer.on('broadcast', (event, message) => {
    ui.setupFooter('footer', config, message);
    logging.log(message);
});

ipcRenderer.on('config', (event) => {
    setConfig();
    ui.setupFooter('footer', config, message);
    logging.log('Refreshed config');
});