import { describe, it, expect } from 'vitest';
import Invitation from "../../../../../src/modules/invitation/core/model/Invitation";
import IdInvitation from "../../../../../src/modules/invitation/core/objects/IdInvitation";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import Email from "../../../../../src/modules/shared/core/objects/Email";
import InvitationStatus, { AllowedInvitationStatus } from "../../../../../src/modules/invitation/core/objects/InvitationStatus";
import InvitationCreated from "../../../../../src/modules/invitation/core/events/InvitationCreated";
import InvitationCanceled from "../../../../../src/modules/invitation/core/events/InvitationCanceled";

const DEFAULT_ID = '019df05a-8588-758c-b5e7-92af14bf85cf';
const HOST_ID = '019df05a-8588-758c-b5e7-92af14bf85c0';
const PROJECT_ID = '019df05a-8588-758c-b5e7-92af14bf85c1';
const GUEST_EMAIL = 'guest@example.com';
const ACTOR_ID = '019df05a-8588-758c-b5e7-92af14bf85c2';

const buildInvitation = () => {
  return Invitation.create(
    'create-key',
    new IdInvitation(DEFAULT_ID),
    new IdEntity(HOST_ID),
    new IdEntity(PROJECT_ID),
    new Email(GUEST_EMAIL),
  );
};

describe('Invitation Entity', () => {
  it('creates an invitation and emits INVITATION_CREATED', () => {
    const invitation = buildInvitation();

    expect(invitation).toBeInstanceOf(Invitation);
    expect(invitation.getHost().getID()).toBe(HOST_ID);
    expect(invitation.getProjectId().getID()).toBe(PROJECT_ID);
    expect(invitation.getGuest().getEmail()).toBe(GUEST_EMAIL);
    expect(invitation.getStatus().getStatus()).toBe(AllowedInvitationStatus.PENDING);

    const events = invitation.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(InvitationCreated);
    expect(events[0]!.getEvent()).toBe('INVITATION_CREATED');
  });

  it('can be canceled and emits INVITATION_CANCELED', () => {
    const invitation = buildInvitation();
    invitation.pullEvents();

    invitation.cancel('cancel-key');

    expect(invitation.getStatus().getStatus()).toBe(AllowedInvitationStatus.CANCELED);
    const events = invitation.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(InvitationCanceled);
    expect(events[0]!.getEvent()).toBe('INVITATION_CANCELED');
  });

  it('can be accepted without emitting an event (status changes)', () => {
    const invitation = buildInvitation();
    invitation.pullEvents();

    invitation.accept('accept-key');

    expect(invitation.getStatus().getStatus()).toBe(AllowedInvitationStatus.ACCEPTED);
    const events = invitation.pullEvents();
    expect(events).toHaveLength(0);
  });

  it('delete emits INVITATION_CANCELED (per implementation)', () => {
    const invitation = buildInvitation();
    invitation.pullEvents();

    invitation.delete('delete-key');

    const events = invitation.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(InvitationCanceled);
    expect(events[0]!.getEvent()).toBe('INVITATION_CANCELED');
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
    expect(reconstructed.getHost().getID()).toBe(HOST_ID);
    expect(reconstructed.getProjectId().getID()).toBe(PROJECT_ID);
    expect(reconstructed.getGuest().getEmail()).toBe(GUEST_EMAIL);
    expect(reconstructed.getStatus().getStatus()).toBe(AllowedInvitationStatus.PENDING);
  });

  it('validates email value object', () => {
    expect(() => new Email('not-an-email')).toThrow();
  });
});
