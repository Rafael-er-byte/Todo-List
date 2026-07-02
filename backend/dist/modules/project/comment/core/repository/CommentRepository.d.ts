import type Comment from "../model/Comment";
import type IdComment from "../objects/IdComment";
export default interface CommentRepository {
    create(comment: Comment): Promise<void>;
    update(comment: Comment): Promise<void>;
    getById(idComment: IdComment): Promise<Comment>;
    getManyByIds(comments: IdComment[], limit: number, page: number): Promise<Comment[]>;
}
//# sourceMappingURL=CommentRepository.d.ts.map