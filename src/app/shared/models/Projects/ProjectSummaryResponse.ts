import { ProjectEntity, StatusEntity } from "../../services/mock/database/entities";

export interface ProjectSummaryResponse {
  id: ProjectEntity['id'];
  name: ProjectEntity['name'];
  description: ProjectEntity['description'];
  startDate: ProjectEntity['startDate'];
  endDate: ProjectEntity['endDate'];
  status?: Status;
  memberCount: number;
  permissions: Permissions;
}

export interface Status {
  id: StatusEntity['id'];
  name: StatusEntity['name'];
}

export interface Permissions {
  deleteProject: boolean;
}