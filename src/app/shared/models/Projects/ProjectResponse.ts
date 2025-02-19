import { ProjectEntity } from "../../services/mock/database/entities";

export interface ProjectResponse {
  id: ProjectEntity['id'];
  name: ProjectEntity['name'];
  description: ProjectEntity['description'];
  startDate: ProjectEntity['startDate'];
  endDate: ProjectEntity['endDate'];
  statusId: ProjectEntity['statusId'];
}