const child_process = require('child_process');
const logging = require('./logging.js');
const orgUtils = require('./orgUtils.js');
const fse=require('fs-extra');
const ui = require('./ui.js');
const path=require('path');

const runSfdxCommand = exports.runSfdxCommand = (command, params) => {
    let paramArr=[];
    if ( (params) && (''!=params) ) {
        if (params.charAt(0)==' ') {
            params=params.substring(1);
        }
        paramArr=params.replace(/(\\)?\ /g, function($0, $1){
            return $1 ? '\ ' : '[****]';
          }).split('[****]');          
    }
    paramArr.unshift(command);
    paramArr.push('--json');
    
    return runSfdx(paramArr);

}

const getSfdxExe = exports.getSfdxExe = () => {
    let exe='sfdx';
    if (process.platform === "win32") {
        exe='sfdx.cmd';
    }

    return exe;
}

const runSfdx = exports.runSfdx = (params) => {
    let result;
    try {
        let resultJSON;
        if (-1!=params[0].indexOf('scanner:run'))
        {
            let command=getSfdxExe();
            for (let param of params)
            {
                command+=' ' + param;
            }
            resultJSON=child_process.execSync(command, {stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 20 * 1024 * 1024});
        }
        else {
            resultJSON=child_process.execFileSync(getSfdxExe(), params, {stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 20 * 1024 * 1024});
        }

        result=JSON.parse(resultJSON);
    }
    catch (exc) {
        console.log('Caught exception ' + exc);
        let stdoutJSON=exc.stdout.toString();
        if ( (stdoutJSON) && (stdoutJSON.length>0) ) {
            console.log('stdoutJSON = ' + stdoutJSON);
            let stdout=JSON.parse(stdoutJSON);
            if ( (stdout.status) && (stdout.status!==0) ) {
                result=stdout;            
            }
        }
        else {
            const errMsg=exc.stderr.toString();
            let bracePos=errMsg.indexOf('{');
            if (-1!=bracePos) {
                resultJSON=errMsg.substring(bracePos);
                result=JSON.parse(resultJSON);
            }
            else {
                throw new Error('sfdx ' + JSON.stringify(params) + ' command failed [' + errMsg + '], orig = ' + exc);
            }
        }
    }
    
    return result;
}

const executeSfdxWithLogging = exports.executeSfdxWithLogging = (command, params, completeCB) => {
    logging.toggleModal();
    logging.log(command.startMessage);
    setTimeout(() => {
        let success=true;
        const result=runSfdxCommand(command.subcommand, params);
        if ( (result.status===0) && 
             ((!result.result.failures) || (0==result.result.failures.length)) ) {
            if (command.resultprocessor) {
                switch (command.resultprocessor) {
                    case 'loglist' :
                        logLogListResult(result.result);
                        break;
                    ;;
                    case 'packageversionlist' :
                        logPackageVersionListResult(result.result);
                        break;
                    ;;
                    case 'packagelist' :
                        logPackageListResult(result.result);
                        break;
                    ;;
                    case 'logfile':
                        logLogFileResult(result.result);
                        break;
                    ;;
                    case 'scannerrules':
                        logScannerRulesResult(result.result);
                        break;
                    ;;
                    case 'scannerrun':
                        logging.log(result.result);
                        break;
                    ;;
                }
            }
            else {
                for (let [key, value] of Object.entries(result.result)) {
                    logging.log(key + ' : ' + value);
                }
            }
        }
        else {
            success=false;
            if (result.message) {
                logging.log('Command failed ' + result.message);
            }
            else {
                if (result.result.failures)
                {
                    logging.log('Command failed');
                    for (let failure of result.result.failures) {
                        logging.log(failure.name + ' - ' + failure.message);
                    }    
                }
            }
        }

        if (success) {
            if ( (command.polling) && (command.polling.supported) ) {
                pollCommandStatus(command, result, completeCB);
            }
            else {
                logging.log(command.completeMessage);
            }    
        }

        if ( ((!command.polling) || (!command.polling.supported)) && (completeCB) ) {
            completeCB(success, result);
        }
    }, 100);
}

const pollCommandStatus = (command, result, completeCB) => {
    let username=orgUtils.getUsernameFromParams(command.params);
    switch (command.polling.type) {
        case 'test':
            let jobId=result.result.testRunId;
            let interval=setInterval(() => {
                let pollResult=runSfdxCommand('force:apex:test:report', '-i ' + jobId + ' -u ' + username + ' -w 2');
                let stop=false;
                let success=true;
                if ( (pollResult.status===1) && (!pollResult.message.includes('timeout')) ) {
                    logging.log('Poll failed - ' + pollResult.message);
                    stop=true;
                    success=false;
                }
                else if ( (pollResult.status==0) || (pollResult.status==100) ) {
                    logging.log('Test run complete');
                    logTestResults(pollResult.result);
                    stop=true;
                }
                if (stop) {
                    clearInterval(interval);
                    logging.log(command.completeMessage);
                    if (completeCB) {
                        completeCB(success, result);
                    }
                }
            }, 30000);    
            break;
        ;;
    }

}
const logLogFileResult = (result) => {
    let log;
    if (Array.isArray(result)) {
        log=result[0].log;
    }
    else {
        log=result.log;
    }
    logging.log('------------- Log File Start -------------');
    logging.log(log);
    logging.log('------------- Log File End -------------');
}

