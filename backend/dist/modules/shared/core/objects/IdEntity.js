import ID from './ID';
export default class IdEntity {
    constructor(id) {
        this.id = ID.fromString(id);
    }
    toString() {
        return this.id.toString();
    }
}
//# sourceMappingURL=IdEntity.js.map