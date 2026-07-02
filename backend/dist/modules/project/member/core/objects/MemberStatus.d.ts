import ValueObject from '../../../../shared/core/objects/ValueObject';
import { AllowedMemberStatus } from '../types/AllowedMemberStatus';
export default class MemberStatus extends ValueObject {
    private status;
    private constructor();
    static create(status: AllowedMemberStatus): MemberStatus;
    static blocked(): MemberStatus;
    static active(): MemberStatus;
    getStatus(): AllowedMemberStatus;
    isBlocked(): boolean;
}
//# sourceMappingURL=MemberStatus.d.ts.map