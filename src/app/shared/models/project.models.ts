import type {
  ProjectMemberEntity,
  RoleEntity,
  StatusEntity,
  UserEntity,
} from './entities';

import type { ProjectEntity } from './entities';
import { Task } from './task.models';

export type Project = {
  id: ProjectEntity['id'];
  name: ProjectEntity['name'];
  description?: ProjectEntity['description'];
  startDate?: ProjectEntity['startDate'];
  endDate?: ProjectEntity['endDate'];
  status: StatusEntity['name'];
  myRole?: RoleEntity['name'];
};

export type GetProjectResponse = Project;
export type GetProjectsResponse = Project[];

export type PostProjectRequest = Omit<ProjectEntity, 'id'>;
export type PostProjectResponse = Project;

export type DeleteProjectResponse = Project;

export type ProjectDetails = Project & {
  status: StatusEntity['name'];
  myRole?: RoleEntity['name'];
  projectMembers: ProjectMember[];
  tasks: Task[];
};

export type GetProjectDetailsResponse = ProjectDetails;

export type ProjectMember = {
  id: ProjectMemberEntity['id'];
  project: ProjectEntity['name'];
  user: UserEntity['username'];
  role: RoleEntity['name'];
};

export type PostProjectMemberRequest = Omit<ProjectMemberEntity, 'id'>;
export type PostProjectMemberResponse = ProjectMember;

export type GetProjectMemberResponse = ProjectMember;

export type DeleteProjectMemberResponse = ProjectMember;
