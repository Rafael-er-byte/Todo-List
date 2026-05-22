import type Link from '../model/Link';
import type LinkId from '../objects/LinkId';
export default interface LinkRepository {
    create(link: Link): Promise<void>;
    update(link: Link): Promise<void>;
    getById(linkId: LinkId): Promise<Link | undefined>;
    getMany(page: number, limit: number): Promise<Link[]>;
}
//# sourceMappingURL=LinkRepository.d.ts.map