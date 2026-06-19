import Entity from "../../../shared/core/model/Entity";
import IdEntity from "../../../shared/core/objects/IdEntity";
import Text from "../../../shared/core/objects/Text";
import IdComment from "../objects/IdComment";
import Collection from "../../../shared/core/objects/Collection";
import type CommentParams from "../interfaces/CommentParams";
export default class Comment extends Entity {
    private content;
    private mentions;
    private creator;
    private task;
    private constructor();
    static create(idComment: IdComment, creator: IdEntity, task: IdEntity, content: Text, key: string, mentions?: Collection): Comment;
    static fromPrimitives(params: CommentParams): Comment;
    getId(): IdComment;
    getCreator(): IdEntity;
    getContent(): Text;
    getMentions(): Collection;
    getTask(): IdEntity;
    updateContent(key: string, newContent: Text, actor: IdEntity): void;
    addMention(key: string, mentionedId: IdEntity, actor: IdEntity): void;
    deleteMention(mentionedId: IdEntity): void;
    delete(key: string, actor: IdEntity): void;
    toPrimitives(): CommentParams;
}
//# sourceMappingURL=Comment.d.ts.map