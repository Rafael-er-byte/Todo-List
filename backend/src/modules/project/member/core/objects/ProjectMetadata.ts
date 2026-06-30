import ValueObject from "../../../../shared/core/objects/ValueObject";

export default class ProjectMetadata extends ValueObject{
    private isFavorite: boolean = false;
    private watch: boolean = false;

    constructor(isFavorite: boolean = false, watch: boolean = false){
        super();
        this.isFavorite = isFavorite;
        this.watch = watch;
    }

    public watchProject(): ProjectMetadata{
        return new ProjectMetadata(this.isFavorite, true);
    }

    public unwatchProject(): ProjectMetadata{
        return new ProjectMetadata(this.isFavorite, false);
    }

    public markAsFavorite(): ProjectMetadata{
        return new ProjectMetadata(true, this.watch);
    }

    public unmarkAsFavorite(): ProjectMetadata{
        return new ProjectMetadata(false, this.watch);
    }

    public isWatching(): boolean{
        return this.watch;
    }

    public favorite(): boolean{
        return this.isFavorite;
    }
}
