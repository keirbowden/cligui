const { remote } = require('electron');
const mainProcess = remote.require('./main.js');
const sfdxUtils = require('./shared/sfdxUtils.js');
const path=require('path');
const fse=require('fs-extra');

let orgs;

sfdxUtils.loadOrgs(mainProcess, null, true);
//mainProcess.closeSetup();
