import { describe, it, expect } from 'vitest';
import Invitation from "../../../../../src/modules/project/invitation/core/model/Invitation";
import Email from "../../../../../src/modules/shared/core/objects/Email";
import { AllowedInvitationStatus } from "../../../../../src/modules/project/invitation/core/objects/InvitationStatus";

const DEFAULT_ID = '019df05a-8588-758c-b5e7-92af14bf85cf';
const HOST_ID = '019df05a-8588-758c-b5e7-92af14bf85c0';
const PROJECT_ID = '019df05a-8588-758c-b5e7-92af14bf85c1';
const GUEST_EMAIL = 'guest@example.com';

const buildInvitation = () => {
  return Invitation.create(
    {
      id: DEFAULT_ID,
      host: HOST_ID,
      projectId: PROJECT_ID,
      guest: GUEST_EMAIL,
    }
  );
};

describe('Invitation Entity', () => {
  it('creates an invitation with pending status', () => {
    const invitation = buildInvitation();

    expect(invitation).toBeInstanceOf(Invitation);
    expect(invitation.getHost().toString()).toBe(HOST_ID);
    expect(invitation.getProjectId().toString()).toBe(PROJECT_ID);
    expect(invitation.getGuest().getEmail()).toBe(GUEST_EMAIL);
    expect(invitation.getStatus().getStatus()).toBe(AllowedInvitationStatus.PENDING);
  });

  it('can be canceled', () => {
    const invitation = buildInvitation();

    invitation.cancel();

    expect(invitation.getStatus().getStatus()).toBe(AllowedInvitationStatus.CANCELED);
  });

  it('can be accepted', () => {
    const invitation = buildInvitation();

    invitation.accept();

    expect(invitation.getStatus().getStatus()).toBe(AllowedInvitationStatus.ACCEPTED);
  });

  it('serializes to primitives and reconstructs from primitives', () => {
    const invitation = buildInvitation();
    const primitives = invitation.toPrimitives();

    expect(primitives.id).toBe(DEFAULT_ID);
    expect(primitives.host).toBe(HOST_ID);
    expect(primitives.projectId).toBe(PROJECT_ID);
    expect(primitives.guest).toBe(GUEST_EMAIL);
    expect(primitives.status).toBe(AllowedInvitationStatus.PENDING);

    const reconstructed = Invitation.fromPrimitives(primitives);
    expect(reconstructed.getHost().toString()).toBe(HOST_ID);
    expect(reconstructed.getProjectId().toString()).toBe(PROJECT_ID);
    expect(reconstructed.getGuest().getEmail()).toBe(GUEST_EMAIL);
    expect(reconstructed.getStatus().getStatus()).toBe(AllowedInvitationStatus.PENDING);
  });

  it('validates email value object', () => {
    expect(() => new Email('not-an-email')).toThrow();
  });
});
