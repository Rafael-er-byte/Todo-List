import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';

export default class Url extends ValueObject {
  private url!: string;
  private readonly hostnameRegex = /^[a-zA-Z0-9-.]+$/;
  private readonly tldRegex = /^[a-zA-Z]{2,}$/;

  constructor(newUrl: string) {
    super();
    let tmpUrl: URL;
    try {
      tmpUrl = new URL(newUrl);
      if (tmpUrl.protocol !== 'http:' && tmpUrl.protocol !== 'https:')
        throw new InvalidParameters('url', newUrl);

      if (!this.hostnameRegex.test(tmpUrl.hostname)) throw new InvalidParameters('url', newUrl);

      const hostParts = tmpUrl.hostname.split('.');
      if (hostParts.length < 2) throw new InvalidParameters('url', newUrl);

      const tld = hostParts[hostParts.length - 1] as string;
      if (!this.tldRegex.test(tld)) throw new InvalidParameters('url', newUrl);
    } catch (error) {
      console.error(error);
      throw new InvalidParameters('url', newUrl);
    }

    this.url = newUrl;
  }

  public getUrl(): string {
    return this.url;
  }
}
