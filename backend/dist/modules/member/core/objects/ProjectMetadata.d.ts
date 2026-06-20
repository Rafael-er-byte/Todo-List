import ValueObject from "../../../shared/core/objects/ValueObject";
export default class ProjectMetadata extends ValueObject {
    private isFavorite;
    private watch;
    constructor(isFavorite?: boolean, watch?: boolean);
    watchProject(): ProjectMetadata;
    unwatchProject(): ProjectMetadata;
    markAsFavorite(): ProjectMetadata;
    unmarkAsFavorite(): ProjectMetadata;
    isWatching(): boolean;
    favorite(): boolean;
}
//# sourceMappingURL=ProjectMetadata.d.ts.map