import type None from '../../../../shared/core/objects/None';
import type MemberCriteria from '../interfaces/MemberCriteria';
import type Member from '../model/Member';
import type IdMember from '../objects/IdMember';
export default interface MemberRepository {
    create(member: Member): Promise<None>;
    update(member: Member): Promise<None>;
    getById(memberId: IdMember): Promise<Member | None>;
    getByCriteria(criteria: MemberCriteria): Promise<Member[]>;
    getManyByIds(memberIds: IdMember[]): Promise<Member[]>;
}
//# sourceMappingURL=MemberRepository.d.ts.map