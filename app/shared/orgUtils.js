const logging = require('./logging.js');
const sfdxUtils = require('./sfdxUtils.js');

const extractValidUsername = exports.extractValidUsername = (orgs, val) => {
    let found=false;
    let username=getUsername(val);
    for (let org of orgs.nonScratchOrgs) {
        if ( (org.username===username) || (org.alias===username) ) {
            found=true;
            break;
        }
    }

    if (!found) {
        for (let org of orgs.scratchOrgs) {
            if ( (org.username===username) || (org.alias===username) ) {
                found=true;
                break;
            }
        }        
    }

    return (found?username:null);
}

const getUsername = (val) => {
    // extract the username
    let openParenPos=val.indexOf(' (');
    let scratchPos=val.indexOf(' SCRATCH');
    if (-1!=openParenPos) {
        username=val.substring(0, openParenPos);
    }
    else if (-1!=scratchPos) {
        username=val.substring(0, scratchPos);
    }
    else {
        username=val;
    }

    console.log('username = ' + username);

    return username;
}

const getUsernameFromParams = exports.getUsernameFromParams = (params) => {
    let username;
    for (let param of params) {
        if (param.type=='org') {
            username=getUsername(param.input.value);
        }
    }

    return username;
}

const getOrgValue = exports.getOrgValue = (org, scratch) => {
    let label;
    if (org.alias) {
        label=org.alias + ' (' + org.username + ')';
    }
    else {
        label=org.username;
    }

    if (scratch) {
        label += ' [SCRATCH]';
    }

    return label
}

const openOrgIfConfigured = exports.openOrgIfConfigured = (command, username) => {
    if ('user'==command.openorg) {
        const openOrg=document.querySelector('#open-org-cb:checked');
        if (null!=openOrg) {
            const val=openOrg.value;
            if ( (val=='open-org') && (username!=null) ) {
                logging.log('Opening org');
                sfdxUtils.runSfdx(['force:org:open', '-u', username, '--json']);
            }
        }
    }

}