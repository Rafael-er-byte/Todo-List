import { describe, it, expect, vi } from 'vitest';
import Category from "../../../../../../src/modules/project/category/core/model/Category";
import CategoryColor from "../../../../../../src/modules/project/category/core/objects/CategoryColor";
import CategoryName from "../../../../../../src/modules/project/category/core/objects/CategoryName";
import { AllowedColors } from "../../../../../../src/modules/project/category/core/types/AllowedColors";
import ResourceNotFound from "../../../../../../src/modules/shared/core/errors/ResourceNotFound";
import DomainEvent from "../../../../../../src/modules/project/shared/events/DomainEvent";
import IdEntity from "../../../../../../src/modules/shared/core/objects/IdEntity";

const DEFAULT_ID = "019df05a-8588-758c-b5e7-92af14bf85cf";

const createCategoryParams = (
  overrides?: Partial<{
    id: string;
    idProject: string;
    name: string;
    color: AllowedColors;
    idActor: string;
    key: string;
  }>
) => ({
  id: DEFAULT_ID,
  idProject: DEFAULT_ID,
  name: "Backlog",
  color: AllowedColors.BLACK,
  key: "test-key",
  ...overrides
});

const buildCategory = (overrides?: Parameters<typeof createCategoryParams>[0]) => {
  const params = createCategoryParams(overrides);

  return Category.create(
    {
      id: params.id,
      idProject: params.idProject,
      name: params.name,
      color: params.color,
      key: params.key,
      actorId: DEFAULT_ID,
    }
  );
};

const IDMock = {
  getID: vi.fn().mockReturnValue(DEFAULT_ID)
} as unknown as IdEntity;

describe("Category Entity", () => {

  describe("Creation", () => {
    it("should create a valid category", () => {
      const category = buildCategory();

      expect(category.getId().toString()).toBe(DEFAULT_ID);
      expect(category.getIdProject().toString()).toBe(DEFAULT_ID);
    });
  });

  describe("Updates", () => {

    it("should update name", () => {
      const category = buildCategory();

      category.pullEvents();

      category.updateName("test-key-2", new CategoryName("In Progress"), IDMock);

      expect(category.toPrimitives().name).toBe("In Progress");

      const events = category.pullEvents();
      events.forEach((event) => {
        expect(event).toBeInstanceOf(DomainEvent);
        expect(event.getEvent()).toBe("CATEGORY_NAME_CHANGED");
      });
    });

    it("should update color", () => {
      const category = buildCategory();

      category.pullEvents();

      category.updateColor("test-key-3", new CategoryColor(AllowedColors.BLUE), IDMock);

      expect(category.toPrimitives().color).toBe(AllowedColors.BLUE);

      const [event] = category.pullEvents();
      expect(event!.getEvent()).toBe("CATEGORY_COLOR_CHANGED");
    });

  });

  describe("Existence", () => {

    it("should delete a category by emitting an event", () => {
      const category = Category.fromPrimitives(createCategoryParams());

      category.pullEvents();

      category.delete("test-key-4", IDMock);

      const [event] = category.pullEvents();
      expect(event!.getEvent()).toBe("CATEGORY_DELETED");

      // since soft-delete logic was removed, updates should still be allowed
      expect(() =>
        category.updateName("test-key-5", new CategoryName("New Name"), IDMock)
      ).not.toThrow();
    });

  });

  describe("Serialization", () => {

    it("should serialize a category correctly", () => {
      const params = createCategoryParams();
      const category = buildCategory();

      const primitives = category.toPrimitives();

      expect(primitives).toEqual({
        id: params.id,
        idProject: params.idProject,
        name: params.name,
        color: params.color,
      });
    });

    it("should reflect updated values in serialization", () => {
      const category = buildCategory();

      category.updateName("test-key-6", new CategoryName("Done"), IDMock);
      category.updateColor("test-key-7", new CategoryColor(AllowedColors.BLUE), IDMock);

      const primitives = category.toPrimitives();

      expect(primitives.name).toBe("Done");
      expect(primitives.color).toBe(AllowedColors.BLUE);
    });

    it("should include deletedAt when category is deleted", () => {
      const category = buildCategory();

      category.delete("test-key-8", IDMock);

      const primitives = category.toPrimitives();

      expect(primitives.deletedAt).not.toBeNull();
    });

  });

});
