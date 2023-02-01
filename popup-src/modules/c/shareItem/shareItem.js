import { LightningElement, api, track } from 'lwc';

export default class ShareItem extends LightningElement {

    @api label;
    @api session;
    @api retUrl;

    @track labelToRender;
    @track sublabelToRender;

    connectedCallback() {
        if (this.label) {
            this.labelToRender = this.label;
        }
        else{
            const myDomain = this.session.domain.replace('.my.salesforce.com', '');
            const domainElements = myDomain.split('--');
            if (domainElements.length > 1) {
                this.labelToRender = domainElements[1];
                this.sublabelToRender = domainElements[0];

            }
            else {
                this.labelToRender = domainElements[0];
            }
        }
    }
}
