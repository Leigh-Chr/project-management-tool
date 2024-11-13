export interface ProjectSummary {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  memberCount: number;
  permissions: ProjectSummaryPermissions;
}

export interface ProjectSummaryPermissions {
  deleteProject: boolean;
}
