const path = require('path');
const orgUtils = require('./orgUtils.js');
const sfdxUtils = require('./sfdxUtils.js');
const ui = require('./ui.js');
const logging = require('./logging.js');

const getFormElements = (param) => {
    const formEle=document.createElement('div');
    formEle.classList.add('slds-form-element', 'slds-form-element_horizontal');
 
    const labelEle=document.createElement('label');
    labelEle.classList.add('slds-form-element__label');
    labelEle.innerHTML=param.label;
    formEle.appendChild(labelEle);
 
    const contEle=document.createElement('div');
    contEle.classList.add('slds-form-element__control');
    contEle.id=param.name + '-container';
    formEle.appendChild(contEle);
 
    return {'formEle': formEle, 'contEle': contEle};
}

const addOrgsParam = (orgs, param) => {
   const formEles=getFormElements(param);
   const inpEle=document.createElement('input');
   inpEle.id=param.name+'-input';
   inpEle.setAttribute('list', param.name+'-list');
   inpEle.classList.add('slds-input', 'selectorg');
   formEles.contEle.appendChild(inpEle);

   const datalist=document.createElement('datalist');
   datalist.id=param.name+'-list';
   let option;

   for (let org of orgs.nonScratchOrgs) {
       if ( (('hub'!=param.variant) || (org.isDevHub)) && ('scratch' != param.variant) ) {
           addOrgOption(datalist, org, false);
       }
   }

   if ('hub' != param.variant) {
       for (let org of orgs.scratchOrgs) {
            addOrgOption(datalist, org, true);
       }                    
   }

   formEles.contEle.appendChild(datalist);
   
   return formEles.formEle;
}

const addOrgOption = (datalist, org, scratch) => {
    option=document.createElement('option');
    option.value=orgUtils.getOrgValue(org, scratch);
    option.label=orgUtils.getOrgValue(org, scratch);
    datalist.appendChild(option);
}

const addLogfileParam = (param) => {
    const formEles=getFormElements(param);

    const butEle=document.createElement('button');
    butEle.classList.add('slds-top-m_small', 'slds-button', 'slds-button_outline-brand', 'slds-m-bottom_small');
    butEle.id=param.name+'-button';
    butEle.innerHTML='Get Log Files';
    formEles.contEle.appendChild(butEle);

    const selContEle=document.createElement('div');
    selContEle.classList.add('slds-select_container');
    formEles.contEle.appendChild(selContEle);

    const selEle=document.createElement('select');
    selEle.classList.add('slds-select');
    selEle.id=param.name+'-select';
    selContEle.appendChild(selEle);
 
    return formEles.formEle;
 }
 
 const getLogFileOptions = (param, username, callback) => {
    let spinEle=document.querySelector('#spinner');
    ui.executeWithSpinner(spinEle, () => {
        const result=sfdxUtils.runSfdxCommand('force:apex:log:list', '-u ' + username);
        addLogFileOptions(result, param);
        callback();
    })
}

const addLogFileOptions=(result, param) => {
    const select=document.querySelector('#' + param.name + '-select');
    while (select.options.length > 0) {                
        select.remove(0);
    }      
    param.values=[];
    let first=true;
    for (let idx=result.result.length-1; idx>=0; idx--) {
        let log=result.result[idx];
        option=document.createElement('option');
        option.value=log.Id;
        option.selected=first;
        option.label=log.LogUser.Name + ' - ' + log.Operation + ' (' + log.LogLength + ') - ' + 
                                    log.StartTime + ', ' + log.Status;
        select.appendChild(option);    
        param.values.push(log.Id);
        first=false;
    }
}

const addPackageParam = (param) => {
    const formEles=getFormElements(param);

    const butEle=document.createElement('button');
    butEle.classList.add('slds-top-m_small', 'slds-button', 'slds-button_outline-brand', 'slds-m-bottom_small');
    butEle.id=param.name+'-button';
    butEle.innerHTML='Get Packages';
    formEles.contEle.appendChild(butEle);

    const selContEle=document.createElement('div');
    selContEle.classList.add('slds-select_container');
    formEles.contEle.appendChild(selContEle);

    const selEle=document.createElement('select');
    selEle.classList.add('slds-select');
    selEle.id=param.name+'-select';
    selContEle.appendChild(selEle);
 
    return formEles.formEle;
 }
 
 const getPackageOptions = exports.getPackageOptions = (param, username, config, callback) => {
    let spinEle=document.querySelector('#spinner');
    ui.executeWithSpinner(spinEle, () => {
        const result=sfdxUtils.runSfdxCommand('force:package:list', '-v ' + username);
        addPackageOptions(result, param, config);
        if (callback) {
            callback();
        }
    })
}

