export interface ProjectResponse {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  statusId: number;
}
