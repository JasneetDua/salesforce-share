import { LightningElement, api, track } from 'lwc';

export default class ShareItem extends LightningElement {

    @api label;
    @api subLabel;
    @api session;
    @api retUrl;
    @api hideAccessKey = false;

    @track labelToRender;
    @track subLabelToRender;
    @track copied = {
        shareLink: false,
        accessKey: false,
    };

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
        const actionName = event.currentTarget.dataset.name;
        if(actionName == 'shareLink'){
            const generatedUrl = this.getSessionUrl(this.session, this.retUrl);
            this.copyToClip(generatedUrl);
            this.showTip(actionName);
        }
        else if(actionName == 'accessKey'){
            this.copyToClip(this.session.value);
            this.showTip(actionName);
        }
    }

    showTip(name) {
        this.copied[name] = true;
        setTimeout(() => {
            this.copied[name] = false;
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