const addPackageOptions=(result, param, config) => {
    const select=document.querySelector('#' + param.name + '-select');
    while (select.options.length > 0) {                
        select.remove(0);
    }      
    param.values=[];
    let first=true;
    for (let idx=result.result.length-1; idx>=0; idx--) {
        let package=result.result[idx];
        option=document.createElement('option');
        option.value=package.Id;
        option.selected=(first||package.Name===config.package);
        option.label=package.Name + ' - ' + package.Description + ' (' + package.Id + ')';
        select.appendChild(option);    
        param.values.push(package.Id);
        first=false;
    }
}

const addPackageVersionParam = (param) => {
    const formEles=getFormElements(param);

    const butEle=document.createElement('button');
    butEle.classList.add('slds-top-m_small', 'slds-button', 'slds-button_outline-brand', 'slds-m-bottom_small');
    butEle.id=param.name+'-button';
    butEle.innerHTML='Get Package Versions';
    formEles.contEle.appendChild(butEle);

    const selContEle=document.createElement('div');
    selContEle.classList.add('slds-select_container');
    formEles.contEle.appendChild(selContEle);

    const selEle=document.createElement('select');
    selEle.classList.add('slds-select');
    selEle.id=param.name+'-select';
    selContEle.appendChild(selEle);
 
    return formEles.formEle;
 }
 
 const getPackageVersionOptions = (param, username, package, config, callback) => {
    let spinEle=document.querySelector('#spinner');
    ui.executeWithSpinner(spinEle, () => {
        const result=sfdxUtils.runSfdxCommand('force:package:version:list', '-v ' + username + ' -p ' + package);
        addPackageVersionOptions(result, param, config);
        callback();
    })
}

const addPackageVersionOptions=(result, param, config) => {
    const select=document.querySelector('#' + param.name + '-select');
    while (select.options.length > 0) {                
        select.remove(0);
    }      
    param.values=[];
    let first=true;
    for (let idx=result.result.length-1; idx>=0; idx--) {
        let package=result.result[idx];
        if (!package.IsReleased) {
            option=document.createElement('option');
            option.value=package.SubscriberPackageVersionId.Id;
            option.selected=first;
            option.label=package.Version + ' - ' + package.Description + ' (' + package.SubscriberPackageVersionId + ')';
            select.appendChild(option);    
            param.values.push(package.Id);
            first=false;        
        }
    }
}

const addNumberParam = (param) => {
    const formEles=getFormElements(param);
    const inpEle=document.createElement('input');
    inpEle.setAttribute('type', 'number');
    inpEle.value=param.default;
    if (param.min) {
        inpEle.setAttribute('min', param.min);
    }
    if (param.pattern) {
        inpEle.setAttribute('max', param.max);
    }
    if (param.pattern) {
        inpEle.setAttribute('pattern', param.pattern);
    }
    if (param.maxlength) {
        inpEle.setAttribute('maxlength', param.maxlength);
    }
    inpEle.id=param.name+'-input';
    formEles.contEle.appendChild(inpEle);
   
    return formEles.formEle;
}

const addFileParam = (param) => {
    const formEles=getFormElements(param);
    const inpEle=document.createElement('input');
    inpEle.setAttribute('type', 'text');
    inpEle.classList.add('slds-input');
    inpEle.id=param.name+'-input';
    inpEle.disabled=true;
    inpEle.required=true;
    formEles.contEle.appendChild(inpEle);

    const butEle=document.createElement('button');
    butEle.classList.add('slds-top-m_small', 'slds-button', 'slds-button_outline-brand');
    butEle.id=param.name+'-button';
    butEle.innerHTML='Choose';
    formEles.contEle.appendChild(butEle);
   
    return formEles.formEle;
}

const addCheckboxParam = (param) => {
    const formEles=getFormElements(param);
    const spanEle=document.createElement('span');
    spanEle.classList.add('slds-checkbox', 'slds-checkbox_standalone');
    formEles.contEle.appendChild(spanEle);

    const inpEle=document.createElement('input');
    inpEle.setAttribute('type', 'checkbox');
    inpEle.classList.add('slds-input');
    inpEle.id=param.name+'-cb';
    inpEle.value=param.name;
    spanEle.appendChild(inpEle);

    const fauxEle=document.createElement('span');
    fauxEle.classList.add('slds-checkbox_faux');
    spanEle.appendChild(fauxEle);

    return formEles.formEle;
}