const logLogListResult = (result) => {
    for (let log of getLogList(result)) {
        logging.log(log);
    }
}

const getLogList = (result) => {
    let logEntries=[];
    let idx=0;
    for (let log of result) {
        logEntries.push(++idx + ' : ' + log.LogUser.Name + ' - ' + log.Operation + ' (' + log.LogLength + ') - ' + 
                    log.StartTime + ', ' + log.Status);
    }

    return logEntries;
}

const logPackageListResult = (result) => {
    for (let package of getPackageList(result)) {
        logging.log(package);
    }
}

const getPackageList = (result) => {
    let packageEntries=[];
    let idx=0;
    for (let package of result) {
        packageEntries.push(++idx + ' : ' + package.Name + ' - ' + package.Description + ', ' + package.ContainerOptions + ' (' + package.Id + ')');
    }

    return packageEntries;
}

const logPackageVersionListResult = (result) => {
    for (let version of getPackageVersionList(result)) {
        logging.log(version);
    }
}

const getPackageVersionList = (result) => {
    let versionEntries=[];
    let idx=0;
    for (let version of result) {
        versionEntries.push(++idx + ' : ' + version.Name + ' - ' + version.Description + ', ' + (version.IsReleased?'Released. ':'') + 'Created ' + version.CreatedDate + ' (' + version.SubscriberPackageVersionId + ')');
    }

    return versionEntries;
}

const logTestResults = (result) => {
    logging.log('Outcome', result.summary.outcome);
    logging.log('Tests Executed : ' + result.summary.testsRan);
    logging.log('Tests Passed   : ' + result.summary.passing);
    logging.log('Tests Failed   : ' +  result.summary.failing);

    let idx=1;
    if (0!==result.summary.passing) {
        logging.log('Passing : ');
        for (let test of result.tests)
        {
            if (test.Outcome==='Pass') {
                logging.log('  ' + (idx++) + ') ' + test.ApexClass.Name + '.' + test.MethodName);
            }
        }
    }

    if (0!==result.summary.failing) {
        idx=1;
        logging.log('Failures : ');
        for (let test of result.tests)
        {
            if (test.Outcome!=='Pass') {
                logging.log('  ' + (idx++) + ') ' + test.ApexClass.Name + '.' + test.MethodName + ' - ' + test.Message);
            }
        }
    }
}

const logScannerRulesResult = (result) => {
    for (let rule of getRuleList(result)) {
        logging.log(rule);
    }
}

const getRuleList = (result) => {
    let ruleEntries=[];
    let idx=0;
    for (let rule of result) {
        ruleEntries.push(++idx + ' : ' + rule.name + ' - ' + rule.categories + ', ' + rule.languages + ', ' + rule.engine);
    }

    return ruleEntries;
}


const loadOrgs = exports.loadOrgs = (mainProcess, ele, force) => {
    let filename=path.join(mainProcess.getDataDir(), 'orgs.json');
    if ( (fse.existsSync(filename)) && (!force) ) {
        const orgsResult = JSON.parse(fse.readFileSync(filename));
        orgs=orgsResult.result;
        mainProcess.setOrgs(orgs, false);
    }
    else {
        const params=['force:org:list', '--json'];
        ui.executeWithSpinner(ele, () => {
            const result=runSfdx(params);
            if (result.status===0)  {
                orgs=result.result;
                for (let org of orgs.nonScratchOrgs) {
                    delete org.accessToken;
                }
                for (let org of orgs.scratchOrgs) {
                    delete org.accessToken;
                }
                fse.writeFileSync(filename, JSON.stringify(result));
                mainProcess.setOrgs(orgs, true);
            }    
            else {
                alert('Unable to load orgs ' + result.message);
            }
        });
    }
}

const getConfig = exports.getConfig = () => {
    let config={};
    const params=['force:config:list', '--json'];

    const result=runSfdx(params);
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
    }

    // open file
    let projectFileName='./sfdx-project.json';
    if (fse.existsSync(projectFileName)) {
        config.project = JSON.parse(fse.readFileSync(projectFileName));
        config.package=config.project.packageDirectories[0].package;
    }
    else {
        config.project=null;
    }

    return config;
}