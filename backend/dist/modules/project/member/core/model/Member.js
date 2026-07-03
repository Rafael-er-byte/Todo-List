import IdMember from '../objects/IdMember';
import MemberStatus from '../objects/MemberStatus';
import MemberRole from '../objects/MemberRole';
import Entity from '../../../../shared/core/model/Entity';
import MemberAddedToProject from '../events/MemberAddedToProject';
import DateTime from '../../../../shared/core/objects/DateTime';
import MemberBlocked from '../events/MemberBlocked';
import MemberActived from '../events/MemberActived';
import MemberDeleted from '../events/MemberDeleted';
import ProjectMetadata from '../objects/ProjectMetadata';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import MemberRoleChanged from '../events/MemberRoleChanged';
export default class Member extends Entity {
    constructor(id, idProject, idAccount, status, role, projectMetadata) {
        super(id);
        this.idProject = idProject;
        this.idAccount = idAccount;
        this.status = status;
        this.role = role;
        this.projectMetadata = projectMetadata;
    }
    static create(params) {
        const idMember = new IdMember(params.id);
        const idProject = new IdEntity(params.idProject);
        const idAccount = new IdEntity(params.idAccount);
        const role = new MemberRole(params.role);
        const status = MemberStatus.create(params.status);
        const actor = new IdEntity(params.actor);
        const member = new Member(idMember, idProject, idAccount, status, role, new ProjectMetadata(false, false));
        member.addEvent(new MemberAddedToProject(params.key, DateTime.now(), actor, idProject, idMember, member.toPrimitives()));
        return member;
    }
    static fromPrimitives(params) {
        const member = new Member(new IdMember(params.id), new IdEntity(params.idProject), new IdEntity(params.idAccount), MemberStatus.create(params.status), new MemberRole(params.role), new ProjectMetadata(params.projectMetadata.isFavorite, params.projectMetadata.watch));
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
        return this.idProject;
    }
    toPrimitives() {
        return {
            id: super.getID().toString(),
            idProject: this.idProject.toString(),
            idAccount: this.idAccount.toString(),
            status: this.status.getStatus(),
            role: this.role.getRole(),
            projectMetadata: {
                isFavorite: this.projectMetadata.favorite(),
                watch: this.projectMetadata.isWatching()
            }
        };
    }
}
//# sourceMappingURL=Member.js.map