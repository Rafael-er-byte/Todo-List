export const ALLOWED_TASK_STATE = ['COMPLETED', 'PENDING'] as const;

export enum AllowedTaskState {
  completed = 'COMPLETED',
  pending = 'PENDING',
}
