const orgUtils = require('./orgUtils.js');

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
        }    
    }


    if ('user'==command.openorg) {
        let openOrgParam={name: 'open-org',
                         label: 'Open Org?',
                         value: 'open-org'};

        paramsEle.appendChild(addCheckboxParam(openOrgParam));
    }

    return paramsEle;
}

const addHandlers = exports.addHandlers = (command, callback, username, devhubusername) => {
    // add handlers for inputs
    for (let param of command.params) {
        param.input=document.querySelector('#' + param.name + '-input');
        if (null!=param.input) {
            param.input.addEventListener('change', () => {
                callback();
            });
        }
        switch (param.type) {
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
            case 'org' :
                if ( ('hub'==param.variant) && (devhubusername) ) {
                    param.input.value=devhubusername;
                }
                else if (username) {
                    param.input.value=username;
                }
                break;
            ;;
            case 'checkbox': 
                param.input=document.querySelector('#' + param.name + '-cb');
                param.input.addEventListener('change', () => {
                    callback();
                });
                break;
            ;;
            case 'select':
                param.input=document.querySelector('#' + param.name + '-select');
                param.input.addEventListener('change', () => {
                    callback();
                });
        }
    }
}