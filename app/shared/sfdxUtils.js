const child_process = require('child_process');
const logging = require('./logging.js');
const fse=require('fs-extra');
const ui = require('./ui.js');
const path=require('path');

let homeDir='';

const setHomeDir = exports.setHomeDir = (dir) => {
    homeDir=dir;
}

const runSFDXCommand = exports.runSfdxCommand = (command, params) => {
    let paramArr=[];
    if (''!=params) {
        if (params.charAt(0)==' ') {
            params=params.substring(1);
        }
        paramArr=params.split(' ');
    }
    paramArr.unshift(command);
    paramArr.push('--json');
    
    return runSFDX(paramArr);

}
const runSFDX = exports.runSfdx = (params) => {
    const errFile=path.join(homeDir, 'err.log');
    let err;
    try {
        err=fse.openSync(errFile, 'w');
    }
    catch (exc) {
        throw new Error('Cannot open file ' + errFile + ', home dir = ' + homeDir);
    }
    let result;
    try {
        console.log('At 4');
        
        console.log('Executing command sfdx ' + params);
        const resultJSON=child_process.execFileSync('sfdx', params, {stdio: ['pipe', 'pipe', err]});
        result=JSON.parse(resultJSON);
        fse.closeSync(err);
    }
    catch (exc) {
        console.log('Exception ' + exc);
        fse.closeSync(err);
        let stdoutJSON=exc.stdout;
        let stdout={};
        if ( (stdoutJSON) && (stdoutJSON.length>0) ) {
            stdout=JSON.parse(stdoutJSON);
        }
        if ( (stdout.status) && (stdout.status!==0) ) {
            result=stdout;            
        }
        else {
            const errMsg=''+fse.readFileSync(errFile);
            let bracePos=errMsg.indexOf('{');
            if (-1!=bracePos) {
                resultJSON=errMsg.substring(bracePos);
                console.log('Result = ' + resultJSON);
                result=JSON.parse(resultJSON);
            }
            else {
                throw new Error('sfdx ' + JSON.stringify(params) + ' command failed [' + errMsg + '], orig = ' + exc);
            }
        }
    }
    finally {
        fse.unlinkSync(errFile);
    }
    
    console.log('Returning result = ' + JSON.stringify(result));

    return result;
}

const executeSfdxWithLogging = exports.executeSfdxWithLogging = (startMsg, endMsg, refreshOrgs, command, params, completeCB) => {
    logging.showModal();
    logging.log(startMsg);
    setTimeout(() => {
        const result=runSFDXCommand(command, params);
        if (result.status===0) {
            let username;
            for (let [key, value] of Object.entries(result.result)) {
                logging.log(key + ' : ' + value);
                if (key=='username') {
                    username=value;
                }
            }
            
            logging.log(endMsg);
        }
        else {
            logging.log('Command failed ' + result.message);
        }

        if (completeCB) {
            completeCB(result);
        }
    }, 100);
}

const loadOrgs = exports.loadOrgs = (mainProcess, ele, force) => {
    console.log('Loading orgs');
    let filename=path.join(mainProcess.getHomeDir(), 'orgs.json');
    console.log('looking for file ' + filename);
    console.log('Force = ' + force);
    if ( (fse.existsSync(filename)) && (!force) ) {
        const orgsResult = JSON.parse(fse.readFileSync(filename));
        console.log('Loading file ' + filename);
        orgs=orgsResult.result;
        mainProcess.setOrgs(orgs);
    }
    else {
        console.log('Retrieving orgs');
        const params=['force:org:list', '--json'];
        ui.executeWithSpinner(ele, () => {
            const result=runSFDX(params);
            if (result.status===0)  {
                fse.writeFileSync(filename, JSON.stringify(result));
                orgs=result.result;
                mainProcess.setOrgs(orgs);
            }    
            else {
                alert('Unable to load orgs ' + result.message);
            }
        });
    }
}

const getConfig = exports.getConfig = () => {
    let config={};
    console.log('Getting config settings');
    const params=['force:config:list', '--json'];

    const result=runSFDX(params);
    console.log('Config = ' + JSON.stringify(result));
    if ( (result.status===0) && (result.result.length>0) ) {
        for (let cfgItem of result.result) {
            switch (cfgItem.key) {
                case 'defaultdevhubusername' :
                    config.devhubusername=cfgItem.value;
                    break;
                ;;
                case 'defaultusername' :
                    config.username=cfgItem.value;
                    break;
                ;;
            }
        }
        console.log('Username = ' + config.username + ', devhub = ' + config.devhubusername);
    }

    return config;
}