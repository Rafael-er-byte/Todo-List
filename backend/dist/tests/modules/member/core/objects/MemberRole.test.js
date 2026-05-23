import MemberRoleNotValid from "../../../../../src/modules/member/core/error/MemberRoleNotValid";
import MemberRole from "../../../../../src/modules/member/core/objects/MemberRole";
import { AllowedMemberRoles } from "../../../../../src/modules/member/core/types/AllowedMemberRoles";
import { describe, it, expect } from 'vitest';
describe("MemberRole Value Object", () => {
    describe("Creation & validation", () => {
        it("should create a valid role", () => {
            const role = new MemberRole(AllowedMemberRoles.admin);
            expect(role.getRole()).toBe(AllowedMemberRoles.admin);
        });
        it("should throw error for invalid role", () => {
            expect(() => {
                new MemberRole("INVALID");
            }).toThrow(MemberRoleNotValid);
        });
    });
});
//# sourceMappingURL=MemberRole.test.js.map