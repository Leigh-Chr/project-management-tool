import { TaskHistoryEntity } from "../../services/mock/database/entities";

export interface TaskEventResponse {
  id: TaskHistoryEntity['id'];
  taskId: TaskHistoryEntity['taskId'];
  name: TaskHistoryEntity['name'];
  description: TaskHistoryEntity['description'];
  date: TaskHistoryEntity['date'];
}