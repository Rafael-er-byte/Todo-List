import CategoryName from "../../../../../src/modules/project/category/core/objects/CategoryName";
import LimitExceeded from "../../../../../src/modules/shared/core/errors/LimitExceeded";
import { describe, it, expect } from 'vitest';

describe("CategoryName Value Object", () => {

  it("should create a valid category name", () => {
    const name = new CategoryName("To Do");
    expect(name.getName()).toBe("To Do");
  });

  it("should throw an error for a category name that is too long", () => {
    expect(() => {
      new CategoryName("a".repeat(101));
    }).toThrow(LimitExceeded);
  });
}); 
