import List from "../../../../../src/modules/list/core/model/List";
import ListId from "../../../../../src/modules/list/core/object/ListId";
import CannotModifyClosedProject from "../../../../../src/modules/project/core/errors/CannotModifyClosedProject";
import ProjectNeedsToBeClosedBeforeDeleteIt from "../../../../../src/modules/project/core/errors/ProjectNeedsToBeClosedBeforeDeleteIt";
import ProjectBackgroundImageUpdated from "../../../../../src/modules/project/core/events/ProjectBackgroundImageUpdated";
import type ProjectBackgroundImageParams from "../../../../../src/modules/project/core/interfaces/ProjectBackgroundImageParams";
import Project from "../../../../../src/modules/project/core/model/Project";
import ProjectBackGroundColor from "../../../../../src/modules/project/core/objects/ProjectBackGroundColor";
import ProjectBackGroundImage from "../../../../../src/modules/project/core/objects/ProjectBackGroundImage";
import ProjectDescription from "../../../../../src/modules/project/core/objects/ProjectDescription";
import ProjectId from "../../../../../src/modules/project/core/objects/ProjectId";
import ProjectName from "../../../../../src/modules/project/core/objects/ProjectName";
import ProjectSetting from "../../../../../src/modules/project/core/objects/ProjectSetting";
import ProjectStatus from "../../../../../src/modules/project/core/objects/ProjectStatus";
import { AllowedBackgroundType } from "../../../../../src/modules/project/core/types/AllowedBackgroundType";
import { AllowedProjectSetting } from "../../../../../src/modules/project/core/types/AllowedProjectSetting";
import { AllowedProjectStatus } from "../../../../../src/modules/project/core/types/AllowedProjectStatus";
import Attachment from "../../../../../src/modules/shared/core/objects/Attachment";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import IntNumber from "../../../../../src/modules/shared/core/objects/IntNumber";
import None from "../../../../../src/modules/shared/core/objects/None";
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
        lists: List[];
        commentAuthorization: AllowedProjectSetting;
        inmutableComment: boolean;
        addMemberSettings: AllowedProjectSetting;
        createResourcesSettings: AllowedProjectSetting;
        showCompletedTasks: boolean;
        invitaionToken: string | null;
        deletedAt: Date | null;
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
        deletedAt: null,
        ...overrides
    });

    const listParams = (overrides? : Partial<{     
      id: string,
      title: string,
      position: number,
      archived: boolean,
      tasks: [],
      projectId: string,
      deletedAt: null
    }>) => ({
        id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
        title: 'Backlog',
        position: 1,
        archived: false,
        tasks: [],
        projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
        deletedAt: null,
        ...overrides
        }
    );

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

    it("Shouldnt be able to modify a closed project", () => {

        function validateStatus(){
            expect(() => 
                project!.changeAddMemberSettings(
                    new ProjectSetting(AllowedProjectSetting.admins), 
                    DEFAULT_KEY, 
                    new IdEntity(DEFAULT_ID))).toThrow(CannotModifyClosedProject

            );

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
            deletedAt: null
            }
        );
    });

    it("Should validate and maintain correct structure of lists when add or remove ones", () => {
        const params = buildParams();
        project = Project.fromPrimitives(params);

        const list1 = List.fromPrimitives(listParams({
            id: '550e8400-e29b-41d4-a716-446655440001',
            title: 'Backlog',
            position: 1
        }));

        const list2 = List.fromPrimitives(listParams({
            id: '550e8400-e29b-41d4-a716-446655440002',
            title: 'En progreso',
            position: 2,
        }));

        const list3 = List.fromPrimitives(listParams({
            id: '550e8400-e29b-41d4-a716-446655440003',
            title: 'Revisión',
            position: 3,
            archived: true,
        }));

        const list4 = List.fromPrimitives(listParams({
            id: '550e8400-e29b-41d4-a716-446655440004',
            title: 'Testing',
            position: 4,
        }));

        const list5 = List.fromPrimitives(listParams({
            id: '550e8400-e29b-41d4-a716-446655440005',
            title: 'Completado',
            position: 5,
            deletedAt: null,
        }));

        project.addList(list1);

    });
});
