// es import not yet supported in content scripts.
// update should be in const file
const CONSTANTS = {
    GET_ORG_ID: 'GetOrgId',
    COPY_TO_CLIP: 'CopyToClip',
    SHOW_TOAST: 'ShowToast',
    SHARE_HOME_PAGE: 'ShareHomePage',
    SHARE_CURRENT_PAGE: 'ShareCurrentPage',
};

// general utils
const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const getOrgIdFromCookie = () => {
    var sid = getCookie('sid');
    var orgId = sid ? sid.split('!')[0] : null;
    return orgId;
}

// init sweet alert
const toastMixin = Swal.mixin({
    toast: true,
    icon: 'success',
    title: 'General Title',
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const showToast = ({ message, isError }) => {
    toastMixin.fire({
        title: message,
        icon: isError ? 'error' : 'success'
    });
}

const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

// general utils ends here

const messageHandler = (request, sender, sendResponse) => {
    if (request.action == CONSTANTS.GET_ORG_ID) {
        const orgId = getOrgIdFromCookie();
        sendResponse(orgId);
    }
    else if (request.action == CONSTANTS.SHOW_TOAST) {
        showToast({ 
            message: request.message, 
            isError: request.isError 
        });
    }
    else if(request.action == CONSTANTS.COPY_TO_CLIP){
        copyToClipboard(request.content);
        sendResponse(true);
    }
}

// will listen for message on runtime
chrome.runtime.onMessage.addListener(messageHandler);