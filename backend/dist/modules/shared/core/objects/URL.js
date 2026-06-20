import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';
export default class Url extends ValueObject {
    constructor(newUrl) {
        super();
        this.hostnameRegex = /^[a-zA-Z0-9-.]+$/;
        this.tldRegex = /^[a-zA-Z]{2,}$/;
        let tmpUrl;
        try {
            tmpUrl = new URL(newUrl);
            if (tmpUrl.protocol !== 'http:' && tmpUrl.protocol !== 'https:')
                throw new InvalidParameters('url', newUrl);
            if (!this.hostnameRegex.test(tmpUrl.hostname))
                throw new InvalidParameters('url', newUrl);
            const hostParts = tmpUrl.hostname.split('.');
            if (hostParts.length < 2)
                throw new InvalidParameters('url', newUrl);
            const tld = hostParts[hostParts.length - 1];
            if (!this.tldRegex.test(tld))
                throw new InvalidParameters('url', newUrl);
        }
        catch (error) {
            throw new InvalidParameters('url', newUrl);
            console.error('Invalid URL:', error);
        }
        this.url = newUrl;
    }
    getUrl() {
        return this.url;
    }
}
//# sourceMappingURL=URL.js.map