import type ChecklistItemParams from './ChecklistItemParams';

export default interface CheckListParams {
  id: string;
  idOwner: string;
  name: string;
  items: ChecklistItemParams[];
  completedPercentage: number;
  deletedAt: Date | null;
}
