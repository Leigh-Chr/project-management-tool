import { ProjectEntity } from "../../services/mock/database/entities";

export interface AddProjectRequest {
  name: ProjectEntity['name'];
  description: ProjectEntity['description'];
  startDate: ProjectEntity['startDate'];
  endDate: ProjectEntity['endDate'];
}