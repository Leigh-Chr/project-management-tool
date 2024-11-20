export interface TaskResponse {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  dueDate: Date;
  priority: number;
  assigneeId: number;
  statusId: number;
}
