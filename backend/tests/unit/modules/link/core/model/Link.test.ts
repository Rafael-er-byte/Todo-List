import { describe, it, expect } from 'vitest';
import Link from '../../../../../../src/modules/project/link/core/model/Link';
import type LinkParams from '../../../../../../src/modules/project/link/core/interfaces/LinkParams';
import Text from '../../../../../../src/modules/shared/core/objects/Text';
import None from '../../../../../../src/modules/shared/core/objects/None';
import IdEntity from '../../../../../../src/modules/shared/core/objects/IdEntity';

const LINK_ID = '019df05a-8588-758c-b5e7-92af14bf85d0';
const TASK_ID = '019df05a-8588-758c-b5e7-92af14bf85d1';
const CREATOR_ID = '019df05a-8588-758c-b5e7-92af14bf85d2';
const URL_VALUE = 'https://example.com/test-link';
const INITIAL_TEXT = 'Initial visible text';
const UPDATED_TEXT = 'Updated visible text';

const createLinkParams = (
  overrides?: Partial<LinkParams>,
): LinkParams => ({
  id: LINK_ID,
  idTask: TASK_ID,
  url: URL_VALUE,
  visibleText: INITIAL_TEXT,
  ...overrides,
});

describe('Link', () => {
  it('creates a link and emits a LinkCreated event', () => {
    const link = Link.create(
      {
        id: LINK_ID,
        idTask: TASK_ID,
        url: URL_VALUE,
        visibleText: INITIAL_TEXT,
        key: 'create-key',
        actor: CREATOR_ID,
      },
    );

    const events = link.pullEvents();

    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('LINK_CREATED');
    expect(link.getId().toString()).toBe(LINK_ID);
    expect(link.getTaskId().toString()).toBe(TASK_ID);
    expect(link.getUrl().getUrl()).toBe(URL_VALUE);
    expect(link.getVisibleText()).toBeInstanceOf(Text);
    expect((link.getVisibleText() as Text).getText()).toBe(INITIAL_TEXT);
  });

  it('updates visible text and emits LinkVisibleTextUpdated event', () => {
    const link = Link.create(
      {
        id: LINK_ID,
        idTask: TASK_ID,
        url: URL_VALUE,
        visibleText: INITIAL_TEXT,
        key: 'create-key',
        actor: CREATOR_ID,
      },
    );

    link.pullEvents();
    const originalUrl = link.getUrl().getUrl();

    link.updateVisibleText('update-key', new Text(UPDATED_TEXT), new IdEntity(CREATOR_ID));

    const events = link.pullEvents();

    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('LINK_VISIBLE_TEXT_UPDATED');
    expect((link.getVisibleText() as Text).getText()).toBe(UPDATED_TEXT);
    expect(link.getUrl().getUrl()).toBe(originalUrl);
  });

  it('deletes the link and emits LinkDeleted event', () => {
    const link = Link.create(
      {
        id: LINK_ID,
        idTask: TASK_ID,
        url: URL_VALUE,
        visibleText: INITIAL_TEXT,
        key: 'create-key',
        actor: CREATOR_ID,
      },
    );

    link.pullEvents();
    link.delete('delete-key', new IdEntity(CREATOR_ID));

    const events = link.pullEvents();

    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('LINK_DELETED');
  });

  it('reconstructs from primitives and preserves visible text when present', () => {
    const params = createLinkParams();
    const link = Link.fromPrimitives(params);

    expect(link.getId().toString()).toBe(LINK_ID);
    expect(link.getTaskId().toString()).toBe(TASK_ID);
    expect(link.getUrl().getUrl()).toBe(URL_VALUE);
    expect(link.getVisibleText()).toBeInstanceOf(Text);
    expect((link.getVisibleText() as Text).getText()).toBe(INITIAL_TEXT);
  });

  it('reconstructs from primitives with no visible text', () => {
    const params = createLinkParams({ visibleText: null });
    const link = Link.fromPrimitives(params);

    expect(link.getVisibleText()).toBeInstanceOf(None);
    expect(link.getUrl().getUrl()).toBe(URL_VALUE);
  });
});
