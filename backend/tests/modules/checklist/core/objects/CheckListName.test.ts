import CheckListName from '../../../../../src/modules/checklist/core/objects/CheckListName';
import InvalidParameters from '../../../../../src/modules/shared/core/errors/InvalidParameters';
import LimitExceeded from '../../../../../src/modules/shared/core/errors/LimitExceeded';
import { describe, it, expect } from 'vitest';

describe('CheckListName', () => {
  it('creates a valid checklist name', () => {
    const name = new CheckListName('My checklist');
    expect(name.getName()).toBe('My checklist');
  });

  it('throws when the checklist name is empty', () => {
    expect(() => new CheckListName('')).toThrow(InvalidParameters);
  });

  it('throws when the checklist name exceeds 1000 characters', () => {
    const longName = 'a'.repeat(1001);
    expect(() => new CheckListName(longName)).toThrow(LimitExceeded);
  });
});
