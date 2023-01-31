import { LightningElement } from 'lwc';

export default class Popup extends LightningElement {

    shareItems = [];

    connectedCallback(){
        this.init();
    }

    async init(){
        const cookies = await chrome.cookies.getAll({ name: 'sid' });
        const sidCookies = cookies.filter((cookie) => {
            return cookie.domain.includes('.my.salesforce.com');
        });
        this.shareItems = sidCookies.map(cookie => {
            return {
                domain: cookie.domain,
                value: cookie.value
            }
        });
    }
}
