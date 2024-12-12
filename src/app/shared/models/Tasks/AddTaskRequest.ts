export interface AddTaskRequest {
  projectId: number;
  name: string;
  description?: string;
  dueDate: Date;
  priority: number;
  assigneeId: number;
}
