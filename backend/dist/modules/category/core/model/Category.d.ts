import CategoryName from '../objects/CategoryName';
import Entity from '../../../shared/core/model/Entity';
import CategoryColor from '../objects/CategoryColor';
import type CategoryParams from '../interfaces/CategoryParams';
import IdEntity from '../../../shared/core/objects/IdEntity';
export default class Category extends Entity {
    private name;
    private color;
    private idProject;
    private constructor();
    static create(params: CategoryParams & {
        key: string;
        actorId: string;
    }): Category;
    static fromPrimitives(params: CategoryParams): Category;
    updateName(key: string, name: CategoryName, actor: IdEntity): void;
    updateColor(key: string, color: CategoryColor, actor: IdEntity): void;
    delete(key: string, actor: IdEntity): void;
    getIdProject(): IdEntity;
    toPrimitives(): CategoryParams;
}
//# sourceMappingURL=Category.d.ts.map