export interface UserEntity {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface RoleEntity {
  id: number;
  name: string;
}

export interface StatusEntity {
  id: number;
  name: string;
}

export interface ProjectEntity {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  statusId: StatusEntity['id'];
}

export interface ProjectMemberEntity {
  projectId: ProjectEntity['id'];
  userId: UserEntity['id'];
  roleId: RoleEntity['id'];
}

export interface TaskEntity {
  id: number;
  projectId: ProjectEntity['id'];
  name: string;
  description?: string;
  dueDate: Date;
  priority: number;
  assigneeId: ProjectMemberEntity['userId'];
  statusId: StatusEntity['id'];
}

export interface TaskHistoryEntity {
  id: number;
  taskId: TaskEntity['id'];
  name: string;
  description?: string;
  date: Date;
}
