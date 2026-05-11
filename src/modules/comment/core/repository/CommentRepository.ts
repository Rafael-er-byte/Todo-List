import type IdEntity from "../../../shared/core/objects/IdEntity";
import type Comment from "../model/Comment";
import type IdComment from "../objects/IdComment";

export default interface CommentRepository{
    create(comment:Comment): Promise<void>
    update(comment:Comment): Promise<void>
    getById(fromTask: IdEntity, idComment: IdComment): Promise<Comment>
    getManyByIds(fromTask: IdEntity ,comments: IdComment[] ,limit:number, page: number): Promise<Comment[]>
}
