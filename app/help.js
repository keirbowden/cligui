const { ipcRenderer, remote } = require('electron');
const mainProcess = remote.require('./main.js');
const child_process = require('child_process');
const sfdxUtils = require('./shared/sfdxUtils');

ipcRenderer.on('params', (event, params) => {
    const content=mainProcess.commandsByName.get(params.name).overview;
    const ovContainer = document.querySelector('#overview');
    ovContainer.innerHTML=(content?content:'Not defined');

    if (params.command!='gui') {
        setTimeout( () => {
            let help=''+child_process.execFileSync(sfdxUtils.getSfdxExe(), [params.command, '-h']);
            addHelpContent(help);
        }, 0);
    }
    else {
        addHelpContent('No Salesforce CLI command provided.')
    }
});

const addHelpContent=(help) => {
    const helpContainer = document.querySelector('#help');
    while (helpContainer.firstChild) {
        helpContainer.removeChild(helpContainer.firstChild);
    }
    const preEle=document.createElement('pre');
    preEle.innerHTML=help;
    helpContainer.appendChild(preEle);

}
