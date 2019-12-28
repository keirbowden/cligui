const { ipcRenderer, remote } = require('electron');
const mainProcess = remote.require('./main.js');
const child_process = require('child_process');
const sfdxUtils = require('./shared/sfdxUtils');

ipcRenderer.on('params', (event, params) => {
    const ovContainer = document.querySelector('#overview');
    if (params.command!='gui') {
        const content=mainProcess.commandsByName.get(params.name).overview;
        ovContainer.innerHTML=(content?content:'Not defined');

        setTimeout( () => {
            let help=''+child_process.execFileSync(sfdxUtils.getSfdxExe(), [params.command, '-h']);
            addHelpContent(help);
        }, 0);
    }
    else {
        ovContainer.innerHTML='Salesforce CLI GUI.';
        addHelpContent('Click any button to configure and execute a command.')
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
