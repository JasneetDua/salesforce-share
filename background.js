import { CONSTANTS } from './scripts/const.js';
import { getSessionUrl, showToast } from './scripts/utils.js';

const shareSalesforce = async (config = {}) => {
    // get active page
    let params = {
        active: true,
        currentWindow: true
    };
    const activeTabs = await chrome.tabs.query(params);

    if (activeTabs && activeTabs.length) {
        const orgId = await chrome.tabs.sendMessage(activeTabs[0].id, { action: CONSTANTS.GET_ORG_ID });
        if (orgId) {
            const cookies = await chrome.cookies.getAll({ name: 'sid' });
            const cookie = cookies.find((cookie) => {
                return cookie.value.startsWith(orgId) && cookie.domain.includes('.my.salesforce.com');
            });
            if (cookie) {
                try {
                    const returnUrl = config.currentPage ? activeTabs[0].url : '';
                    const sessionUrl = getSessionUrl(cookie, returnUrl);
                    const copied = await chrome.tabs.sendMessage(activeTabs[0].id, { action: CONSTANTS.COPY_TO_CLIP, content: sessionUrl });
                    if (copied) {
                        showToast(activeTabs[0].id, 'Copied to Clipboard!');
                    }
                    else {
                        showToast(activeTabs[0].id, 'Error copying the URL. Please try again later!', true);
                    }
                }
                catch (ex) {
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
            showToast(activeTabs[0].id, 'Action not available!', true);
        }
    }
    else {
        const config = {
            type: 'basic',
            iconUrl: './images/icons/icon-128.png',
            title: 'Notification',
            message: 'Strange, No active salesforce tab found!'
        };
        chrome.notifications.create('SalesforceShare' + (new Date().getTime()), config);
    }
}

// context menu creation
const CONTEXT_MENU_COMMANDS = [
    { id: CONSTANTS.SHARE_HOME_PAGE, title: 'Home Page', contexts: ['all'] },
    { id: CONSTANTS.SHARE_CURRENT_PAGE, title: 'Current Page', contexts: ['all'] }
];

const createContextMenu = () => {
    removeContextMenu();
    CONTEXT_MENU_COMMANDS.forEach((command) => {
        chrome.contextMenus.create(command);
    });

    // context menu listener
    chrome.contextMenus.onClicked.addListener((request) => {
        if (request.menuItemId == CONSTANTS.SHARE_HOME_PAGE) {
            shareSalesforce({ homePage: true });
        }
        else if (request.menuItemId == CONSTANTS.SHARE_CURRENT_PAGE) {
            shareSalesforce({ currentPage: true });
        }
    });
}

const removeContextMenu = () => {
    chrome.contextMenus.removeAll();
}

const pageActionHandler = () => {
    shareSalesforce({ homePage: true });
}

// will listen for click of toolbar extension icon
chrome.action.onClicked.addListener(pageActionHandler);


const activateExtension = async(tabId, d, activeTab) => {
    const urlObj = new URL(activeTab.url);
    const origin = urlObj.origin.toLowerCase();

    if(origin && (origin.endsWith('salesforce.com') || origin.endsWith('force.com'))){
        const orgId = await chrome.tabs.sendMessage(tabId, { action: CONSTANTS.GET_ORG_ID });
        if(orgId && orgId.startsWith('00D')){
            chrome.action.enable(tabId);
            createContextMenu();
        }
        else {
            chrome.action.disable(tabId);
            removeContextMenu();
        }
    }
    else {
        chrome.action.disable(tabId);
        removeContextMenu();
    }
}
// chrome.tabs.onUpdated.addListener(activateExtension);