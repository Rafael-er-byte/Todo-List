import { describe, it, expect } from 'vitest';
import Member from "../../../../../src/modules/member/core/model/Member";
import MemberRole from "../../../../../src/modules/member/core/objects/MemberRole";
import MemberStatus from "../../../../../src/modules/member/core/objects/MemberStatus";
import IdMember from "../../../../../src/modules/member/core/objects/IdMember";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import { AllowedMemberRoles } from "../../../../../src/modules/member/core/types/AllowedMemberRoles";
import { AllowedMemberStatus } from "../../../../../src/modules/member/core/types/AllowedMemberStatus";
import MemberAddedToProject from "../../../../../src/modules/member/core/events/MemberAddedToProject";
import MemberBlocked from "../../../../../src/modules/member/core/events/MemberBlocked";
import MemberActived from "../../../../../src/modules/member/core/events/MemberActived";
import MemberRoleChanged from "../../../../../src/modules/member/core/events/MemberRoleChanged";
import MemberDeleted from "../../../../../src/modules/member/core/events/MemberDeleted";
const createParams = (overrides) => ({
    id: DEFAULT_ID,
    idProject: DEFAULT_ID,
    idAccount: DEFAULT_ID,
    status: AllowedMemberStatus.active,
    role: AllowedMemberRoles.admin,
    ...overrides
});
const DEFAULT_ID = ID.generateId().getId();
const createModifier = () => new IdEntity(ID.generateId().getId());
const createMember = (overrides) => {
    const params = createParams(overrides);
    return Member.create(new IdMember(params.id), new IdEntity(params.idProject), new IdEntity(params.idAccount), new MemberRole(params.role), MemberStatus.create(params.status), createModifier(), "member-create-key");
};
describe("Member Entity", () => {
    describe("Creation", () => {
        it("should create a valid member", () => {
            const member = createMember();
            expect(member.getID().getID()).toBe(DEFAULT_ID);
            expect(member.getIdProject().getID()).toBe(DEFAULT_ID);
            expect(member.exists()).toBe(true);
            expect(member.isBlocked()).toBe(false);
            expect(member.pullEvents()[0]).toBeInstanceOf(MemberAddedToProject);
        });
    });
    describe("Blocking / Unblocking", () => {
        it("should block a member", () => {
            const member = createMember();
            member.block("block-key", createModifier());
            expect(member.isBlocked()).toBe(true);
            expect(member.pullEvents()[1]).toBeInstanceOf(MemberBlocked);
        });
        it("should unblock a member", () => {
            const member = createMember();
            member.block("block-key", createModifier());
            member.unBlock("unblock-key", createModifier());
            expect(member.isBlocked()).toBe(false);
            const events = member.pullEvents();
            expect(events[1]).toBeInstanceOf(MemberBlocked);
            expect(events[2]).toBeInstanceOf(MemberActived);
        });
    });
    describe("Role changes", () => {
        it("should change role", () => {
            const member = createMember();
            const newRole = new MemberRole(AllowedMemberRoles.member);
            member.changeRole("role-key", createModifier(), newRole);
            const events = member.pullEvents();
            expect(member.toPrimitives().role).toBe(AllowedMemberRoles.member);
            expect(events[0]).toBeInstanceOf(MemberAddedToProject);
            expect(events[1]).toBeInstanceOf(MemberRoleChanged);
        });
    });
    describe("Delete", () => {
        it("should delete member", () => {
            const member = createMember();
            member.delete("delete-key", createModifier());
            expect(member.exists()).toBe(false);
            const events = member.pullEvents();
            expect(events[0]).toBeInstanceOf(MemberAddedToProject);
            expect(events[1]).toBeInstanceOf(MemberDeleted);
        });
    });
    describe("Reconstruction", () => {
        it("should reconstruct a member from primitives", () => {
            const primitives = {
                ...createParams({ role: AllowedMemberRoles.member }),
                deletedAt: null,
            };
            const member = Member.fromPrimitives(primitives);
            expect(member.toPrimitives()).toEqual(primitives);
            expect(member.getIdProject().getID()).toBe(primitives.idProject);
            expect(member.isBlocked()).toBe(false);
        });
    });
    describe("Serialization", () => {
        it("should return correct primitives for a newly created member", () => {
            const member = createMember();
            const primitives = member.toPrimitives();
            expect(primitives).toEqual({
                id: DEFAULT_ID,
                idProject: DEFAULT_ID,
                idAccount: DEFAULT_ID,
                status: AllowedMemberStatus.active,
                role: AllowedMemberRoles.admin,
                deletedAt: null,
            });
        });
    });
});
//# sourceMappingURL=Member.test.js.map