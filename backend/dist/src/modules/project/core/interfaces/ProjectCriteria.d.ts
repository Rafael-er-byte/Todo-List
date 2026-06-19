export default interface ProjectCriteria {
    page?: number;
    limit?: number;
    title?: string;
    archived?: boolean;
    closed?: boolean;
    idUser?: string;
    watching?: boolean;
    favorited?: boolean;
    sortBy?: 'ASC' | 'DESC';
    priority?: 'WATCHING' | 'FAVORITE' | 'ALL';
}
//# sourceMappingURL=ProjectCriteria.d.ts.map