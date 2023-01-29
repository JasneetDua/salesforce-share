import { CONSTANTS } from './const.js';

const getSessionUrl = (cookie) => {
    const sessionUrl = `https://${cookie.domain}/secur/frontdoor.jsp?sid=${cookie.value}`;
    return sessionUrl;
}

const showToast = (tabId, message, isError = false) => {
    chrome.tabs.sendMessage(tabId, { 
        message,
        isError, 
        action: CONSTANTS.SHOW_TOAST, 
    });
}

export {
    getSessionUrl,
    showToast
}