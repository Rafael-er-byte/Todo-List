import type IdEntity from "../objects/IdEntity";

export default class Entity{
    private id!: IdEntity;

    constructor(id: IdEntity){
        this.id = id;
    }

    geIdEntity(): IdEntity{
        return this.id;
    }
}
