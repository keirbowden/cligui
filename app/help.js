const { remote, ipcRenderer } = require('electron');
const assistance = require('./shared/assistance.js');
const child_process = require('child_process');

let params={};
ipcRenderer.on('params', (event, params) => {
    const ovContainer = document.querySelector('#overview');
    ovContainer.innerHTML=assistance.all[params.name].overview;

    setTimeout( () => {
        let help=''+child_process.execFileSync('sfdx', [params.command, '-h']);
        const helpContainer = document.querySelector('#help');
        helpContainer.innerHTML='<pre>' + help + '</pre>';
    }, 0);
});

