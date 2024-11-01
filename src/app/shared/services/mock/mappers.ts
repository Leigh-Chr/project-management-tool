import { ProjectMember, Status, Task } from '../../models/ProjectDetails';
import {
  ProjectMemberEntity,
  RoleEntity,
  StatusEntity,
  TaskEntity,
  UserEntity,
} from './entities';

export function mapStatus(statusEntity: StatusEntity): Status {
  return {
    id: statusEntity.id,
    name: statusEntity.name,
  };
}

export function mapProjectMember(
  pmEntity: ProjectMemberEntity,
  users: UserEntity[],
  roles: RoleEntity[]
): ProjectMember {
  const user = users.find((u) => u.id === pmEntity.userId)!;
  const role = roles.find((r) => r.id === pmEntity.roleId)!;
  return {
    id: pmEntity.userId,
    user,
    role,
  };
}

export function mapTask(
  taskEntity: TaskEntity,
  projectMembers: ProjectMember[],
  status: Status
): Task {
  return {
    id: taskEntity.id,
    name: taskEntity.name,
    description: taskEntity.description,
    dueDate: taskEntity.dueDate,
    priority: taskEntity.priority,
    assignee: projectMembers.find((pm) => pm.id === taskEntity.assigneeId)
      ?.user,
    status,
  };
}
