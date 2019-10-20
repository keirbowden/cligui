const { ipcRenderer } = require('electron');
const assistance = require('./shared/assistance.js');
const child_process = require('child_process');

ipcRenderer.on('params', (event, params) => {
    const content=assistance.all[params.name];
    const ovContainer = document.querySelector('#overview');
    ovContainer.innerHTML=(content?content.overview:'Not defined');

    setTimeout( () => {
        let help=''+child_process.execFileSync('sfdx', [params.command, '-h']);
        const helpContainer = document.querySelector('#help');
        helpContainer.innerHTML='<pre>' + help + '</pre>';
    }, 0);
});

