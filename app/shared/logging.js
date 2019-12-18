let logElement;
let logModal;
let scrolllog;
let closeButton;

const addModal = exports.addModal = (containerId) => {
    const modalEle=document.createElement('div');
    modalEle.classList.add('slds-hide');
    modalEle.id='log-modal';
    
    const sectionEle=document.createElement('section');
    sectionEle.setAttribute('role', 'dialog');
    sectionEle.setAttribute('tabindex', '-1');
    sectionEle.setAttribute('aria-labelledby', 'modal-heading');
    sectionEle.setAttribute('aria-modal', 'true');
    sectionEle.setAttribute('aria-describedby', 'modal-content');
    sectionEle.classList.add('slds-modal');
    sectionEle.classList.add('slds-fade-in-open');
    sectionEle.classList.add('slds-modal_large');
    modalEle.appendChild(sectionEle);

    const modalContainerEle=document.createElement('div');
    modalContainerEle.classList.add('slds-modal__container');
    sectionEle.appendChild(modalContainerEle);

    const headerEle=document.createElement('header');
    headerEle.classList.add('slds-modal__header');
    modalContainerEle.append(headerEle);

    const buttonEle=document.createElement('button');
    buttonEle.classList.add('slds-button');
    buttonEle.classList.add('slds-button_icon');
    buttonEle.classList.add('slds-modal__close');
    buttonEle.classList.add('slds-button_icon-inverse');
    buttonEle.id='modal-close';
    buttonEle.title='Close';
    headerEle.appendChild(buttonEle);

    // SVG doesn't like being added element by element!
    buttonEle.innerHTML='<svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">\n' +
    '            <use xlink:href="style/slds_2_10/icons/utility-sprite/svg/symbols.svg#close"></use>\n' +
    '          </svg>\n';

    const spanEle=document.createElement('span');
    spanEle.classList.add('slds-assistive-text');
    spanEle.innerText='Close';
    buttonEle.appendChild(spanEle);

    const headerTextEle=document.createElement('h2');
    headerTextEle.id='modal-heading';
    headerTextEle.classList.add('slds-modal__title');
    headerTextEle.classList.add('slds-hyphenate');
    headerTextEle.innerText='Log';
    headerEle.appendChild(headerTextEle);

    const contentEle=document.createElement('div');
    contentEle.classList.add('slds-modal__content');
    contentEle.classList.add('slds-p-around_medium');
    contentEle.classList.add('log');
    contentEle.id='modal-content';
    modalContainerEle.appendChild(contentEle);

    const preEle=document.createElement('pre');
    preEle.id='log';
    contentEle.appendChild(preEle);

    const footerEle=document.createElement('footer');
    footerEle.classList.add('slds-modal__footer');
    modalContainerEle.appendChild(footerEle);
    
    const footerButtonEle=document.createElement('button');
    footerButtonEle.classList.add('slds-button');
    footerButtonEle.classList.add('slds-button_neutral');
    footerButtonEle.id='modal-clear';
    footerButtonEle.innerText='Clear';
    footerEle.appendChild(footerButtonEle);

    const backdropEle=document.createElement('div');
    backdropEle.classList.add('slds-backdrop');
    backdropEle.classList.add('slds-backdrop_open');
    modalEle.appendChild(backdropEle)

    const container = document.querySelector('#' + containerId);
    container.appendChild(modalEle);

    logElement = document.querySelector('#log');
    scrolllog = document.querySelector('#modal-content');
    logModal = document.querySelector('#log-modal');

    closeButton = document.querySelector('#modal-close');
    closeButton.addEventListener('click', () => {
        toggleModal();
    });

    clearButton = document.querySelector('#modal-clear');
    clearButton.addEventListener('click', () => {
        logElement.innerHTML='';
        scrolllog.scrollTop = scrolllog.scrollHeight;
    });
}

const toggleModal = exports.toggleModal = () => {
    logModal.classList.toggle('slds-show');
    logModal.classList.toggle('slds-hide');
}

const log = exports.log = (message) => {
    let timestamp=new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    logElement.innerHTML+=timestamp +' : ' + message + '\n';
    scrolllog.scrollTop = scrolllog.scrollHeight;
}
