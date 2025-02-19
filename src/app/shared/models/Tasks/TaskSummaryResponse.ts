import { TaskEntity } from "../../services/mock/database/entities";

export interface TaskSummaryResponse {
  id: TaskEntity['id'];
  name: TaskEntity['name'];
  description: TaskEntity['description'];
  dueDate: TaskEntity['dueDate'];
  priority: TaskEntity['priority'];
  status?: Status;
  project: Project;
  permissions: Permissions;
}

export interface Status {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
}

export interface Permissions {
  deleteTask: boolean;
}
