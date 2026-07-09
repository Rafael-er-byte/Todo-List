import { describe, expect, it, vi } from "vitest";
import ProjectPolicyGuard from "../../../../../../src/modules/shared/core/guards/ProjectPolicyGuard";
import { AccessType } from "../../../../../../src/modules/shared/core/types/AccessType";
import InvalidParameters from "../../../../../../src/modules/shared/core/errors/InvalidParameters";
import InvalidOperation from "../../../../../../src/modules/shared/core/errors/InvalidOperation";
import type ProjectPolicyRepository from "../../../../../../src/modules/shared/core/repository/ProjectPolicyRepository";
import { DTO } from "../../../../../../src/modules/shared/core/handler/DTO";

const PROJECT_ID = "019df05a-8588-758c-b5e7-92af14bf85cf";
const MEMBER_ID = "019df05a-8588-758c-b5e7-92af14bf85c0";

const createDTO = (overrides?: Partial<Record<"idProject" | "idMember", string>>): DTO => ({
  idProject: PROJECT_ID,
  idMember: MEMBER_ID,
  ...overrides,
}) as DTO;

const createAccessMock = () => ({
  resourceManagement: vi.fn(),
  memberManagement: vi.fn(),
  comment: vi.fn(),
  unComment: vi.fn(),
});

describe("ProjectPolicyGuard", () => {
  it("throws InvalidParameters when idProject is missing", async () => {
    const repo = {
      getMemberFromProjectWithProjectPolicy: vi.fn(),
    } as unknown as ProjectPolicyRepository;
    const guard = new ProjectPolicyGuard(repo);

    await expect(
      guard.guard({ idMember: MEMBER_ID } as DTO, AccessType.resource)
    ).rejects.toThrow(InvalidParameters);

    expect(repo.getMemberFromProjectWithProjectPolicy).not.toHaveBeenCalled();
  });

  it("throws InvalidParameters when idMember is missing", async () => {
    const repo = {
      getMemberFromProjectWithProjectPolicy: vi.fn(),
    } as unknown as ProjectPolicyRepository;
    const guard = new ProjectPolicyGuard(repo);

    await expect(
      guard.guard({ idProject: PROJECT_ID } as DTO, AccessType.resource)
    ).rejects.toThrow(InvalidParameters);

    expect(repo.getMemberFromProjectWithProjectPolicy).not.toHaveBeenCalled();
  });

  it("calls resourceManagement for RESOURCE access", async () => {
    const access = createAccessMock();
    const repo = {
      getMemberFromProjectWithProjectPolicy: vi.fn().mockResolvedValue(access),
    } as unknown as ProjectPolicyRepository;
    const guard = new ProjectPolicyGuard(repo);

    await guard.guard(createDTO(), AccessType.resource);

    expect(repo.getMemberFromProjectWithProjectPolicy).toHaveBeenCalledOnce();
    expect(access.resourceManagement).toHaveBeenCalledOnce();
    expect(access.memberManagement).not.toHaveBeenCalled();
    expect(access.comment).not.toHaveBeenCalled();
    expect(access.unComment).not.toHaveBeenCalled();
  });

  it("calls memberManagement for MEMBER access", async () => {
    const access = createAccessMock();
    const repo = {
      getMemberFromProjectWithProjectPolicy: vi.fn().mockResolvedValue(access),
    } as unknown as ProjectPolicyRepository;
    const guard = new ProjectPolicyGuard(repo);

    await guard.guard(createDTO(), AccessType.member);

    expect(access.memberManagement).toHaveBeenCalledOnce();
    expect(access.resourceManagement).not.toHaveBeenCalled();
    expect(access.comment).not.toHaveBeenCalled();
    expect(access.unComment).not.toHaveBeenCalled();
  });

  it("calls comment for COMMENT access", async () => {
    const access = createAccessMock();
    const repo = {
      getMemberFromProjectWithProjectPolicy: vi.fn().mockResolvedValue(access),
    } as unknown as ProjectPolicyRepository;
    const guard = new ProjectPolicyGuard(repo);

    await guard.guard(createDTO(), AccessType.comment);

    expect(access.comment).toHaveBeenCalledOnce();
    expect(access.resourceManagement).not.toHaveBeenCalled();
    expect(access.memberManagement).not.toHaveBeenCalled();
    expect(access.unComment).not.toHaveBeenCalled();
  });

  it("calls unComment for REMOVE_COMMENT access", async () => {
    const access = createAccessMock();
    const repo = {
      getMemberFromProjectWithProjectPolicy: vi.fn().mockResolvedValue(access),
    } as unknown as ProjectPolicyRepository;
    const guard = new ProjectPolicyGuard(repo);

    await guard.guard(createDTO(), AccessType.removeComment);

    expect(access.unComment).toHaveBeenCalledOnce();
    expect(access.resourceManagement).not.toHaveBeenCalled();
    expect(access.memberManagement).not.toHaveBeenCalled();
    expect(access.comment).not.toHaveBeenCalled();
  });

  it("throws InvalidOperation for unsupported access type", async () => {
    const access = createAccessMock();
    const repo = {
      getMemberFromProjectWithProjectPolicy: vi.fn().mockResolvedValue(access),
    } as unknown as ProjectPolicyRepository;
    const guard = new ProjectPolicyGuard(repo);

    await expect(
      guard.guard(createDTO(), "INVALID_ACCESS" as unknown as AccessType)
    ).rejects.toThrow(InvalidOperation);
  });
});
