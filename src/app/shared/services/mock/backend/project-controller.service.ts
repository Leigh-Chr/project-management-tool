import { inject, Injectable } from '@angular/core';
import { NotFoundError } from '../../../errors/NotFoundError';
import { ProjectDetails } from '../../../models/ProjectDetails';
import { filterEntitiesByField, findEntityById } from '../backend.utils';
import { DatabaseMockService } from '../database.service';
import {
  ProjectEntity,
  ProjectMemberEntity,
  StatusEntity,
  TaskEntity,
} from '../entities';

@Injectable({ providedIn: 'root' })
export class ProjectControllerService {
  private readonly database = inject(DatabaseMockService);

  async getProjectDetails(projectId: number): Promise<ProjectDetails> {
    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      projectId,
      'Project'
    );

    const projectMembersEntities = filterEntitiesByField<
      ProjectMemberEntity,
      'projectId'
    >(this.database.projectMembers, 'projectId', projectId);

    const userIds = projectMembersEntities.map((pm) => pm.userId);
    const roleIds = projectMembersEntities.map((pm) => pm.roleId);

    const usersEntities = this.database.users.filter((user) =>
      userIds.includes(user.id)
    );

    const rolesEntities = this.database.roles.filter((role) =>
      roleIds.includes(role.id)
    );

    const tasksEntities = filterEntitiesByField<TaskEntity, 'projectId'>(
      this.database.tasks,
      'projectId',
      projectId
    );

    const defaultStatusEntity = this.database.statuses[0];
    const taskStatusEntity =
      findEntityById<StatusEntity>(this.database.statuses, 1, 'Task Status') ??
      defaultStatusEntity;

    const projectStatusEntity =
      this.database.statuses.find(
        (status) => status.id === projectEntity.statusId
      ) ?? defaultStatusEntity;

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      status: {
        id: projectStatusEntity.id,
        name: projectStatusEntity.name,
      },
      projectMembers: projectMembersEntities.map((pm) => ({
        id: pm.userId,
        user: usersEntities.find((user) => user.id === pm.userId)!,
        role: rolesEntities.find((role) => role.id === pm.roleId)!,
      })),
      tasks: tasksEntities.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        assignee: usersEntities.find((user) => user.id === task.assigneeId),
        status: {
          id: taskStatusEntity.id,
          name: taskStatusEntity.name,
        },
      })),
    };
  }

  async deleteProject(projectId: number): Promise<void> {
    const projectIndex = this.database.projects.findIndex(
      (p) => p.id === projectId
    );
    if (projectIndex === -1) throw new NotFoundError('Project');

    this.database.projects.splice(projectIndex, 1);
  }
}
