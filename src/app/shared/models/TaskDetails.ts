export interface TaskDetails {
  id: number;
  name: string;
  description?: string;
  dueDate: Date;
  priority: number;
  assignee?: User;
  status: Status;
  project: Project;
  taskHistory: TaskHistory[];
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: Status;
}

export interface Status {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface TaskHistory {
  id: number;
  name: string;
  description?: string;
  date: Date;
}
