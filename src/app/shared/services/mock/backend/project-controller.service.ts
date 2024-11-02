import { inject, Injectable } from '@angular/core';
import { Project } from '../../../models/Project';
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

  async getProjectDetails(projectId: number): Promise<ProjectDetails | null> {
    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      projectId,
      'Project'
    );

    if (!projectEntity) {
      return null;
    }

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

  async deleteProject(projectId: number): Promise<Project | null> {
    const project: Project | undefined = this.database.projects.find(
      (p) => p.id === projectId
    );
    if (!project) return null;
    this.database.projects.splice(this.database.projects.indexOf(project), 1);
    return project;
  }

  async addProject(
    project: Omit<Project, 'id' | 'statusId'>
  ): Promise<Project> {
    const projectEntity: ProjectEntity = {
      id: this.database.projects.length + 1,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      statusId: 1,
    };

    this.database.projects.push(projectEntity);

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      statusId: projectEntity.statusId,
    };
  }
}
