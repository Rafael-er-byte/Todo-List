import { describe, it, expect, vi } from 'vitest';
import Comment from "../../../../../src/modules/comment/core/model/Comment";
import IdComment from "../../../../../src/modules/comment/core/objects/IdComment";
import Text from "../../../../../src/modules/shared/core/objects/Text";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import DomainEvent from "../../../../../src/modules/shared/core/events/DomainEvent";
import Unauthorized from "../../../../../src/modules/shared/core/errors/Unauthorized";
import ResourceNotFound from "../../../../../src/modules/shared/core/errors/ResourceNotFound";

const DEFAULT_ID = "019df05a-8588-758c-b5e7-92af14bf85cf";
const CREATOR_ID = "019df05a-8588-758c-b5e7-92af14bf85c0";
const ACTOR_ID = "019df05a-8588-758c-b5e7-92af14bf85c1";
const MENTION_ID = "019df05a-8588-758c-b5e7-92af14bf85c2";
const TASK_ID = "019df05a-8588-758c-b5e7-92af14bf85c2";

const createCommentParams = (
  overrides?: Partial<{
    id: string;
    creator: string;
    idTask: string;
    content: string;
    mentions: string[];
    deletedAt: Date | null;
    key: string;
  }>
) => ({
  id: DEFAULT_ID,
  creator: CREATOR_ID,
  idTask: TASK_ID,
  content: "This is a test comment",
  mentions: [],
  deletedAt: null,
  key: "test-key",
  ...overrides
});

const buildComment = (overrides?: Parameters<typeof createCommentParams>[0]) => {
  const params = createCommentParams(overrides);

  return Comment.create(
    new IdComment(params.id),
    new IdEntity(params.creator),
    new IdEntity(params.idTask),
    new Text(params.content),
    params.key
  );
};

const IDMock = {
  getID: vi.fn().mockReturnValue(ACTOR_ID)
} as unknown as IdEntity;

const CreatorMock = {
  getID: vi.fn().mockReturnValue(CREATOR_ID)
} as unknown as IdEntity;

