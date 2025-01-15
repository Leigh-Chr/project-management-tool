import { inject, Injectable } from '@angular/core';
import { ProjectResponse } from '../../../models/Projects/ProjectResponse';
import {
  ProjectDetailsResponse,
  ProjectDetailsPermissions,
} from '../../../models/Projects/ProjectDetailsResponse';
import { filterEntitiesByField, findEntityById } from '../database/utils';
import { DatabaseMockService } from '../database/database.service';
import {
  ProjectEntity,
  ProjectMemberEntity,
  StatusEntity,
  TaskEntity,
} from '../database/entities';
import { ProjectSummaryResponse } from '../../../models/Projects/ProjectSummaryResponse';
import { ProjectMemberResponse } from '../../../models/Projects/ProjectMemberResponse';
import { AddProjectRequest } from '../../../models/Projects/AddProjectRequest';
import { AuthService } from '../../auth.service';

@Injectable({ providedIn: 'root' })
export class ProjectController {
  private readonly database = inject(DatabaseMockService);
  private readonly authService = inject(AuthService);

  async getProjectDetails(
    projectId: number
  ): Promise<ProjectDetailsResponse | null> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return null;
    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      projectId
    );

    if (!projectEntity) {
      return null;
    }

    const canView = await this.isMember(projectId, userId);
    if (!canView) return null;

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
      findEntityById<StatusEntity>(this.database.statuses, 1) ??
      defaultStatusEntity;

    const projectStatusEntity =
      this.database.statuses.find(
        (status) => status.id === projectEntity.statusId
      ) ?? defaultStatusEntity;

    const isAdmin = await this.isAdmin(projectEntity.id, userId);

    const permissions: ProjectDetailsPermissions = {
      deleteProject: isAdmin,
      addMember: isAdmin,
      deleteMember: isAdmin,
      addTask: isAdmin,
      deleteTask: isAdmin,
      assignTask: isAdmin,
      assignMember: isAdmin,
    };

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
      permissions,
    };
  }

  async getProjectSummaries(
    assignedOnly: boolean = false
  ): Promise<ProjectSummaryResponse[]> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return [];
    let projectEntities = this.database.projects;

    if (assignedOnly) {
      const userProjectIds = this.database.projectMembers
        .filter((pm) => pm.userId === userId)
        .map((pm) => pm.projectId);
      projectEntities = projectEntities.filter((project) =>
        userProjectIds.includes(project.id)
      );
    }

    const statusEntities = this.database.statuses;

    const projectSummaries = await Promise.all(
      projectEntities.map(async (project) => {
        const status =
          statusEntities.find((status) => status.id === project.statusId)
            ?.name ?? statusEntities[0].name;

        const memberCount = this.database.projectMembers.filter(
          (pm) => pm.projectId === project.id
        ).length;

        const permissions = {
          deleteProject: await this.isAdmin(project.id, userId),
        };

        return {
          id: project.id,
          name: project.name,
          startDate: project.startDate,
          endDate: project.endDate,
          status,
          memberCount,
          permissions,
        };
      })
    );

    return projectSummaries;
  }

  async getProjectSummary(
    projectId: number
  ): Promise<ProjectSummaryResponse | null> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return null;
    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      projectId
    );

    const canView = await this.isMember(projectId, userId);
    if (!canView) return null;

    if (!projectEntity) {
      return null;
    }

    const statusEntity = this.database.statuses.find(
      (status) => status.id === projectEntity.statusId
    );

    const status = statusEntity?.name ?? 'Unknown';

    const memberCount = this.database.projectMembers.filter(
      (pm) => pm.projectId === projectEntity.id
    ).length;

    const permissions = {
      deleteProject: await this.isAdmin(projectEntity.id, userId),
    };

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      status,
      memberCount,
      permissions,
    };
  }

  async getProject(projectId: number): Promise<ProjectResponse | null> {
    const userId = this.authService.authUser()!.id;

    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      projectId
    );
    if (!projectEntity) return null;

const canView = await this.isMember(projectId, userId);
    if (!canView) return null;

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      statusId: projectEntity.statusId,
    };
  }

  async deleteProject(projectId: number): Promise<ProjectResponse | null> {
    const project: ProjectResponse | undefined = this.database.projects.find(
      (p) => p.id === projectId
    );
    if (!project) return null;

    const canDelete = await this.isAdmin(projectId, this.authService.authUser()!.id);
    if (!canDelete) return null;

    this.database.projects.splice(this.database.projects.indexOf(project), 1);
    const projectMembers = this.database.projectMembers.filter(
      (pm) => pm.projectId === projectId
    );
    projectMembers.forEach((pm) => {
      this.database.projectMembers.splice(
        this.database.projectMembers.indexOf(pm),
        1
      );
    });
    const taskIds = this.database.tasks
      .filter((t) => t.projectId === projectId)
      .map((t) => t.id);
    taskIds.forEach((taskId) => {
      this.database.tasks.splice(
        this.database.tasks.indexOf(this.database.tasks.find((t): t is TaskEntity => t.id === taskId)!),
        1
      );
      this.database.taskHistory.splice(
        this.database.taskHistory.findIndex((th) => th.taskId === taskId),
        1
      );
    }
    );
    return project;
  }

  async addProject(
    project: AddProjectRequest
  ): Promise<ProjectResponse | null> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return null;

    const projectEntity: ProjectEntity = {
      id: this.database.projects.length + 1,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      statusId: 1,
    };

    const canAdd = this.database.projectMembers.some(
      (pm) => pm.projectId === projectEntity.id && pm.userId === userId
    );
    if (!canAdd) return null;

    this.database.projects.push(projectEntity);

    const projectMemberEntity: ProjectMemberEntity = {
      projectId: projectEntity.id,
      userId,
      roleId: 1,
    };

    this.database.projectMembers.push(projectMemberEntity);

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      statusId: projectEntity.statusId,
    };
  }

  async isMember(projectId: number, userId: number): Promise<boolean> {
    const res = this.database.projectMembers.some(
      (pm) => pm.projectId === projectId && pm.userId === userId
    );
    return res;
  }

  async isAdmin(projectId: number, userId: number): Promise<boolean> {
    return this.database.projectMembers.some((pm) => {
      return (
        pm.projectId === projectId && pm.userId === userId && pm.roleId === 1
      );
    });
  }

  async addProjectMember(
    projectId: number,
    userId: number,
    roleId: number
  ): Promise<ProjectMemberResponse | null> {
    const canAdd = await this.isAdmin(projectId, this.authService.authUser()!.id);
    
    const projectMemberEntity: ProjectMemberEntity = {
      projectId,
      userId,
      roleId,
    };

    if (!canAdd) return null;

    this.database.projectMembers.push(projectMemberEntity);

    return {
      projectId: projectMemberEntity.projectId,
      userId: projectMemberEntity.userId,
      roleId: projectMemberEntity.roleId,
    };
  }
}
