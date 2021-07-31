const child_process = require('child_process');
const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const sfdxUtils = require('./shared/sfdxUtils.js');
const paramUtils = require('./shared/paramUtils.js');
const ui = require('./shared/ui.js');
const orgUtils = require('./shared/orgUtils.js');

const currentWindow = remote.getCurrentWindow();
const logging = require('./shared/logging.js');

const fixPath = require('fix-path'); 
const { copy } = require('fs-extra');
const { parseArgsStringToArgv } = require('string-argv');

fixPath();

ui.addSpinner('spinner');    
logging.addModal('logging');

let command;
let orgs;
let config;
let username;
let devhubusername;
let paramsByFlag;
let favourite=false;
let favouriteLabel;

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

const favSaveButton = document.querySelector('#fav-save-button');
const favNameEle = document.querySelector('#fav-name');
favSaveButton.addEventListener('click', () => {
    let faves=mainProcess.getFaves();
    const favName=favNameEle.value;
    let error='';
    if (favName) {
        for (let idx=0; idx<faves.length; idx++) {
            let fave=faves[idx];
            if (fave.label==favName) {
                error='Favourite named ' + favName + ' already exists';
            }
        }    
    }
    else {
        error='Please provide a name for your favourite';
    }

    if (''==error) {
        let commandStr=executableEle.innerHTML;
        console.log('Inner HTML = ' + commandStr);
        commandStr=commandStr.replace(/\\/g, '');

        faves.push({label: favName, command: commandStr});
        mainProcess.saveFaves(faves);
        favSaveEle.classList.add('slds-hide');
        favRemoveEle.classList.remove('slds-hide');
    }
    else {
        alert(error);
    }
});


const favRemoveButton = document.querySelector('#fav-remove-button');
favRemoveButton.addEventListener('click', () => {
    let faves=mainProcess.getFaves();
    let newFaves=[];
    for (let idx=0; idx<faves.length; idx++) {
        let fave=faves[idx];
        if (fave.label!=favouriteLabel) {
            newFaves.push(fave);
        }
    }    
    mainProcess.saveFaves(newFaves);
    favSaveEle.classList.remove('slds-hide');
    favRemoveEle.classList.add('slds-hide');
});

const favSaveEle=document.querySelector('#fav-save');
const favRemoveEle=document.querySelector('#fav-remove');
ipcRenderer.on('params', (event, params) => {
    dir=params.dir;
    setDirectory(dir);
    
    command=params.command;
    if (command=='favourite') {
        favourite=true;
        favouriteLabel=params.favourite.label;
        decodeCommand(params.fullCommand);
        favSaveEle.classList.add('slds-hide');
        favRemoveEle.classList.remove('slds-hide');
    }
    else {
        favourite=false;
        setupCommand();
        favSaveEle.classList.remove('slds-hide');
        favRemoveEle.classList.add('slds-hide');
    }
});        

const setupCommand = (() => {
    ui.setupHeader(command, mainProcess);

    const instContainer=document.getElementById('instructions');
    instContainer.innerHTML=(command.instructions?command.instructions:'<i>No instructions provided</i>');
    orgs=mainProcess.getOrgs();
    const paramsEle=document.getElementById('params');
    paramsEle.innerHTML='';
    paramUtils.addParams('params', command, orgs);
    paramUtils.addHandlers(command, updateCommand, config, mainProcess, currentWindow);

    executeButton.innerHTML=command.executelabel;
    let underlyingCommandEle=document.querySelector('#underlying-command');
    if (command.name!='decode') {
        underlyingCommandEle.classList.remove('slds-hide');
    }
    updateCommand()
});

const updateCommand = () => {
    if (command.name!='decode') {
        let executable=command.command + ' ' + command.subcommand + getParams();
        executableEle.innerHTML=(executable);
    }
}

