import { describe, expect, it } from 'vitest';
import List from '../../../../../src/modules/project/list/core/model/List';
import ReorganizeAndValidateListExportBetweenProjects from '../../../../../src/modules/project/project/core/services/ReorganizeAndValidateListExportBetweenProjects';
import Project from '../../../../../src/modules/project/project/core/model/Project';
import ListEntry from '../../../../../src/modules/project/project/core/aggregates/ListEntry';
import CannotModifyClosedProject from '../../../../../src/modules/project/project/core/errors/CannotModifyClosedProject';
import InvalidPositionInProject from '../../../../../src/modules/project/project/core/errors/InvalidPositionInProject';
import ResourceNotFound from '../../../../../src/modules/shared/core/errors/ResourceNotFound';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import PositiveInteger from '../../../../../src/modules/shared/core/objects/PositiveInteger';

const FROM_PROJECT_ID = '0143c815-7220-7d64-8c42-6f2af4f9fd37';
const TO_PROJECT_ID = '0243c815-7220-7d64-8c42-6f2af4f9fd37';

const buildListEntry = (id: string, position: number, isArchived = false): ListEntry => {
  const entry = new ListEntry();
  entry.idList = new IdEntity(id);
  entry.position = new PositiveInteger(position);
  entry.isArchived = isArchived;
  return entry;
};

const buildProject = (id: string, lists: ListEntry[]): Project =>
  Project.fromPrimitives({
    id,
    status: 'OPEN',
    projectName: 'Project test',
    projectDescription: null,
    background: 'BLUE',
    backgroundType: 'COLOR',
    lists,
    commentAuthorization: 'ADMIN',
    inmutableComment: false,
    addMemberSettings: 'ADMIN',
    createResourcesSettings: 'ADMIN',
    showCompletedTasks: true,
    invitaionToken: null,
  });

const buildList = (id: string, projectId: string, position: number, archived = false): List =>
  List.fromPrimitives({
    id,
    title: 'Backlog',
    position,
    archived,
    tasks: [],
    projectId,
  });

