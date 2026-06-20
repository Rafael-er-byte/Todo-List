import { describe, it, expect } from 'vitest';
import InvitationCreated from '../../../../../src/modules/invitation/core/events/InvitationCreated';
import InvitationCanceled from '../../../../../src/modules/invitation/core/events/InvitationCanceled';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import DateTime from '../../../../../src/modules/shared/core/objects/DateTime';
import ID from '../../../../../src/modules/shared/core/objects/ID';

describe('Invitation events', () => {
  it('InvitationCreated contains expected data', () => {
    const id = ID.generateId().getId();
    const date = DateTime.now();
    const actor = new IdEntity(ID.generateId().getId());
    const host = new IdEntity(ID.generateId().getId());
    const invitationId = new IdEntity(ID.generateId().getId());

    const ev = new InvitationCreated(id, date, actor, host, invitationId, { foo: 'bar' });

    expect(ev.getEvent()).toBe('INVITATION_CREATED');
    expect((ev.getActor() as IdEntity).getID()).toBe(actor.getID());
    expect(ev.getIdEntity().getID()).toBe(invitationId.getID());
  });

  it('InvitationCanceled contains expected data', () => {
    const id = ID.generateId().getId();
    const date = DateTime.now();
    const actor = new IdEntity(ID.generateId().getId());
    const host = new IdEntity(ID.generateId().getId());
    const invitationId = new IdEntity(ID.generateId().getId());

    const ev = new InvitationCanceled(id, date, actor, host, invitationId);

    expect(ev.getEvent()).toBe('INVITATION_CANCELED');
    expect((ev.getActor() as IdEntity).getID()).toBe(actor.getID());
    expect(ev.getIdEntity().getID()).toBe(invitationId.getID());
  });
});
