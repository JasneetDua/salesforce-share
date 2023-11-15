import { LightningElement, api, track } from 'lwc';

export default class ShareItem extends LightningElement {

    @api label;
    @api subLabel;
    @api session;
    @api retUrl;

    @track labelToRender;
    @track subLabelToRender;
    @track copied = false;

    connectedCallback() {
        if (this.label) {
            this.labelToRender = this.label;
            this.subLabelToRender = this.subLabel;
        }
        else {
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
        let sessionUrl = '';
        if(retURL){
            sessionUrl = `https://${session.domain}/secur/frontdoor.jsp?sid=${session.value}&retURL=${retURL? retURL : ''}`;
        }
        else {
            sessionUrl = `https://${session.domain}/secur/frontdoor.jsp?sid=${session.value}`;
        }
        return sessionUrl;
    }

    handleCopy(event) {
        this.showTip();
        const generatedUrl = this.getSessionUrl(this.session, this.retUrl);
        this.copyToClip(generatedUrl);
    }

    showTip() {
        this.copied = true;
        setTimeout(() => {
            this.copied = false;
        }, 1000);
    }

    copyToClip(value) {
        const el = document.createElement('textarea');
        el.value = value;
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
}
