import MemberRole from '../objects/MemberRole';
import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import type MemberParams from '../interfaces/MemberParams';
export default class Member extends Entity {
    private status;
    private role;
    private idProject;
    private idAccount;
    private projectMetadata;
    private constructor();
    static create(params: Omit<MemberParams, 'projectMetadata'> & {
        actor: string;
        key: string;
    }): Member;
    static fromPrimitives(params: MemberParams): Member;
    block(key: string, actor: IdEntity): void;
    unBlock(key: string, actor: IdEntity): void;
    changeRole(key: string, actor: IdEntity, role: MemberRole): void;
    delete(key: string, actor: IdEntity): void;
    isBlocked(): boolean;
    watchProject(): void;
    unWatchProject(): void;
    markAsFavorite(): void;
    unMarkAsFavorite(): void;
    getIdProject(): IdEntity;
    toPrimitives(): MemberParams;
}
//# sourceMappingURL=Member.d.ts.map