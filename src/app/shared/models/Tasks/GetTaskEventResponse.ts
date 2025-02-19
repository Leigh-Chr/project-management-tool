import { TaskHistoryEntity } from "../../services/mock/database/entities";

export interface GetTaskEventResponse {
  id: TaskHistoryEntity['id'];
  taskId: TaskHistoryEntity['taskId'];
  name: TaskHistoryEntity['name'];
  description: TaskHistoryEntity['description'];
  date: TaskHistoryEntity['date'];
}