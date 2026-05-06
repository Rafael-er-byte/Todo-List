import IdMember from '../objects/IdMember';
import MemberStatus from '../objects/MemberStatus';
import MemberRole from '../objects/MemberRole';
import Entity from '../../../shared/core/model/Entity';
import type iMemberParams from '../interfaces/MemberParams';
import MemberInfo from '../objects/MemberInfo';
import type { AllowedMemberRoles } from '../types/AllowedMemberRoles';
import type { AllowedMemberStatus } from '../types/AllowedMemberStatus';
import MemberAddedToProject from '../events/MemberAddedToProject';
import DateTime from '../../../shared/core/objects/DateTime';
import MemberBlocked from '../events/MemberBlocked';
import MemberActived from '../events/MemberActived';
import MemberChangedRole from '../events/MemberRoleChanged';
import MemberDeleted from '../events/MemberDeleted';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import IdProject from '../../../shared/core/objects/IdProject'; 

export default class Member extends Entity {
  private id!: IdMember;
  private idProject!: IdProject;
  private status!: MemberStatus;
  private role!: MemberRole;
  private memberInfo!: MemberInfo;

  private constructor(
    id: IdMember,
    idProject: IdProject,
    status: MemberStatus,
    role: MemberRole,
    memberInfo: MemberInfo,
  ) {
    super();
    this.id = id;
    this.idProject = idProject;
    this.status = status;
    this.role = role;
    if (!(memberInfo instanceof MemberInfo))
      throw new InvalidParameters('Member Info is not valid');
    this.memberInfo = memberInfo;
  }

  public static create(params: iMemberParams, modifier: Member): Member {
    const idMember = new IdMember(params.id);
    const projectId = new IdProject(params.idProject);
    const memberRole = new MemberRole(params.role as AllowedMemberRoles);

    const member = new Member(
      idMember,
      projectId,
      MemberStatus.create(params.status as AllowedMemberStatus),
      memberRole,
      params.memberInfo,
    );

    member.addEvent(
      new MemberAddedToProject(DateTime.now(), modifier, projectId, idMember, params),
    );
    return member;
  }

  public static fromPrimitives(params: iMemberParams): Member {
    return new Member(
      new IdMember(params.id),
      new IdProject(params.idProject),
      MemberStatus.create(params.status as AllowedMemberStatus),
      new MemberRole(params.role as AllowedMemberRoles),
      params.memberInfo,
    );
  }

  public block(modifier: Member): void {
    this.status = MemberStatus.blocked();
    this.addEvent(new MemberBlocked(DateTime.now(), modifier, this.idProject, this.id));
  }

  public unBlock(modifier: Member): void {
    this.status = MemberStatus.active();
    this.addEvent(new MemberActived(DateTime.now(), modifier, this.idProject, this.id));
  }

  public changeRole(role: MemberRole, modifier: Member): void {
    this.role = role;
    this.addEvent(new MemberChangedRole(DateTime.now(), modifier, this.idProject, this.id, role));
  }

  public delete(modifier: Member): void {
    this.status = MemberStatus.deleted();
    this.addEvent(new MemberDeleted(DateTime.now(), modifier, this.idProject, this.id));
  }

  public isBlocked(): boolean {
    return this.status.isBlocked();
  }

  public exists(): boolean {
    return !this.status.isDeleted();
  }

  public canManageProject(): boolean {
    return this.role.canManageProject();
  }

  public canManageMembers(): boolean {
    return this.role.canManageMembers();
  }

  public canManageCategories(): boolean {
    return this.role.canManageCategories();
  }

  public canManageLists(): boolean {
    return this.role.canManageLists();
  }

  public canManageTasks(): boolean {
    return this.role.canManageTasks();
  }

  public canUpdateTasks(): boolean {
    return this.role.canUpdateTasks();
  }

  public getId(): string {
    return this.id.getID();
  }

  public toPrimitives(): iMemberParams {
    return {
      id: this.id.getID(),
      idProject: this.idProject.getID(),
      status: this.status.getStatus(),
      role: this.role.getRole(),
      memberInfo: this.memberInfo,
    };
  }
}
