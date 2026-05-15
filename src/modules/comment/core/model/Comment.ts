import Entity from "../../../shared/core/model/Entity";
import IdEntity from "../../../shared/core/objects/IdEntity";
import InternalId from "../../../shared/core/objects/InternalId";
import None from "../../../shared/core/objects/None";
import Text from "../../../shared/core/objects/Text";
import IdComment from "../objects/IdComment";
import Collection from "../../../shared/core/objects/Collection";
import DateTime from "../../../shared/core/objects/DateTime";
import Version from "../../../shared/core/objects/Version";
import DeletedAt from "../../../shared/core/objects/DeletedAt";
import type CommentParams from "../interfaces/CommentParams";
import internalIdToPrimitive from "../../../shared/helpers/InternalIdToPrimitive";
import CommentCreated from "../events/CommentCreated";
import CommentContentUpdated from "../events/CommentContentUpdated";
import CommentDeleted from "../events/CommentDeleted";
import CommentMentionAdded from "../events/CommentMentionAdded";
import Unauthorized from "../../../shared/core/errors/Unauthorized";
import InvalidParameters from "../../../shared/core/errors/InvalidParameters";

export default class Comment extends Entity {
    private content!: Text;
    private mentions!: Collection;
    private creator!: IdEntity;

    private constructor(
        id: IdComment,
        creator: IdEntity,
        task: IdEntity,
        content: Text,
        mentions: Collection,
        internalId: InternalId | None
    ) {
        super(id, internalId, task);
        this.content = content;
        this.mentions = mentions;
        this.creator = creator;
    }

    public static create(
        idComment: IdComment,
        creator: IdEntity,
        task: IdEntity,
        content: Text,
        key: string,
        mentions?: Collection
    ): Comment {
        const mentionsCollection = mentions || new Collection([], [], []);
        const comment = new Comment(idComment, creator, task ,content, mentionsCollection, new None());
        comment.create();
        comment.addEvent(new CommentCreated(key, DateTime.now(), creator, idComment, comment.toPrimitives()));
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
            new Collection(mentions, [], []),
            new InternalId(params.internalId as number)
        );

        comment.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
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
            new CommentContentUpdated(key, DateTime.now(), actor, this.getId(), newContent)
        );
    }

    public addMention(
        key: string,
        mentionedId: IdEntity,
        actor: IdEntity
    ): void {
        this.mentions = this.mentions.addItem(mentionedId);
        this.addEvent(
            new CommentMentionAdded(key, DateTime.now(), actor, this.getId(), mentionedId)
        );
    }

    public deleteMention(mentionedId: IdEntity): void {
        this.mentions = this.mentions.deleteItem(mentionedId);
    }

    public delete(key: string, actor: IdEntity): void {
        this.addEvent(new CommentDeleted(key, DateTime.now(), actor, this.getId()));
        super.softDelete();
    }

    public toPrimitives(): CommentParams {
        return {
            id: this.getId().getID(),
            creator: this.getCreator().getID(),
            content: this.content.getText(),
            mentions: this.mentions.getPrimitives(),
            idTask: (super.getOwner() as IdEntity).getID(),
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive(),
            internalId: internalIdToPrimitive(super.getInternalId()),
        };
    }
}