const addTextParam = (param) => {
    const formEles=getFormElements(param);
    const inpEle=document.createElement('input');
    inpEle.setAttribute('type', 'text');
    inpEle.classList.add('slds-input');
    inpEle.id=param.name+'-input';
    formEles.contEle.appendChild(inpEle);

    return formEles.formEle;
}

const addSelectParam = (param) => {
    const formEles=getFormElements(param);
    const selContEle=document.createElement('div');
    selContEle.classList.add('slds-select_container');
    formEles.contEle.appendChild(selContEle);

    const selEle=document.createElement('select');
    selEle.classList.add('slds-select');
    selEle.id=param.name+'-select';
    selContEle.appendChild(selEle);

    let option;
    let first=true;
    for (let value of param.values) {
        option=document.createElement('option');
        option.value=value;
        option.label=value;
        option.selected=first;
        selEle.appendChild(option);
    }

    return formEles.formEle;
}

const addParams = exports.addParams = (id, command, orgs) => {
    let paramsEle=document.querySelector('#' + id);
    for (let param of command.params) {
        switch (param.type) {
            case 'org':
                paramsEle.appendChild(addOrgsParam(orgs, param));
                break;
            ;;   
            
            case 'number':
                paramsEle.appendChild(addNumberParam(param));
                break;
            ;;

            case 'file':
                paramsEle.appendChild(addFileParam(param));
                break;
            ;;
            
            case 'dir':
                paramsEle.appendChild(addFileParam(param));
                break;
            ;;

            case 'checkbox':
                paramsEle.appendChild(addCheckboxParam(param));
                break;
            ;;

            case 'text':
                paramsEle.appendChild(addTextParam(param));                
                break;
            ;;   
            
            case 'select':
                paramsEle.appendChild(addSelectParam(param));                
                break;
            ;;

            case 'logfile':
                paramsEle.appendChild(addLogfileParam(param));
                break;
            ;;   

            case 'package':
                paramsEle.appendChild(addPackageParam(param));
                break;
            ;;   

            case 'packageversion':
                paramsEle.appendChild(addPackageVersionParam(param));
                break;
            ;;   

            case 'category':
                paramsEle.appendChild(addCategoryParam(param));
                break;
            ;;   

        }    
    }


    if ('user'==command.openorg) {
        let openOrgParam={name: 'open-org',
                         label: 'Open Org?',
                         value: 'open-org'};

        paramsEle.appendChild(addCheckboxParam(openOrgParam));
    }

    if ('user'==command.openFile) {
        let openFileParam={name: 'open-file',
                         label: 'Open File?',
                         value: 'open-file'};

        paramsEle.appendChild(addCheckboxParam(openFileParam));
    }

    return paramsEle;
}

const clearExcludes = (param, command) => {
    let clear=false;
    switch (param.type) {
        case 'checkbox':
            const val=param.input.value;
            if (val==param.name) {
                clear=true;;
            }        
            break;
        ;;

        case 'select':
            let selectedIndex=param.input.selectedIndex;
            if (-1!=selectedIndex) {
                clear=true;
            }
            break;
        ;;

        case 'selectmulti':
            let selectedOptions=param.input.selectedOptions;
            if (0!=selectedOptions.length) {
                clear=true;
            }
            break;
        ;;

        default:
            if (param.input.value!='') {
                clear=true;
            }
    }
    
    if ( (clear) && (null!=param.excludes) ) {
        const excludes=param.excludes.split(',');
        for (let cand of command.params) {
            if (excludes.includes(cand.name)) {
                switch (cand.type) {
                    case 'checkbox':
                        cand.input.checked=false;                    
                        break;
                    ;;
            
                    default:
                        if (null!=cand.input) {
                            if (cand.default) {
                                cand.input.value=param.default;
                            }
                            else {
                                cand.input.value='';
                            }
                        }
                    ;;
                }
            }
        }
    }
}

const addCategoryParam = (param) => {
    const formEles=getFormElements(param);

    const butEle=document.createElement('button');
    butEle.classList.add('slds-top-m_small', 'slds-button', 'slds-button_outline-brand', 'slds-m-bottom_small');
    butEle.id=param.name+'-button';
    butEle.innerHTML='Get Categories';
    formEles.contEle.appendChild(butEle);

    const selContEle=document.createElement('div');
    selContEle.classList.add('slds-select_container');
    formEles.contEle.appendChild(selContEle);

    const selEle=document.createElement('select');
    selEle.classList.add('slds-select');
    selEle.id=param.name+'-select';
    selEle.multiple=true;
    selEle.size=7;
    selContEle.appendChild(selEle);
 
    return formEles.formEle;
 }
 
 const getCategoryOptions = (param, config, callback) => {
    let spinEle=document.querySelector('#spinner');
    ui.executeWithSpinner(spinEle, () => {
        const result=sfdxUtils.runSfdxCommand('scanner:rule:list');
        addCategoryOptions(result, param, config);
        callback();
    })
}

