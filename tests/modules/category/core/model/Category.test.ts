import Category from "../../../../../src/modules/category/core/model/Category";
import CategoryColor from "../../../../../src/modules/category/core/objects/CategoryColor";
import CategoryName from "../../../../../src/modules/category/core/objects/CategoryName";
import { AllowedColors } from "../../../../../src/modules/category/core/types/AllowedColors";
import ResourceNotFound from "../../../../../src/modules/shared/core/errors/ResourceNotFound";
import DomainEvent from "../../../../../src/modules/shared/core/events/DomainEvent";

import type IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import type InternalId from "../../../../../src/modules/shared/core/objects/InternalId";

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
    internalId: InternalId;
  }>
) => ({
  id: DEFAULT_ID,
  idProject: DEFAULT_ID,
  name: "Backlog",
  color: AllowedColors.BLACK,
  version: 1,
  deletedAt: null,
  idActor: DEFAULT_ID,
  internalId: 1,
  ...overrides
});

const buildCategory = (overrides?: Parameters<typeof createCategoryParams>[0]) => {
  const params = createCategoryParams(overrides);

  return Category.create(
    params.id,
    params.name,
    params.color,
    params.version,
    params.deletedAt,
    params.idActor,
    params.idProject
  );
};

const IDMock = {
  getID: jest.fn().mockReturnValue(DEFAULT_ID)
} as unknown as jest.Mocked<IdEntity>;

describe("Category Entity", () => {

  describe("Creation", () => {
    it("should create a valid category", () => {
      const category = buildCategory();

      expect(category.getId()).toBe(DEFAULT_ID);
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
        createCategoryParams({ deletedAt: new Date() })
      );

      expect(category.exists()).toBe(false);
    });

    it("should delete a category", () => {
      const category = buildCategory({ deletedAt: null });

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

});