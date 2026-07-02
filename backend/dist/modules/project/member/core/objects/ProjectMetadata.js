import ValueObject from "../../../../shared/core/objects/ValueObject";
export default class ProjectMetadata extends ValueObject {
    constructor(isFavorite = false, watch = false) {
        super();
        this.isFavorite = false;
        this.watch = false;
        this.isFavorite = isFavorite;
        this.watch = watch;
    }
    watchProject() {
        return new ProjectMetadata(this.isFavorite, true);
    }
    unwatchProject() {
        return new ProjectMetadata(this.isFavorite, false);
    }
    markAsFavorite() {
        return new ProjectMetadata(true, this.watch);
    }
    unmarkAsFavorite() {
        return new ProjectMetadata(false, this.watch);
    }
    isWatching() {
        return this.watch;
    }
    favorite() {
        return this.isFavorite;
    }
}
//# sourceMappingURL=ProjectMetadata.js.map