import type IdEntity from "../objects/IdEntity";

export default class Entity<TID = string | IdEntity>{
    private id!: TID;

    constructor(id: TID){
        this.id = id;
    }

    getId(): TID{
        return this.id;
    }
}
