import type IdEntity from "../../../../shared/core/objects/IdEntity";
import type ProjectCriteria from "../interfaces/ProjectCriteria";
import type Project from "../model/Project";

export default interface ProjectRepository {
    create(project: Project): Promise<void>;
    update(project: Project): Promise<void>;
    getById(id: IdEntity): Promise<Project | null>;
    getByCriteria(criteria: ProjectCriteria): Promise<Project[]>;
}
