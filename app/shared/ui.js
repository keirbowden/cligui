const addOrgSelect = exports.addOrgSelect = (containerId, orgs, id) => {
    const inp=document.createElement('input');
    inp.id=id;
    inp.setAttribute('list', 'org-list');
    inp.classList.add('selectorg');

    const datalist=document.createElement('datalist');
    datalist.id='org-list';

    addOptions(datalist, orgs);

    const container = document.querySelector('#' + containerId);
    container.appendChild(inp);
    container.appendChild(datalist);
}

const resetOrgSelect = exports.resetOrgSelect = (input, orgs) => {
    input.value='';
    const datalist=document.querySelector('#org-list');
    datalist.innerHTML='';
    addOptions(datalist, orgs)
}

const addOptions = (datalist, orgs) => {
    let option=document.createElement('option');
    option.value='Please select';
    datalist.appendChild(option);
    
    for (let org of orgs) {
        option=document.createElement('option');
        option.value=org.username;
        datalist.appendChild(option);
    }
}

const addSpinner = exports.addSpinner = (id) => {
    const spinDiv=document.createElement('div');
    spinDiv.classList.add('slds-spinner_container', 'slds-hide'); 
    spinDiv.id=id;

    const statusDiv=document.createElement('div');
    statusDiv.classList.add('slds-spinner', 'slds-spinner_medium', 'slds-spinner_brand');
    statusDiv.setAttribute('role', 'status');
    spinDiv.appendChild(statusDiv);

    const assistSpan=document.createElement('span');
    assistSpan.classList.add('slds-assistive-text');
    assistSpan.textContent='Loading';
    statusDiv.appendChild(assistSpan);

    const dotADiv=document.createElement('div');
    dotADiv.classList.add('slds-spinner__dot-a');
    statusDiv.appendChild(dotADiv);

    const dotBDiv=document.createElement('div');
    dotBDiv.classList.add('slds-spinner__dot-b');
    statusDiv.appendChild(dotBDiv);

    document.body.appendChild(spinDiv);
}

const toggleSpinner = exports.toggleSpinner = (ele) => {
    if (null!=ele) {
        console.log('Toggling spinner');
        ele.classList.toggle('slds-show');
        ele.classList.toggle('slds-hide');
    }
}

const executeWithSpinner = exports.executeWithSpinner = (ele, fn) => {
    toggleSpinner(ele);
    setTimeout( () => {
        fn();
        toggleSpinner(ele);
    }, 100);
}

const setupHeader = exports.setupHeader = (command, mainProcess) => {
    const iconEle=document.querySelector('#icon');
    iconEle.setAttributeNS('http://www.w3.org/1999/xlink', 'href', iconEle.getAttributeNS('http://www.w3.org/1999/xlink', 'href') + command.icon);
    document.title=command.label;
    const headerAssist=document.querySelector('#header-assist');
    headerAssist.innerHTML=command.label;
    const titleEle=document.querySelector('#title');
    titleEle.innerHTML=command.label;
    titleEle.title=command.label;
    const helpButton = document.querySelector('#help-button');
    helpButton.addEventListener('click', () => {
        mainProcess.createWindow('help.html', 500, 750, 50, 50, {name: command.name, command: command.subcommand});
    });
}

const setupFooter = exports.setupFooter = (id, username, devhubusername, message) => {
    const footerEle=document.querySelector('#' + id)
    footerEle.innerHTML='Directory: ' + process.cwd() + (username?' | User: ' + username:'') + 
                        (devhubusername?' | Dev Hub: ' + devhubusername:'') + 
                        (message?' | ' + message:'');
}
