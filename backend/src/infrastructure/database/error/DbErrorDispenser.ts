import ConflictDuplicateResource from '../../../modules/shared/core/errors/ConflictDuplicatedResource';
import OperationNotAllowed from '../../../modules/shared/core/errors/OperationNotAllowed';
import UnknownError from '../../../modules/shared/core/errors/UnknownError';

type ErrorHandler = (error: Error) => void;

export const DbErrorDispenser: Record<string, ErrorHandler> = {
    '23505': (error: Error) => {
        return new ConflictDuplicateResource('Duplicate in database', error);
    },
    '23503': (error: Error) => {
        return new OperationNotAllowed('Foreign key violation', error);
    },
    '23502': (error: Error) => {
        return new OperationNotAllowed('Not null violation', error);
    },
    default: (error: Error) => {
        return new UnknownError('Unknown error', error);
    }
};
