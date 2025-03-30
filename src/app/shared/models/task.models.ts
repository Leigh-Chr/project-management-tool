import type {
  ProjectEntity,
  RoleEntity,
  StatusEntity,
  TaskEntity,
  UserEntity,
} from './entities';
import { Project } from './project.models';

export type Task = {
  id: TaskEntity['id'];
  name: TaskEntity['name'];
  description?: TaskEntity['description'];
  dueDate?: TaskEntity['dueDate'];
  status: StatusEntity['name'];
  project: Project;
  assignee?: UserEntity['username'];
  priority?: TaskEntity['priority'];
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
