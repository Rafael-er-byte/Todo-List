import Entity from "../../../shared/core/model/Entity";
import IdEntity from "../../../shared/core/objects/IdEntity";
import Text from "../../../shared/core/objects/Text";
import IdComment from "../objects/IdComment";
import Collection from "../../../shared/core/objects/Collection";
import DateTime from "../../../shared/core/objects/DateTime";
import type CommentParams from "../interfaces/CommentParams";
import CommentCreated from "../events/CommentCreated";
import CommentContentUpdated from "../events/CommentContentUpdated";
import CommentDeleted from "../events/CommentDeleted";
import CommentMentionAdded from "../events/CommentMentionAdded";
import Unauthorized from "../../../shared/core/errors/Unauthorized";

export default class Comment extends Entity {
    private content!: Text;
    private mentions!: Collection;
    private creator!: IdEntity;
    private task!: IdEntity;

    private constructor(
        id: IdComment,
        creator: IdEntity,
        task: IdEntity,
        content: Text,
        mentions: Collection
    ) {
        super(id);
        this.content = content;
        this.mentions = mentions;
        this.creator = creator;
        this.task = task;
    }

    public static create(
        params: CommentParams & { key: string }
    ): Comment {
        const idComment = new IdComment(params.id);
        const creator = new IdEntity(params.creator);
        const task = new IdEntity(params.idTask);
        const content = new Text(params.content);
        const mentionsCollection = new Collection(
            params.mentions.map((mention) => new IdEntity(mention)),
            [],
            []
        );
        const comment = new Comment(idComment, creator, task ,content, mentionsCollection);
        comment.addEvent(new CommentCreated(params.key, DateTime.now(), creator, task, idComment, comment.toPrimitives()));
        return comment;
    }

    public static fromPrimitives(params: CommentParams): Comment {
        const mentions = params.mentions.map((mention) => {
            return new IdEntity(mention);
        });

        const comment = new Comment(
            new IdComment(params.id),
            new IdEntity(params.creator),
            new IdEntity(params.idTask),
            new Text(params.content),
            new Collection(mentions, [], [])
        );

        return comment;
    }

    public getId(): IdComment {
        return super.getID() as IdComment;
    }

    public getCreator(): IdEntity {
        return this.creator;
    }

    public getContent(): Text {
        return this.content;
    }

    public getMentions(): Collection {
        return this.mentions;
    }

    public getTask(): IdEntity {
        return this.task;
    }

    public updateContent(
        key: string,
        newContent: Text,
        actor: IdEntity
    ): void {
        if (actor.getID() !== this.getCreator().getID()) {
            throw new Unauthorized('Only the creator can update the comment content');
        }
        this.content = newContent;
        this.addEvent(
            new CommentContentUpdated(key, DateTime.now(), actor, this.getId(), this.task, newContent)
        );
    }

    public addMention(
        key: string,
        mentionedId: IdEntity,
        actor: IdEntity
    ): void {
        this.mentions = this.mentions.addItem(mentionedId);
        this.addEvent(
            new CommentMentionAdded(key, DateTime.now(), actor, this.getId(), this.task, mentionedId)
        );
    }

    public deleteMention(mentionedId: IdEntity): void {
        this.mentions = this.mentions.deleteItem(mentionedId);
    }

    public delete(key: string, actor: IdEntity): void {
        this.addEvent(new CommentDeleted(key, DateTime.now(), actor, this.task, this.getId()));
    }

    public toPrimitives(): CommentParams {
        return {
            id: this.getId().getID(),
            creator: this.getCreator().getID(),
            content: this.content.getText(),
            mentions: this.mentions.getPrimitives(),
            idTask: this.task.getID(),
        };
    }

}
