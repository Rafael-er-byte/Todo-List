import ProjectNeedsToBeClosedBeforeDeleteIt from "../../../../../src/modules/project/core/errors/ProjectNeedsToBeClosedBeforeDeleteIt";
import ProjectBackgroundImageUpdated from "../../../../../src/modules/project/core/events/ProjectBackgroundImageUpdated";
import type ProjectBackgroundImageParams from "../../../../../src/modules/project/core/interfaces/ProjectBackgroundImageParams";
import Project from "../../../../../src/modules/project/core/model/Project";
import ProjectBackGroundColor from "../../../../../src/modules/project/core/objects/ProjectBackGroundColor";
import ProjectBackGroundImage from "../../../../../src/modules/project/core/objects/ProjectBackGroundImage";
import ProjectDescription from "../../../../../src/modules/project/core/objects/ProjectDescription";
import ProjectId from "../../../../../src/modules/project/core/objects/ProjectId";
import ProjectList from "../../../../../src/modules/project/core/objects/ProjectList";
import ProjectName from "../../../../../src/modules/project/core/objects/ProjectName";
import ProjectSetting from "../../../../../src/modules/project/core/objects/ProjectSetting";
import ProjectStatus from "../../../../../src/modules/project/core/objects/ProjectStatus";
import { AllowedBackgroundType } from "../../../../../src/modules/project/core/types/AllowedBackgroundType";
import { AllowedProjectSetting } from "../../../../../src/modules/project/core/types/AllowedProjectSetting";
import { AllowedProjectStatus } from "../../../../../src/modules/project/core/types/AllowedProjectStatus";
import ConflictDuplicateResource from "../../../../../src/modules/shared/core/errors/ConflictDuplicatedResource";
import ResourceNotFound from "../../../../../src/modules/shared/core/errors/ResourceNotFound";
import Attachment from "../../../../../src/modules/shared/core/objects/Attachment";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import IntNumber from "../../../../../src/modules/shared/core/objects/IntNumber";
import None from "../../../../../src/modules/shared/core/objects/None";
import PositiveInteger from "../../../../../src/modules/shared/core/objects/PositiveInteger";
import Text from "../../../../../src/modules/shared/core/objects/Text";
import Url from "../../../../../src/modules/shared/core/objects/URL";
import { AllowedAttachments } from "../../../../../src/modules/shared/core/types/AllowedAttachment.types";
import { AllowedColors } from "../../../../../src/modules/shared/core/types/AllowedColors";
import { describe, it, expect } from "vitest";