describe('ReorganizeAndValidateListExportBetweenProjects service', () => {
  it('moves a list entry from source project to target project preserving mapped values', () => {
    const movedListId = '0343c815-7220-7d64-8c42-6f2af4f9fd37';
    const from = buildProject(FROM_PROJECT_ID, [
      buildListEntry('0443c815-7220-7d64-8c42-6f2af4f9fd37', 1),
      buildListEntry(movedListId, 2, true),
      buildListEntry('0543c815-7220-7d64-8c42-6f2af4f9fd37', 3),
    ]);
    const to = buildProject(TO_PROJECT_ID, [
      buildListEntry('0643c815-7220-7d64-8c42-6f2af4f9fd37', 1),
    ]);
    const list = buildList(movedListId, FROM_PROJECT_ID, 2, true);

    ReorganizeAndValidateListExportBetweenProjects(from, to, list);

    const fromLists = from.getlists();
    expect(fromLists).toHaveLength(2);
    expect(fromLists.map((item) => item.idList.toString())).toEqual([
      '0443c815-7220-7d64-8c42-6f2af4f9fd37',
      '0543c815-7220-7d64-8c42-6f2af4f9fd37',
    ]);
    expect(fromLists.map((item) => item.position.getValue())).toEqual([1, 2]);

    const toLists = to.getlists();
    expect(toLists).toHaveLength(2);
    expect(toLists.map((item) => item.idList.toString())).toEqual([
      '0643c815-7220-7d64-8c42-6f2af4f9fd37',
      movedListId,
    ]);
    expect(toLists[1]!.position.getValue()).toBe(2);
    // List.fromPrimitives currently initializes archived as false.
    expect(toLists[1]!.isArchived).toBe(false);
  });

  it('throws ResourceNotFound when source project does not contain the list', () => {
    const missingListId = '0743c815-7220-7d64-8c42-6f2af4f9fd37';
    const from = buildProject(FROM_PROJECT_ID, [
      buildListEntry('0843c815-7220-7d64-8c42-6f2af4f9fd37', 1),
    ]);
    const to = buildProject(TO_PROJECT_ID, [
      buildListEntry('0943c815-7220-7d64-8c42-6f2af4f9fd37', 1),
    ]);
    const list = buildList(missingListId, FROM_PROJECT_ID, 1);

    expect(() => ReorganizeAndValidateListExportBetweenProjects(from, to, list)).toThrow(ResourceNotFound);
  });

  it('throws InvalidPositionInProject when target project position is invalid', () => {
    const movedListId = '1043c815-7220-7d64-8c42-6f2af4f9fd37';
    const from = buildProject(FROM_PROJECT_ID, [
      buildListEntry('1143c815-7220-7d64-8c42-6f2af4f9fd37', 1),
      buildListEntry(movedListId, 2),
    ]);
    const to = buildProject(TO_PROJECT_ID, []);
    const list = buildList(movedListId, FROM_PROJECT_ID, 3);

    expect(() => ReorganizeAndValidateListExportBetweenProjects(from, to, list)).toThrow(InvalidPositionInProject);
  });

  it('inserts exported list at first position and shifts target project list positions', () => {
    const movedListId = '1243c815-7220-7d64-8c42-6f2af4f9fd37';
    const from = buildProject(FROM_PROJECT_ID, [
      buildListEntry('1343c815-7220-7d64-8c42-6f2af4f9fd37', 1),
      buildListEntry(movedListId, 2),
    ]);
    const to = buildProject(TO_PROJECT_ID, [
      buildListEntry('1443c815-7220-7d64-8c42-6f2af4f9fd37', 1),
      buildListEntry('1543c815-7220-7d64-8c42-6f2af4f9fd37', 2),
    ]);
    const list = buildList(movedListId, FROM_PROJECT_ID, 1);

    ReorganizeAndValidateListExportBetweenProjects(from, to, list);

    expect(to.getlists().map((item) => item.idList.toString())).toEqual([
      movedListId,
      '1443c815-7220-7d64-8c42-6f2af4f9fd37',
      '1543c815-7220-7d64-8c42-6f2af4f9fd37',
    ]);
    expect(to.getlists().map((item) => item.position.getValue())).toEqual([1, 2, 3]);
    expect(from.getlists().map((item) => item.idList.toString())).toEqual([
      '1343c815-7220-7d64-8c42-6f2af4f9fd37',
    ]);
    expect(from.getlists().map((item) => item.position.getValue())).toEqual([1]);
  });

  it('throws CannotModifyClosedProject when source project is closed', () => {
    const movedListId = '1643c815-7220-7d64-8c42-6f2af4f9fd37';
    const from = buildProject(FROM_PROJECT_ID, [
      buildListEntry(movedListId, 1),
    ]);
    const to = buildProject(TO_PROJECT_ID, []);
    const list = buildList(movedListId, FROM_PROJECT_ID, 1);

    from.close('close-key', new IdEntity('1743c815-7220-7d64-8c42-6f2af4f9fd37'));

    expect(() => ReorganizeAndValidateListExportBetweenProjects(from, to, list)).toThrow(CannotModifyClosedProject);
  });

  it('throws CannotModifyClosedProject when target project is closed', () => {
    const movedListId = '1843c815-7220-7d64-8c42-6f2af4f9fd37';
    const from = buildProject(FROM_PROJECT_ID, [
      buildListEntry('1a43c815-7220-7d64-8c42-6f2af4f9fd37', 1),
      buildListEntry(movedListId, 2),
    ]);
    const to = buildProject(TO_PROJECT_ID, []);
    const list = buildList(movedListId, FROM_PROJECT_ID, 2);

    to.close('close-key', new IdEntity('1943c815-7220-7d64-8c42-6f2af4f9fd37'));

    expect(() => ReorganizeAndValidateListExportBetweenProjects(from, to, list)).toThrow(CannotModifyClosedProject);
  });
});
