import { ProjectEntity, RoleEntity, StatusEntity, TaskEntity, TaskHistoryEntity, UserEntity } from "../../services/mock/database/entities";

export interface GetTaskDetailsResponse {
  id: TaskEntity['id'];
  name: TaskEntity['name'];
  description?: TaskEntity['description'];
  dueDate: TaskEntity['dueDate'];
  priority: TaskEntity['priority'];
  assignee: User;
  status: Status;
  project: Project;
  taskHistory: TaskHistory[];
  permissions: TaskDetailsPermissions;
}

export interface Project {
  id: ProjectEntity['id'];
  name: ProjectEntity['name'];
  description: ProjectEntity['description'];
  startDate: ProjectEntity['startDate'];
  endDate: ProjectEntity['endDate'];
  status: Status;
}

export interface Status {
  id: StatusEntity['id'];
  name: StatusEntity['name'];
}

export interface User {
  id: UserEntity['id'];
  username: UserEntity['username'];
  email: UserEntity['email'];
}

export interface Role {
  id: RoleEntity['id'];
  name: RoleEntity['name'];
}

export interface TaskHistory {
  id: TaskHistoryEntity['id'];
  name: TaskHistoryEntity['name'];
  description?: TaskHistoryEntity['description'];
  date: TaskHistoryEntity['date'];
}

export interface TaskDetailsPermissions {
  editTask: boolean;
}