const getParams = () => {
    let disable=false;
    let paramStr='';
    let populateMap=false;
    if (!paramsByFlag) {
        paramsByFlag=new Map();
        paramsByLongFlag=new Map();
        populateMap=true;
    }

    for (let param of command.params) {
        if (populateMap) {
            paramsByFlag.set(param.flag, param);
            paramsByLongFlag.set(param.longFlag, param);
        }
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
                    if (param.quote)
                    {
                        if (process.platform === "win32") {
                            quote='\'';
                        }
                        else {
                            quote='\\\'';
                        }
                    }
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

            case 'dir':
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
                    if (param.values[selectedIndex]!='Custom') {
                        if (!param.internal) {
                            paramStr+=' ' + param.flag + separator + param.values[selectedIndex];
                        }
                    }
                }
                else {
                    disable=true;
                }
                break;
            ;;
            case 'category':
                let selectedOptions=param.input.selectedOptions;
                if (selectedOptions.length>0)
                {
                    let vals='';
                    for (let selOpt of selectedOptions)
                    {
                        vals+=', ' + selOpt.value;
                    }
                    let quote='"';

                    paramStr+=' ' + param.flag + separator + quote + vals.substring(2) + quote;
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


const setParam = (param, value) => {
    switch (param.type) {
        case 'org':
        case 'number':
        case 'text':
        case 'file':
        case 'dir':
        case 'select':
        case 'logfile':
        case 'package':
        case 'packageversion':
            param.input.value=stripQuotes(value);
            break;
        ;;
        case 'checkbox':
            let ele=document.querySelector('#' + param.name + '-cb')
            ele.checked=true;
            break;
        ;;
    }
}

const stripQuotes = (value) => {
    let result=value;
    if ( (result.charAt(0)=='\'') || (result.charAt(0)=='"') ) {
        result=result.substring(1);
    }
    if ( (result.charAt(result.length-1)=='\'') || (result.charAt(result.length-1)=='"') ) {
        result=result.substring(0, result.length-1);
    }

    return result;
}

const executeCommand = () => {
    if (command.name!='decode') {
        sfdxUtils.executeSfdxWithLogging(command, getParams(), completed);
    }
    else {
        decodeCommand(getParams());
    }
}

const decodeCommand = (params) => {
    let paramStr=params.replace(/\\\ /g, " ").trim();
    const commandSplit=parseArgsStringToArgv(paramStr);

   // const commandSplit=paramStr.match(/('(\\'|[^'])*'|"(\\"|[^"])*"|\/(\\\/|[^\/])*\/|(\\ |[^ ])+|[\w-]+)/g);
    const exeName=commandSplit[0];
    const subCommand=commandSplit[1];
    for (let group of mainProcess.commands.groups) {
        for (let groupCommand of group.commands) {
            if ( (groupCommand.command==exeName) && 
                    (groupCommand.subcommand==subCommand) ) {
                command=groupCommand;
                paramsByFlag=null;
                setupCommand();
                let packageParam=null;
                let packageParamValue=null;
                let idx=2;
                while (idx<commandSplit.length) {
                    let flag=commandSplit[idx++];
                    let value='';
                    if (idx<commandSplit.length) {
                        if ('-'!=commandSplit[idx].charAt(0)) {
                            value=commandSplit[idx++];
                        }
                    }
                    let param=paramsByFlag.get(flag) || paramsByLongFlag.get(flag);
                    if (param) {
                        setParam(param, value);
                        if (param.type=='package') {
                            packageParam=param;
                            packageParamValue=value;
                        }
                    }
                }
                if (packageParam) {
                    paramUtils.getPackageOptions(packageParam, command.username, config,
                                                () => {
                                                    console.log('Setting value of ' + JSON.stringify(packageParam) + ' to ' + packageParamValue);
                                                    setParam(packageParam, packageParamValue);
                                                    getParams();
                                                    updateCommand();
                                                });
                }
                else {
                    getParams();
                    updateCommand();
                }
            }
        }
    }
}

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

ipcRenderer.on('broadcast', (event, message) => {
    ui.setupFooter('footer', config, message);
    logging.log(message);
});

ipcRenderer.on('config', (event) => {
    setConfig();
    ui.setupFooter('footer', config, message);
    logging.log('Refreshed config');
});