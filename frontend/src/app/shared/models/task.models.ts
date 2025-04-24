import type {
  ProjectEntity,
  ProjectMemberEntity,
  RoleEntity,
  StatusEntity,
  TaskEntity,
  TaskEventEntity,
  UserEntity,
} from './entities';

export type Task = {
  id: TaskEntity['id'];
  name: TaskEntity['name'];
  description?: TaskEntity['description'];
  dueDate?: TaskEntity['dueDate'];
  status: StatusEntity['name'];
  project: {
    id: ProjectEntity['id'];
    name: ProjectEntity['name'];
    description?: ProjectEntity['description'];
    startDate?: ProjectEntity['startDate'];
    endDate?: ProjectEntity['endDate'];
    status: StatusEntity['name'];
    myRole?: RoleEntity['name'];
  };
  assignee?: {
    id: ProjectMemberEntity['id'];
    username: UserEntity['username'];
    email: UserEntity['email'];
    role: RoleEntity['name'];
  };
  priority?: TaskEntity['priority'];
  taskHistory: TaskEvent[];
  myRole?: RoleEntity['name'];
};

export type GetTaskResponse = Task;
export type GetTasksResponse = Task[];

export type PostTaskRequest = Omit<TaskEntity, 'id'>;
export type PostTaskResponse = Task;

export type DeleteTaskResponse = Task;

export type TaskDetails = Task & {
  myRole?: RoleEntity['name'];
};

export type GetTaskDetailsResponse = TaskDetails;

export type PatchTaskRequest = Partial<Omit<TaskEntity, 'id'>>;
export type PatchTaskResponse = Task;

export type TaskEvent = {
  id: TaskEventEntity['id'];
  description?: TaskEventEntity['description'];
  date: TaskEventEntity['date'];
};
