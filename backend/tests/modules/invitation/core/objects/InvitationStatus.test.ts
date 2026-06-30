import { describe, it, expect } from 'vitest';
import InvitationStatus, { AllowedInvitationStatus } from '../../../../../src/modules/project/invitation/core/objects/InvitationStatus';

describe('InvitationStatus Value Object', () => {
  it('can be created with factories', () => {
    const pending = InvitationStatus.pending();
    const accepted = InvitationStatus.accepted();
    const canceled = InvitationStatus.canceled();

    expect(pending.getStatus()).toBe(AllowedInvitationStatus.PENDING);
    expect(accepted.getStatus()).toBe(AllowedInvitationStatus.ACCEPTED);
    expect(canceled.getStatus()).toBe(AllowedInvitationStatus.CANCELED);
  });

  it('create() validates values', () => {
    const fromString = InvitationStatus.create('PENDING');
    expect(fromString.getStatus()).toBe(AllowedInvitationStatus.PENDING);

    expect(() => InvitationStatus.create('UNKNOWN' as any)).toThrow();
  });
});
