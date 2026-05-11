import type IdEntity from '../../../shared/core/objects/IdEntity';
import type None from '../../../shared/core/objects/None';
import type MemberCriteria from '../interfaces/MemberCriteria';
import type Member from '../model/Member';
import type IdMember from '../objects/IdMember';

export default interface iMemberRepository {
  create(member: Member): Promise<None>;
  update(member: Member): Promise<None>;
  getById(projectId: IdEntity, memberId: IdMember): Promise<Member | None>;
  getByCriteria(projectId: IdEntity, criteria: MemberCriteria): Promise<Member[]>;
  updateManyByIds(projectId: IdEntity, members: Member[]): Promise<void>;
  getManyByIds(projectId: IdEntity, memberIds: IdMember[]): Promise<Member[]>;
}
