import ID from './ID';
export default class IdEntity {
    constructor(id) {
        this.id = ID.fromString(id);
    }
    getID() {
        return this.id.getId();
    }
}
//# sourceMappingURL=IdEntity.js.map