const addCategoryOptions=(result, param, config) => {
    const select=document.querySelector('#' + param.name + '-select');
    while (select.options.length > 0) {                
        select.remove(0);
    }      
    param.values=[];
    let categories=[];
    for (let idx=result.result.length-1; idx>=0; idx--) {
        let rule=result.result[idx];
        for (let category of rule.categories)
        {
            if (!categories.includes(category)) {
                option=document.createElement('option');
                option.value=category;
                option.label=category;
                select.appendChild(option);    
                param.values.push(category);
                categories.push(category);
            }            
        }
    }
}


const addHandlers = exports.addHandlers = (command, callback, config, mainProcess, currentWindow) => {
    // add handlers for inputs
    for (let param of command.params) {
        param.input=document.querySelector('#' + param.name + '-input');
        if (null!=param.input) {
            param.input.addEventListener('change', () => {
                clearExcludes(param, command);
                callback();
            });
        }
        switch (param.type) {
            case 'package' :
                param.button=document.querySelector('#' + param.name + '-button');
                param.button.addEventListener('click', () => {
                    getPackageOptions(param, command.username, config, callback);                    
                });
                param.input=document.querySelector('#' + param.name + '-select');
                param.input.addEventListener('change', () => {
                    callback();
                });
                break;
            ;;
            case 'packageversion' :
                param.button=document.querySelector('#' + param.name + '-button');
                param.button.addEventListener('click', () => {
                    getPackageVersionOptions(param, command.username, command.package, config, callback);                    
                });
                param.input=document.querySelector('#' + param.name + '-select');
                param.input.addEventListener('change', () => {
                    callback();
                });
                break;
            ;;
            case 'logfile' :
                param.button=document.querySelector('#' + param.name + '-button');
                param.button.addEventListener('click', () => {
                    getLogFileOptions(param, command.username, callback);                    
                });
                param.input=document.querySelector('#' + param.name + '-select');
                param.input.addEventListener('change', () => {
                    callback();
                });
                break;
            ;;
            case 'file' :
                param.button=document.querySelector('#' + param.name + '-button');
                param.button.addEventListener('click', () => {
                    const chosen=mainProcess.getFileFromUser(currentWindow, process.cwd());
                    if (''!=chosen) {
                        param.chosenFile=chosen;
                    }
                    param.input.value=chosen;;
                    callback();
                });
                break;
            ;;
            case 'dir' :
                param.button=document.querySelector('#' + param.name + '-button');
                param.button.addEventListener('click', () => {
                    let chosen=mainProcess.getDirectoryFromUser(currentWindow, process.cwd());
                    if (''!=chosen) {
                        if (param.relative) {
                            chosen = path.relative(process.cwd(), chosen);
                        }
                        param.chosenFile=chosen;
                    }
                    param.input.value=chosen;;
                    callback();
                });
                break;
            ;;
            case 'org' :
                if (param.default) {
                    if ( ('hub'==param.variant) && (config.devhubusername) ) {
                        param.input.value=config.devhubusername;
                    }
                    else if (config.username) {
                        param.input.value=config.username;
                    }
                }
                break;
            ;;
            case 'checkbox': 
                param.input=document.querySelector('#' + param.name + '-cb');
                param.input.addEventListener('change', () => {
                    clearExcludes(param, command);
                    callback();
                });
                break;
            ;;
            case 'select':
                param.input=document.querySelector('#' + param.name + '-select');
                param.input.addEventListener('change', () => {
                    clearExcludes(param, command);
                    callback();
                });
                break;
            ;;
            case 'text':
                if (param.default) {
                    param.input.value=param.default;
                }
                break;
            ;;
            case 'category' :
                param.button=document.querySelector('#' + param.name + '-button');
                param.button.addEventListener('click', () => {
                    getCategoryOptions(param, config, callback);                    
                });
                param.input=document.querySelector('#' + param.name + '-select');
                param.input.addEventListener('change', () => {
                    callback();
                });
                break;
            ;;
            
        }
    }
}