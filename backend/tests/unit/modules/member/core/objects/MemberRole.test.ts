import MemberRoleNotValid from "../../../../../../src/modules/project/member/core/error/MemberRoleNotValid";
import MemberRole from "../../../../../../src/modules/project/member/core/objects/MemberRole";
import {describe, it, expect} from 'vitest';
import { AllowedMemberRoles } from "../../../../../../src/modules/shared/core/types/AllowedMemberRoles";

describe("MemberRole Value Object", () => {

  describe("Creation & validation", () => {
    it("should create a valid role", () => {
      const role = new MemberRole(AllowedMemberRoles.admin);
      expect(role.getRole()).toBe(AllowedMemberRoles.admin);
    });

    it("should throw error for invalid role", () => {
      expect(() => {
        new MemberRole("INVALID" as AllowedMemberRoles);
      }).toThrow(MemberRoleNotValid);
    });
  });
});
