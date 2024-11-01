export interface Task {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  dueDate: Date;
  priority: number;
  assigneeId: number;
  statusId: number;
}
