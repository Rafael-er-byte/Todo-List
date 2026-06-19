import Entity from "../../../shared/core/model/Entity";
import IdEntity from "../../../shared/core/objects/IdEntity";
import Text from "../../../shared/core/objects/Text";
import IdComment from "../objects/IdComment";
import Collection from "../../../shared/core/objects/Collection";
import DateTime from "../../../shared/core/objects/DateTime";
import DeletedAt from "../../../shared/core/objects/DeletedAt";
import CommentCreated from "../events/CommentCreated";
import CommentContentUpdated from "../events/CommentContentUpdated";
import CommentDeleted from "../events/CommentDeleted";
import CommentMentionAdded from "../events/CommentMentionAdded";
import Unauthorized from "../../../shared/core/errors/Unauthorized";
export default class Comment extends Entity {
    constructor(id, creator, task, content, mentions) {
        super(id);
        this.content = content;
        this.mentions = mentions;
        this.creator = creator;
        this.task = task;
    }
    static create(idComment, creator, task, content, key, mentions) {
        const mentionsCollection = mentions || new Collection([], [], []);
        const comment = new Comment(idComment, creator, task, content, mentionsCollection);
        comment.create();
        comment.addEvent(new CommentCreated(key, DateTime.now(), creator, task, idComment, comment.toPrimitives()));
        return comment;
    }
    static fromPrimitives(params) {
        const mentions = params.mentions.map((mention) => {
            return new IdEntity(mention);
        });
        const comment = new Comment(new IdComment(params.id), new IdEntity(params.creator), new IdEntity(params.idTask), new Text(params.content), new Collection(mentions, [], []));
        comment.build(DeletedAt.createFromPrimitive(params.deletedAt));
        return comment;
    }
    getId() {
        return super.getID();
    }
    getCreator() {
        return this.creator;
    }
    getContent() {
        return this.content;
    }
    getMentions() {
        return this.mentions;
    }
    getTask() {
        return this.task;
    }
    updateContent(key, newContent, actor) {
        if (actor.getID() !== this.getCreator().getID()) {
            throw new Unauthorized('Only the creator can update the comment content');
        }
        this.content = newContent;
        this.addEvent(new CommentContentUpdated(key, DateTime.now(), actor, this.getId(), this.task, newContent));
    }
    addMention(key, mentionedId, actor) {
        this.mentions = this.mentions.addItem(mentionedId);
        this.addEvent(new CommentMentionAdded(key, DateTime.now(), actor, this.getId(), this.task, mentionedId));
    }
    deleteMention(mentionedId) {
        this.mentions = this.mentions.deleteItem(mentionedId);
    }
    delete(key, actor) {
        this.addEvent(new CommentDeleted(key, DateTime.now(), actor, this.task, this.getId()));
        super.softDelete();
    }
    toPrimitives() {
        return {
            id: this.getId().getID(),
            creator: this.getCreator().getID(),
            content: this.content.getText(),
            mentions: this.mentions.getPrimitives(),
            idTask: this.task.getID(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
}
//# sourceMappingURL=Comment.js.map