import Category from "../../../../../src/modules/category/core/model/Category";
import CategoryColor from "../../../../../src/modules/category/core/objects/CategoryColor";
import CategoryName from "../../../../../src/modules/category/core/objects/CategoryName";
import IdCategory from "../../../../../src/modules/category/core/objects/IdCategory";
import { AllowedColors } from "../../../../../src/modules/category/core/types/AllowedColors";
import ResourceNotFound from "../../../../../src/modules/shared/core/errors/ResourceNotFound";
import DomainEvent from "../../../../../src/modules/shared/core/events/DomainEvent";

import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";

const DEFAULT_ID = "019df05a-8588-758c-b5e7-92af14bf85cf";

const createCategoryParams = (
  overrides?: Partial<{
    id: string;
    idProject: string;
    name: string;
    color: AllowedColors;
    version: number;
    deletedAt: Date | null;
    idActor: string;
    internalId: number | null;
  }>
) => ({
  id: DEFAULT_ID,
  idProject: DEFAULT_ID,
  name: "Backlog",
  color: AllowedColors.BLACK,
  version: 1,
  deletedAt: null,
  internalId: null,
  ...overrides
});

const buildCategory = (overrides?: Parameters<typeof createCategoryParams>[0]) => {
  const params = createCategoryParams(overrides);

  return Category.create(
    new IdCategory(params.id),
    new CategoryName(params.name),
    new CategoryColor(params.color),
    new IdEntity(DEFAULT_ID),
    new IdEntity(params.idProject)
  );
};

const IDMock = {
  getID: jest.fn().mockReturnValue(DEFAULT_ID)
} as unknown as jest.Mocked<IdEntity>;

describe("Category Entity", () => {

  describe("Creation", () => {
    it("should create a valid category", () => {
      const category = buildCategory();

      expect(category.getId().getID()).toBe(DEFAULT_ID);
      expect(category.exists()).toBe(true);
    });
  });

  describe("Updates", () => {

    it("should update name", () => {
      const category = buildCategory();

      category.pullEvents();

      category.updateName(new CategoryName("In Progress"), IDMock);

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

      category.updateColor(new CategoryColor(AllowedColors.BLUE), IDMock);

      expect(category.toPrimitives().color).toBe(AllowedColors.BLUE);

      const [event] = category.pullEvents();
      expect(event!.getEvent()).toBe("CATEGORY_COLOR_CHANGED");
    });

  });

  describe("Existence", () => {

    it("should return false when status is deleted", () => {
      const category = Category.fromPrimitives(
        createCategoryParams({ deletedAt: new Date(), internalId: 1 })
      );

      expect(category.exists()).toBe(false);
    });

    it("should delete a category", () => {
      const category = Category.fromPrimitives(
        createCategoryParams({ deletedAt: null, internalId: 1 })
      );

      category.pullEvents();

      expect(category.exists()).toBe(true);

      category.delete(IDMock);

      expect(category.exists()).toBe(false);

      const [event] = category.pullEvents();
      expect(event!.getEvent()).toBe("CATEGORY_DELETED");

      expect(() =>
        category.updateName(new CategoryName("New Name"), IDMock)
      ).toThrow(ResourceNotFound);
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
        version: params.version,
        deletedAt: params.deletedAt,
        internalId: params.internalId
      });
    });

    it("should reflect updated values in serialization", () => {
      const category = buildCategory();

      category.updateName(new CategoryName("Done"), IDMock);
      category.updateColor(new CategoryColor(AllowedColors.BLUE), IDMock);

      const primitives = category.toPrimitives();

      expect(primitives.name).toBe("Done");
      expect(primitives.color).toBe(AllowedColors.BLUE);
    });

    it("should include deletedAt when category is deleted", () => {
      const category = buildCategory();

      category.delete(IDMock);

      const primitives = category.toPrimitives();

      expect(primitives.deletedAt).not.toBeNull();
    });

  });

});
