export interface ProjectDetails {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: Status;
  projectMembers: ProjectMember[];
  tasks: Task[];
}

export interface Status {
  id: number;
  name: string;
}

export interface ProjectMember {
  id: number;
  user: User;
  role: Role;
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

export interface Task {
  id: number;
  name: string;
  description?: string;
  dueDate: Date;
  priority: number;
  assignee?: User;
  status: Status;
}
