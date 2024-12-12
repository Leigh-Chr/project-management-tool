export interface TaskSummaryResponse {
  id: number;
  name: string;
  description?: string;
  dueDate: Date;
  priority: number;
  status: string;
  project: string;
  permissions: Permissions;
}

export interface Permissions {
  deleteTask: boolean;
}
