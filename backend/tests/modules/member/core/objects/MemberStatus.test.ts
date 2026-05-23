import MemberStatusNotSupported from "../../../../../src/modules/member/core/error/MemberStatusNotSupported";
import MemberStatus from "../../../../../src/modules/member/core/objects/MemberStatus";
import { AllowedMemberStatus } from "../../../../../src/modules/member/core/types/AllowedMemberStatus"; 
import { describe, it, expect } from 'vitest';

describe("MemberStatus Value Object", () => {

  it("should create an active status correctly", () => {
    const status = MemberStatus.active();

    expect(status.getStatus()).toBe(AllowedMemberStatus.active);
    expect(status.isBlocked()).toBe(false);
  });

  it("should create a blocked status correctly", () => {
    const status = MemberStatus.blocked();

    expect(status.getStatus()).toBe(AllowedMemberStatus.blocked);
    expect(status.isBlocked()).toBe(true);
  });

  it("should create status using factory method", () => {
    const status = MemberStatus.create(AllowedMemberStatus.active);

    expect(status.getStatus()).toBe(AllowedMemberStatus.active);
  });
  
  it("should throw error for unsupported status", () => {
    expect(() => {
      MemberStatus.create("INVALID" as AllowedMemberStatus);
    }).toThrow(MemberStatusNotSupported);
  });

});
