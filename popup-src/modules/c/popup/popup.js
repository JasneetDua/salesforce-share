import { LightningElement } from 'lwc';
import { CONSTANTS } from 'c/constants';

export default class Popup extends LightningElement {

    isLoading = true;
    currentOrgId;
    activeTabs = [];
    activeOrgCookies = [];
    currentOrgCookies = [];
    otherActiveOrgCookies = [];

    connectedCallback(){
        this.init();
    }

    get haveActiveSessions(){
        return this.activeOrgCookies && this.activeOrgCookies.length;
    }
    
    get haveOtherActiveOrgCookies(){
        return this.otherActiveOrgCookies && this.otherActiveOrgCookies.length;
    }

    get activePageUrl(){
        return this.activeTabs && this.activeTabs.length && this.activeTabs[0].url;
    }

    get currentOrgCookie(){
        return this.currentOrgCookies && this.currentOrgCookies.length && this.currentOrgCookies[0];
    }

    async init(){
        // get active page org id if its a salesforce page.
        const params = { active: true, currentWindow: true };
        const activeTabs = await chrome.tabs.query(params);
        this.activeTabs = activeTabs;
        if (activeTabs && activeTabs.length) {
            try {
                this.currentOrgId = await chrome.tabs.sendMessage(activeTabs[0].id, { action: CONSTANTS.GET_ORG_ID });
            } 
            catch (error) {
                console.log('%cError ', 'background: red', 'content script not loaded');
            }
        }

        // get all active sessions
        const cookies = await chrome.cookies.getAll({ name: 'sid' });
        const activeOrgCookies = cookies.filter((cookie) => {
            return cookie.domain.includes('.my.salesforce.com') || cookie.domain.includes('.my.site.com');
        });
        this.activeOrgCookies = activeOrgCookies;

        if(this.currentOrgId){
            // current org session cookie
            this.currentOrgCookies = activeOrgCookies.filter((cookie) => {
                return cookie.value.startsWith(this.currentOrgId);
            });

            // other orgs session cookie
            this.otherActiveOrgCookies = activeOrgCookies.filter((cookie) => {
                return !cookie.value.startsWith(this.currentOrgId);
            });
        }
        this.isLoading = false;
    }
}