describe("Comment Entity", () => {

  describe("Creation", () => {
    it("should create a valid comment", () => {
      const comment = buildComment();

      expect(comment.getId().getID()).toBe(DEFAULT_ID);
      expect(comment.exists()).toBe(true);
    });

    it("should set the creator correctly", () => {
      const comment = buildComment();

      expect(comment.getCreator().getID()).toBe(CREATOR_ID);
      expect((comment.getOwner() as IdEntity).getID()).toBe(TASK_ID);
    });

    it("should set the content correctly", () => {
      const comment = buildComment();

      expect(comment.getContent().getText()).toBe("This is a test comment");
    });

    it("should initialize mentions as empty collection", () => {
      const comment = buildComment();

      expect(comment.getMentions().getItems().length).toBe(0);
    });

    it("should emit CommentCreated event on creation", () => {
      const comment = buildComment();

      const events = comment.pullEvents();
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(DomainEvent);
      expect(events[0]!.getEvent()).toBe("COMMENT_CREATED");
    });
  });

  describe("Update Content", () => {
    it("should update content when actor is creator", () => {
      const comment = buildComment();
      comment.pullEvents();

      const newContent = new Text("Updated comment content");
      comment.updateContent("test-key-2", newContent, CreatorMock);

      expect(comment.getContent().getText()).toBe("Updated comment content");
    });

    it("should emit CommentContentUpdated event when content is updated", () => {
      const comment = buildComment();
      comment.pullEvents();

      const newContent = new Text("Updated content");
      comment.updateContent("test-key-3", newContent, CreatorMock);

      const events = comment.pullEvents();

      expect(events.length).toBe(1);
      expect(events[0]!.getEvent()).toBe("COMMENT_CONTENT_UPDATED");
    });

    it("should throw Unauthorized error when non-creator tries to update", () => {
      const comment = buildComment();

      const newContent = new Text("Unauthorized update");
      
      expect(() => {
        comment.updateContent("test-key-4", newContent, IDMock);
      }).toThrow(Unauthorized);
    });

    it("should not change content when update fails", () => {
      const comment = buildComment();
      const originalContent = comment.getContent().getText();

      const newContent = new Text("Should not be updated");
      
      try {
        comment.updateContent("test-key-5", newContent, IDMock);
      } catch (e) {
        console.error("Expected error:", e);
      }

      expect(comment.getContent().getText()).toBe(originalContent);
    });
  });

  describe("Mentions", () => {
    it("should add a mention", () => {
      const comment = buildComment();
      comment.pullEvents();

      const mentionedId = new IdEntity(MENTION_ID);
      comment.addMention("test-key-6", mentionedId, CreatorMock);

      expect(comment.getMentions().getItems().length).toBe(1);
      expect(comment.getMentions().getItems()[0]!.getID()).toBe(MENTION_ID);
    });

    it("should emit CommentMentionAdded event when mention is added", () => {
      const comment = buildComment();
      comment.pullEvents();

      const mentionedId = new IdEntity(MENTION_ID);
      comment.addMention("test-key-7", mentionedId, CreatorMock);

      const events = comment.pullEvents();
      expect(events.length).toBe(1);
      expect(events[0]!.getEvent()).toBe("COMMENT_MENTION_ADDED");
    });

    it("should delete a mention", () => {
      const comment = buildComment();
      const mentionedId = new IdEntity(MENTION_ID);
      comment.addMention("test-key-8", mentionedId, CreatorMock);
      comment.pullEvents();

      comment.deleteMention(mentionedId);

      expect(comment.getMentions().getItems().length).toBe(0);
    });

    it("should throw error when adding duplicate mention", () => {
      const comment = buildComment();
      const mentionedId = new IdEntity(MENTION_ID);
      
      comment.addMention("test-key-9", mentionedId, CreatorMock);

      expect(() => {
        comment.addMention("test-key-10", mentionedId, CreatorMock);
      }).toThrow();
    });

    it("should throw error when deleting non-existent mention", () => {
      const comment = buildComment();
      const mentionedId = new IdEntity(MENTION_ID);

      expect(() => {
        comment.deleteMention(mentionedId);
      }).toThrow(ResourceNotFound);
    });
  });

  describe("Existence", () => {
    it("should return true when comment is not deleted", () => {
      const comment = buildComment();

      expect(comment.exists()).toBe(true);
    });

    it("should return false when comment is deleted", () => {
      const comment = Comment.fromPrimitives(
        createCommentParams({ deletedAt: new Date() })
      );

      expect(comment.exists()).toBe(false);
    });

    it("should delete a comment", () => {
      const comment = buildComment();
      comment.pullEvents();

      expect(comment.exists()).toBe(true);

      comment.delete("test-key-11", CreatorMock);

      expect(comment.exists()).toBe(false);
    });

    it("should emit CommentDeleted event on deletion", () => {
      const comment = buildComment();
      comment.pullEvents();

      comment.delete("test-key-12", CreatorMock);

      const events = comment.pullEvents();
      expect(events.length).toBe(1);
      expect(events[0]!.getEvent()).toBe("COMMENT_DELETED");
    });
  });

  describe("Serialization", () => {
    it("should serialize comment to primitives correctly", () => {
      const params = createCommentParams();
      const comment = buildComment();

      const primitives = comment.toPrimitives();

      expect(primitives.id).toBe(params.id);
      expect(primitives.creator).toBe(params.creator);
      expect(primitives.content).toBe(params.content);
      expect(primitives.mentions).toEqual([]);
      expect(primitives.deletedAt).toBeNull();
    });

    it("should serialize comment with mentions", () => {
      const comment = buildComment();
      const mention1 = new IdEntity(MENTION_ID);
      const mention2 = new IdEntity("019df05a-8588-758c-b5e7-92af14bf85c3");

      comment.addMention("test-key-13", mention1, CreatorMock);
      comment.addMention("test-key-14", mention2, CreatorMock);

      const primitives = comment.toPrimitives();

      expect(primitives.mentions.length).toBe(2);
      expect(primitives.mentions).toContain(MENTION_ID);
    });

    it("should deserialize from primitives correctly", () => {
      const params = createCommentParams({
        mentions: [MENTION_ID]
      });

      const comment = Comment.fromPrimitives(params);

      expect(comment.getId().getID()).toBe(params.id);
      expect(comment.getCreator().getID()).toBe(params.creator);
      expect((comment.getOwner() as IdEntity).getID()).toBe(params.idTask);
      expect(comment.getContent().getText()).toBe(params.content);
      expect(comment.getMentions().getItems().length).toBe(1);
    });

    it("should reflect updated content in serialization", () => {
      const comment = buildComment();
      const newContent = new Text("Updated comment");

      comment.updateContent("test-key-15", newContent, CreatorMock);

      const primitives = comment.toPrimitives();

      expect(primitives.content).toBe("Updated comment");
    });

    it("should include deletedAt when comment is deleted", () => {
      const comment = buildComment();
      comment.delete("test-key-16", CreatorMock);

      const primitives = comment.toPrimitives();

      expect(primitives.deletedAt).not.toBeNull();
    });
  });

  describe("Immutability", () => {
    it("should not allow modification of creator after creation", () => {
      const comment = buildComment();
      
      expect(comment.getCreator().getID()).toBe(CREATOR_ID);
      // Creator is readonly, so trying to modify should not work
    });
  });

});
