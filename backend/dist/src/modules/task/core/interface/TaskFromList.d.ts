import type IdEntity from "../../../shared/core/objects/IdEntity";
export default interface TaskFromList {
    limit: number;
    page: number;
    archived: "ALL" | "ACTIVE" | "ARCHIVED";
    withCategory: boolean;
    wihtAssigned: boolean;
    idProject: IdEntity;
    idList: IdEntity;
}
//# sourceMappingURL=TaskFromList.d.ts.map