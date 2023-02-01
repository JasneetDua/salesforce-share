import { LightningElement, api, track } from 'lwc';

export default class ShareItem extends LightningElement {

    @api label;
    @api subLabel;
    @api session;
    @api retUrl;

    @track labelToRender;
    @track subLabelToRender;

    connectedCallback() {
        if (this.label) {
            this.labelToRender = this.label;
            this.subLabelToRender = this.subLabel;
        }
        else{
            const myDomain = this.session.domain.replace('.my.salesforce.com', '');
            const domainElements = myDomain.split('--');
            if (domainElements.length > 1) {
                this.labelToRender = domainElements[1];
                this.subLabelToRender = domainElements[0];

            }
            else {
                this.labelToRender = domainElements[0];
            }
        }
    }


    getSessionUrl(session, retURL) {
        const sessionUrl = `https://${session.domain}/secur/frontdoor.jsp?sid=${session.value}&retURL=${retURL}`;
        return sessionUrl;
    }
}
