import IdMember from '../objects/IdMember';
import MemberStatus from '../objects/MemberStatus';
import MemberRole from '../objects/MemberRole';
import Entity from '../../../shared/core/model/Entity';
import type iMemberParams from '../interfaces/MemberParams';
import type { AllowedMemberRoles } from '../types/AllowedMemberRoles';
import type { AllowedMemberStatus } from '../types/AllowedMemberStatus';
import MemberAddedToProject from '../events/MemberAddedToProject';
import DateTime from '../../../shared/core/objects/DateTime';
import MemberBlocked from '../events/MemberBlocked';
import MemberActived from '../events/MemberActived';
import MemberChangedRole from '../events/MemberRoleChanged';
import MemberDeleted from '../events/MemberDeleted';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import None from '../../../shared/core/objects/None';
import ProjectMetadata from '../objects/ProjectMetadata';
import IdEntity from '../../../shared/core/objects/IdEntity';
import type MemberParams from '../interfaces/MemberParams';
import Version from '../../../shared/core/objects/Version';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import InternalId from '../../../shared/core/objects/InternalId';

export default class Member extends Entity {
  private idProject!: IdEntity;
  private status!: MemberStatus;
  private role!: MemberRole;
  private idAccount!: IdEntity;
  private projectMetadata!: ProjectMetadata;

  private constructor(
    id: IdMember,
    internalID: InternalId | None,
    idProject: IdEntity,
    idAccount: IdEntity,
    status: MemberStatus,
    role: MemberRole,
    projectMetadata: ProjectMetadata
  ) {
    super(id, internalID);
    this.idAccount = idAccount;
    this.idProject = idProject;
    this.status = status;
    this.role = role;
    this.projectMetadata = projectMetadata;
  }

  public static create(
    idMember:IdMember,
    idProject: IdEntity,
    idAccount: IdEntity,
    role: MemberRole,
    status: MemberStatus,
    modifier: IdEntity,
    key: string

  ): Member {
  
    const member = new Member(
      idMember,
      new None(),
      idProject,
      idAccount,
      status,
      role,
      new ProjectMetadata(false, false)
    );

    member.create();
    member.addEvent(
      new MemberAddedToProject(key, DateTime.now(), modifier, idProject, idMember, member.toPrimitives()),
    );
    return member;
  }

  public static fromPrimitives(params: MemberParams): Member {
    const member = new Member(
      new IdMember(params.id),
      new InternalId(params.idInternal as number),
      new IdEntity(params.idProject),
      new IdEntity(params.idAccount),
      MemberStatus.createFromPrimitive(params.status),
      new MemberRole(params.role),
      new ProjectMetadata()  
    );

    member.build(new Version(params.version as number), (params.deletedAt instanceof Date)? DeletedAt.createDeleted(DateTime.create(params.deletedAt)): DeletedAt.createActive());
    return member;
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
