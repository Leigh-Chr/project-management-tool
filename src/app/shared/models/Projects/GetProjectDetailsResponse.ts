import { ProjectEntity, ProjectMemberEntity, RoleEntity, StatusEntity, TaskEntity, UserEntity } from "../../services/mock/database/entities";

export interface GetProjectDetailsResponse {
  id: ProjectEntity['id'];
  name: ProjectEntity['name'];
  description: ProjectEntity['description'];
  startDate: ProjectEntity['startDate'];
  endDate: ProjectEntity['endDate'];
  status: Status;
  projectMembers: ProjectMember[];
  tasks: Task[];
  permissions: ProjectDetailsPermissions;
}

export interface Status {
  id: StatusEntity['id'];
  name: StatusEntity['name'];
}

export interface ProjectMember {
  projectId: ProjectMemberEntity['projectId'];
  user: User;
  role: Role;
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

export interface Task {
  id: TaskEntity['id'];
  name: TaskEntity['name'];
  description: TaskEntity['description'];
  dueDate: TaskEntity['dueDate'];
  priority: TaskEntity['priority'];
  assigneeId: TaskEntity['assigneeId'];
  status: Status;
}

export interface ProjectDetailsPermissions {
  deleteProject: boolean;
  addMember: boolean;
  deleteMember: boolean;
  assignTask: boolean;
  addTask: boolean;
  deleteTask: boolean;
  assignMember: boolean;
}
