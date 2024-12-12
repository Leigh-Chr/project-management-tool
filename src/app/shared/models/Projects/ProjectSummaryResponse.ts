export interface ProjectSummaryResponse {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  memberCount: number;
  permissions: Permissions;
}

export interface Permissions {
  deleteProject: boolean;
}
