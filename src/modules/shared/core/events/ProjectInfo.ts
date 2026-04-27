import IdProject from "../objects/IdProject";
import Text from "../objects/Text";

export default class ProjectInfo{
    public idProject!: IdProject;
    public projectName!: Text;
    constructor(idProject: string, projectName: string){
        this.idProject = new IdProject(idProject);
        this.projectName = new Text(projectName);
    }
}
