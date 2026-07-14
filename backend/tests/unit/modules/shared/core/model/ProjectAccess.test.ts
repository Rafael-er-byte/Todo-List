import { describe, expect, it } from "vitest";
import ProjectAccess from "../../../../../../src/modules/project/shared/model/ProjectAccess";
import Unauthorized from "../../../../../../src/modules/shared/core/errors/Unauthorized";
import { AllowedMemberRoles } from "../../../../../../src/modules/shared/core/types/AllowedMemberRoles";
import type { AllowedProjectSetting } from "../../../../../../src/modules/shared/core/types/AllowedProjectSetting";

const PROJECT_ID = "019df05a-8588-758c-b5e7-92af14bf85cf";
const MEMBER_ID = "019df05a-8588-758c-b5e7-92af14bf85c0";

const createProjectAccess = (
  overrides?: Partial<{
    idProject: string;
    idMember: string;
    memberRole: AllowedMemberRoles;
    commentAuthorization: AllowedProjectSetting;
    immutableComment: boolean;
    memberSettings: AllowedProjectSetting;
    resourcesSettings: AllowedProjectSetting;
  }>
) => {
  return new ProjectAccess({
    idProject: PROJECT_ID,
    idMember: MEMBER_ID,
    memberRole: AllowedMemberRoles.admin,
    commentAuthorization: AllowedMemberRoles.member,
    immutableComment: false,
    memberSettings: AllowedMemberRoles.member,
    resourcesSettings: AllowedMemberRoles.member,
    ...overrides,
  });
};

describe("ProjectAccess", () => {
  describe("resourceManagement", () => {
    it("allows access for admin with member resources setting", () => {
      const access = createProjectAccess();

      expect(() => access.resourceManagement()).not.toThrow();
    });

    it("throws Unauthorized when actor is not admin", () => {
      const access = createProjectAccess({ memberRole: AllowedMemberRoles.member });

      expect(() => access.resourceManagement()).toThrow(Unauthorized);
    });

    it("throws Unauthorized when resources setting is not MEMBER", () => {
      const access = createProjectAccess({ resourcesSettings: AllowedMemberRoles.admin });

      expect(() => access.resourceManagement()).toThrow(Unauthorized);
    });
  });

  describe("comment", () => {
    it("allows comment action for admin with member comment authorization", () => {
      const access = createProjectAccess();

      expect(() => access.comment()).not.toThrow();
    });

    it("throws Unauthorized when comment authorization is not MEMBER", () => {
      const access = createProjectAccess({ commentAuthorization: AllowedMemberRoles.admin });

      expect(() => access.comment()).toThrow(Unauthorized);
    });
  });

  describe("unComment", () => {
    it("throws Unauthorized when project comments are immutable", () => {
      const access = createProjectAccess({ immutableComment: true });

      expect(() => access.unComment()).toThrow(Unauthorized);
      expect(() => access.unComment()).toThrow("Comment are inmutable for project with id:");
    });

    it("throws Unauthorized when actor is not admin", () => {
      const access = createProjectAccess({ memberRole: AllowedMemberRoles.member });

      expect(() => access.unComment()).toThrow(Unauthorized);
    });
  });

  describe("memberManagement", () => {
    it("allows member management for admin with member setting", () => {
      const access = createProjectAccess();

      expect(() => access.memberManagement()).not.toThrow();
    });

    it("throws Unauthorized when member setting is not MEMBER", () => {
      const access = createProjectAccess({ memberSettings: AllowedMemberRoles.admin });

      expect(() => access.memberManagement()).toThrow(Unauthorized);
    });
  });

  describe("getters", () => {
    it("returns id member value object", () => {
      const access = createProjectAccess();

      expect(access.getIdMember().toString()).toBe(MEMBER_ID);
    });

    it("returns project id value object", () => {
      const access = createProjectAccess();

      expect(access.getIDProject().toString()).toBe(PROJECT_ID);
    });
  });
});
