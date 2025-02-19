import { TaskEntity } from "../../services/mock/database/entities";

export interface GetTaskResponse {
  id: TaskEntity['id'];
  projectId: TaskEntity['projectId'];
  name: TaskEntity['name'];
  description?: TaskEntity['description'];
  dueDate: TaskEntity['dueDate'];
  priority: TaskEntity['priority'];
  assigneeId: TaskEntity['assigneeId'];
  statusId: TaskEntity['statusId'];
}