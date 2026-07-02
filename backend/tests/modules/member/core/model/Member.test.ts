import { describe, it, expect } from 'vitest';
import Member from "../../../../../src/modules/project/member/core/model/Member";
import MemberRole from "../../../../../src/modules/project/member/core/objects/MemberRole";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import { AllowedMemberStatus } from "../../../../../src/modules/project/member/core/types/AllowedMemberStatus";
import MemberAddedToProject from "../../../../../src/modules/project/member/core/events/MemberAddedToProject";
import MemberBlocked from "../../../../../src/modules/project/member/core/events/MemberBlocked";
import MemberActived from "../../../../../src/modules/project/member/core/events/MemberActived";
import MemberRoleChanged from "../../../../../src/modules/project/member/core/events/MemberRoleChanged";
import MemberDeleted from "../../../../../src/modules/project/member/core/events/MemberDeleted";
import { AllowedMemberRoles } from '../../../../../src/modules/shared/core/types/AllowedMemberRoles';

const createParams = (overrides?: Partial<{
  id: string;
  idProject: string;
  idAccount: string;
  status: AllowedMemberStatus;
  role: AllowedMemberRoles;
}>) => ({
  id: DEFAULT_ID,
  idProject: DEFAULT_ID,
  idAccount: DEFAULT_ID,
  status: AllowedMemberStatus.active,
  role: AllowedMemberRoles.admin,
  ...overrides
});

const DEFAULT_ID = ID.generateId().toString();
const createActor = () => new IdEntity(ID.generateId().toString());

const createMember = (overrides?: Parameters<typeof createParams>[0]) => {
  const params = createParams(overrides);

  return Member.create(
    {
      id: params.id,
      idProject: params.idProject,
      idAccount: params.idAccount,
      role: params.role,
      status: params.status,
      actor: createActor().toString(),
      key: "member-create-key",
    }
  );
};

describe("Member Entity", () => {

  describe("Creation", () => {

    it("should create a valid member", () => {
      const member = createMember();

      expect(member.getID().toString()).toBe(DEFAULT_ID);
      expect(member.getIdProject().toString()).toBe(DEFAULT_ID);
      expect(member.isBlocked()).toBe(false);
      expect(member.pullEvents()[0]).toBeInstanceOf(MemberAddedToProject);
    });

  });

  describe("Blocking / Unblocking", () => {

    it("should block a member", () => {
      const member = createMember();

      member.block("block-key", createActor());

      expect(member.isBlocked()).toBe(true);
      expect(member.pullEvents()[1]).toBeInstanceOf(MemberBlocked);
    });

    it("should unblock a member", () => {
      const member = createMember();

      member.block("block-key", createActor());
      member.unBlock("unblock-key", createActor());

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

      member.changeRole("role-key", createActor(), newRole);

      const events = member.pullEvents();
      expect(member.toPrimitives().role).toBe(AllowedMemberRoles.member);
      expect(events[0]).toBeInstanceOf(MemberAddedToProject);
      expect(events[1]).toBeInstanceOf(MemberRoleChanged);
    });

  });

  describe("Delete", () => {

    it("should delete member", () => {
      const member = createMember();

      member.delete("delete-key", createActor());

      const events = member.pullEvents();
      expect(events[0]).toBeInstanceOf(MemberAddedToProject);
      expect(events[1]).toBeInstanceOf(MemberDeleted);
    });

  });

  describe("Reconstruction", () => {

    it("should reconstruct a member from primitives", () => {
      const primitives = {
        ...createParams({ role: AllowedMemberRoles.member }),
        projectMetadata: { isFavorite: false, watch: false }
      };

      const member = Member.fromPrimitives(primitives as any);

      expect(member.toPrimitives()).toEqual({
        id: primitives.id,
        idProject: primitives.idProject,
        idAccount: primitives.idAccount,
        status: primitives.status,
        role: primitives.role,
        projectMetadata: primitives.projectMetadata,
      });
      expect(member.getIdProject().toString()).toBe(primitives.idProject);
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
        projectMetadata: { isFavorite: false, watch: false }
      });
    });

  });

});