describe("Project tests", () => {

    const DEFAULT_ID = '0143c815-7220-7d64-8c42-6f2af4f9fd37';

    const buildParams = (overrides? : Partial<{
        id: string;
        status: AllowedProjectStatus;
        projectName: string;
        projectDescription: string | null;
        background: ProjectBackgroundImageParams | AllowedColors;
        backgroundType: AllowedBackgroundType;
        lists: ProjectList[];
        commentAuthorization: AllowedProjectSetting;
        inmutableComment: boolean;
        addMemberSettings: AllowedProjectSetting;
        createResourcesSettings: AllowedProjectSetting;
        showCompletedTasks: boolean;
        invitaionToken: string | null;
    }>) => ({
        id: DEFAULT_ID,
        status: AllowedProjectStatus.open,
        projectName: "Project example",
        projectDescription: null,
        background: AllowedColors.BLUE,
        backgroundType: AllowedBackgroundType.color,
        lists: [],
        commentAuthorization: AllowedProjectSetting.admins,
        inmutableComment: false,
        addMemberSettings: AllowedProjectSetting.admins,
        createResourcesSettings: AllowedProjectSetting.admins,
        showCompletedTasks: true,
        invitaionToken: null,
        
        ...overrides
    });

    const buildList = (
        idList: IdEntity = new IdEntity('01978b74-7c3d-7b2a-8f71-3d7f6a8c2e11'), 
        position: PositiveInteger = new PositiveInteger(1)) => {

        return new ProjectList(idList, position);
    }

    let project: Project | null;
    const DEFAULT_KEY = 'default-key';
    const DEFAULT_IMAGE = new Attachment(
        new Url("http://urlexample.com"),
        AllowedAttachments.jpeg,
        new Text("My image"),
        new IntNumber(200) 
    );

    it("Should create a project valid instance", () => {
        project = Project.create(
            new ProjectId(DEFAULT_ID),
            new ProjectName('Project 1'),
            new ProjectDescription("A project example"),
            new ProjectBackGroundColor(AllowedColors.BLUE), 
            [],
            new ProjectSetting(AllowedProjectSetting.admins),
            false,
            new ProjectSetting(AllowedProjectSetting.admins),
            new ProjectSetting(AllowedProjectSetting.admins),
            true,
            new IdEntity(DEFAULT_ID),
            'key-example'
        );

        expect(project).toBeInstanceOf(Project);
        project = null;

        project = Project.create(
            new ProjectId(DEFAULT_ID),
            new ProjectName('Project 1'),
            new None(),
            new ProjectBackGroundImage(DEFAULT_IMAGE), 
            [],
            new ProjectSetting(AllowedProjectSetting.member),
            false,
            new ProjectSetting(AllowedProjectSetting.member),
            new ProjectSetting(AllowedProjectSetting.member),
            true,
            new IdEntity(DEFAULT_ID),
            'key-example'
        );

        expect(project).toBeInstanceOf(Project);
        const events = project.pullEvents();
        expect(events[0]?.getEvent()).toBe('PROJECT_CREATED');
        project = null;
    });

    it("Should create a project from primitives", () => {
        const params = buildParams();

        project = Project.fromPrimitives(params);

        expect(project).toBeInstanceOf(Project);
    });

    it("Should modify a closed project after available checks are removed", () => {

        function validateStatus(){
            expect(() => 
                project!.changeAddMemberSettings(
                    new ProjectSetting(AllowedProjectSetting.admins), 
                    DEFAULT_KEY, 
                    new IdEntity(DEFAULT_ID))).toThrow();

            expect(project!.getStatus().getStatus()).toBe(AllowedProjectStatus.closed);
        }
        
        const params = buildParams();
        project = Project.fromPrimitives(params);
        project.close('key-for-deletion', new IdEntity(DEFAULT_ID));

        validateStatus();

        project = null;

        const params2 = buildParams({status: AllowedProjectStatus.closed});
        project = Project.fromPrimitives(params2);

        validateStatus();
    });

    it("Should delete the project just if is closed before", () => {
        const params = buildParams();
        project = Project.fromPrimitives(params);

        expect(() => project!.delete(DEFAULT_KEY, new IdEntity(DEFAULT_ID))).toThrow(ProjectNeedsToBeClosedBeforeDeleteIt);

        project.close('key-for-deletion', new IdEntity(DEFAULT_ID));

        project.delete(DEFAULT_KEY, new IdEntity(DEFAULT_ID));
        const events = project.pullEvents();

        expect((events[0]?.getActor() as IdEntity).getID()).toBe(DEFAULT_ID);
        expect(events[0]?.getId()).toBe('key-for-deletion');
    });

    it("Should create an invitation token and invalidate it", () => {
        const params = buildParams();
        project = Project.fromPrimitives(params);

        const token = project.generateInvitationToken();
        const validId = ID.fromString(token);
        expect(validId).toBeInstanceOf(ID);
        expect(project.getToken()).toEqual(token);

        project.invalidateInvitationToken();
        expect(project.getToken()).instanceOf(None);
    });

    it("Should return the correct primitives", () => {
        const params = buildParams();
        project = Project.fromPrimitives(params);

        const primitives = project.toPrimitives();
        expect(primitives).toEqual({
            id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
            status: 'OPEN',
            projectName: 'Project example',
            projectDescription: null,
            background: 'BLUE',
            backgroundType: 'COLOR',
            lists: [],
            commentAuthorization: 'ADMINS',
            inmutableComment: false,
            addMemberSettings: 'ADMINS',
            createResourcesSettings: 'ADMINS',
            showCompletedTasks: true,
            invitaionToken: null,
            
            }
        );
    });

    it("Should validate and maintain correct order of listsOrder when add or remove ones", () => {
        const params = buildParams();
        project = Project.fromPrimitives(params);

        const list1 = buildList();

        const list2 = buildList(new IdEntity('01978b74-7c3e-76d1-b1f8-3a4c5d6e7f99'), new PositiveInteger(2));

        const list3 = buildList(new IdEntity('01978b74-7c3d-7d8f-a3c2-9b7e1d4f8a22'), new PositiveInteger(3));

        const list4 = buildList(new IdEntity('01978b74-7c3e-70a1-b5d4-2c8f7e1a9b33'), new PositiveInteger(4));

        const listNewInTwoPos = buildList(new IdEntity('01978b74-7c3e-71f2-8a9b-5d6e7f1c2d44'), new PositiveInteger(2));

        project.addList(list1);
        project.addList(list2);
        project.addList(list3);
        project.addList(list4);

        let expectedOrder = [1, 2, 3, 4];
        let idsExpectedOrder = [
            '01978b74-7c3d-7b2a-8f71-3d7f6a8c2e11', 
            '01978b74-7c3e-76d1-b1f8-3a4c5d6e7f99', 
            '01978b74-7c3d-7d8f-a3c2-9b7e1d4f8a22',
            '01978b74-7c3e-70a1-b5d4-2c8f7e1a9b33'
        ];

        let listsOrder = project.getlists().map(l => l.position.getValue());
        let listIdsOrder = project.getlists().map(l => l.idList.getID());

        expect(listsOrder).toStrictEqual(expectedOrder);
        expect(listIdsOrder).toStrictEqual(idsExpectedOrder);

        project.addList(listNewInTwoPos);
        expectedOrder = [1, 2, 3, 4, 5];
        idsExpectedOrder.splice(1, 0, '01978b74-7c3e-71f2-8a9b-5d6e7f1c2d44');

        listsOrder = project.getlists().map(l => l.position.getValue());
        listIdsOrder = project.getlists().map(l => l.idList.getID());

        expect(listsOrder).toStrictEqual(expectedOrder);
        expect(listIdsOrder).toStrictEqual(idsExpectedOrder);

        project.removeList(list3.idList);

        listsOrder = project.getlists().map(l => l.position.getValue());
        listIdsOrder = project.getlists().map(l => l.idList.getID());

        expectedOrder = [1, 2, 3, 4];
        idsExpectedOrder = idsExpectedOrder.filter(i => i !== list3.idList.getID());

        expect(listsOrder).toStrictEqual(expectedOrder);
        expect(listIdsOrder).toStrictEqual(idsExpectedOrder);
    });

    it("Should throw when the list to remove doesnt exists", () => {
        const params = buildParams();
        project = Project.fromPrimitives(params);
        const list1 = buildList();
        expect(() => project!.removeList(list1.idList)).toThrow(ResourceNotFound);
    });

    it("Shouldnt allow repeated lists", () => {
        const params = buildParams();
        project = Project.fromPrimitives(params);
        const list1 = buildList();
        project.addList(list1);
        expect(project.getlists()).toHaveLength(1);
        expect(() => project!.addList(list1)).toThrow(ConflictDuplicateResource);
    });
});
