import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectCommentImmutableSetupTo extends DomainEvent {
    constructor(key, date, actor, idProject, inmutableComment) {
        super(key, date, actor, idProject, idProject, 'PROJECT_COMMENT_IMMUTABLE_SETUP_TO', inmutableComment);
    }
}
//# sourceMappingURL=ProjectCommentImmutableSetupTo.js.map