import ValueObject from './ValueObject';
export default class Url extends ValueObject {
    private url;
    private readonly hostnameRegex;
    private readonly tldRegex;
    constructor(newUrl: string);
    getUrl(): string;
}
//# sourceMappingURL=URL.d.ts.map