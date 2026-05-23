import IdMember from '../objects/IdMember';
import MemberStatus from '../objects/MemberStatus';
import MemberRole from '../objects/MemberRole';
import Entity from '../../../shared/core/model/Entity';
import MemberAddedToProject from '../events/MemberAddedToProject';
import DateTime from '../../../shared/core/objects/DateTime';
import MemberBlocked from '../events/MemberBlocked';
import MemberActived from '../events/MemberActived';
import MemberDeleted from '../events/MemberDeleted';
import ProjectMetadata from '../objects/ProjectMetadata';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Version from '../../../shared/core/objects/Version';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import MemberRoleChanged from '../events/MemberRoleChanged';
export default class Member extends Entity {
    constructor(id, idProject, idAccount, status, role, projectMetadata) {
        super(id, idProject);
        this.idAccount = idAccount;
        this.status = status;
        this.role = role;
        this.projectMetadata = projectMetadata;
    }
    static create(idMember, idProject, idAccount, role, status, modifier, key) {
        const member = new Member(idMember, idProject, idAccount, status, role, new ProjectMetadata(false, false));
        member.create();
        member.addEvent(new MemberAddedToProject(key, DateTime.now(), modifier, idProject, idMember, member.toPrimitives()));
        return member;
    }
    static fromPrimitives(params) {
        const member = new Member(new IdMember(params.id), new IdEntity(params.idProject), new IdEntity(params.idAccount), MemberStatus.create(params.status), new MemberRole(params.role), new ProjectMetadata());
        member.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
        return member;
    }
    block(key, actor) {
        this.status = MemberStatus.blocked();
        this.addEvent(new MemberBlocked(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    }
    unBlock(key, actor) {
        this.status = MemberStatus.active();
        this.addEvent(new MemberActived(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    }
    changeRole(key, actor, role) {
        this.role = role;
        this.addEvent(new MemberRoleChanged(key, DateTime.now(), actor, this.getIdProject(), super.getID(), role));
    }
    delete(key, actor) {
        this.addEvent(new MemberDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
        super.softDelete();
    }
    isBlocked() {
        return this.status.isBlocked();
    }
    watchProject() {
        this.projectMetadata = this.projectMetadata.watchProject();
    }
    unWatchProject() {
        this.projectMetadata = this.projectMetadata.unwatchProject();
    }
    markAsFavorite() {
        this.projectMetadata = this.projectMetadata.markAsFavorite();
    }
    unMarkAsFavorite() {
        this.projectMetadata = this.projectMetadata.unmarkAsFavorite();
    }
    getIdProject() {
        return super.getOwner();
    }
    toPrimitives() {
        return {
            id: super.getID().getID(),
            idProject: super.getOwner().getID(),
            idAccount: this.idAccount.getID(),
            status: this.status.getStatus(),
            role: this.role.getRole(),
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive()
        };
    }
}
//# sourceMappingURL=Member.js.map