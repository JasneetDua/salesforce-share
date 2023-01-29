import { CONSTANTS } from './scripts/const.js';
import { getSessionUrl, showToast } from './scripts/utils.js';

const shareSalesforce = async (config = {}) => {
    // get active page
    let params = { 
        active: true, 
        currentWindow: true 
    };
    const activeTabs = await chrome.tabs.query(params);

    if(activeTabs && activeTabs.length) {
        const orgId = await chrome.tabs.sendMessage(activeTabs[0].id, { action: CONSTANTS.GET_ORG_ID });
        if(orgId){
            const cookies = await chrome.cookies.getAll({ name: 'sid' });
            const cookie = cookies.find((cookie) => {
                return cookie.value.startsWith(orgId) && cookie.domain.includes('.my.salesforce.com');
            });
            if(cookie){
                try {
                    const sessionUrl = getSessionUrl(cookie);
                    const copied = await chrome.tabs.sendMessage(activeTabs[0].id, { action: CONSTANTS.COPY_TO_CLIP, content: sessionUrl });
                    if(copied){
                        showToast(activeTabs[0].id, 'Copied to Clipboard!');
                    }
                    else {
                        // TODO: error in copy
                    }
                }
                catch(ex) {
                    console.log(ex);
                    showToast(activeTabs[0].id, 'Something went wrong!', true);
                }
            }
            else {
                // session invalid
                showToast(activeTabs[0].id, 'Session not found!', true);
            }
        }
        else {
            // TODO: org id not found
        }
    }
    else {
        // TODO: to show notification if no active salesforce tab found error
    }
}

const pageActionHandler = () => {
    shareSalesforce();
}

// will listen for click of toolbar extension icon
chrome.action.onClicked.addListener(pageActionHandler);
