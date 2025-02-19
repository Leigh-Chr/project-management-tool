import { inject, Injectable } from '@angular/core';
import { AddProjectRequest } from '../../../models/Projects/AddProjectRequest';
import {
  GetProjectDetailsResponse,
  ProjectDetailsPermissions,
} from '../../../models/Projects/GetProjectDetailsResponse';
import { GetProjectMemberResponse } from '../../../models/Projects/GetProjectMemberResponse';
import { GetProjectResponse } from '../../../models/Projects/GetProjectResponse';
import { GetProjectSummaryResponse } from '../../../models/Projects/GetProjectSummaryResponse';
import { AuthService } from '../../auth.service';
import { DatabaseMockService } from '../database/database.service';
import {
  ProjectEntity,
  ProjectMemberEntity,
  TaskEntity
} from '../database/entities';

@Injectable({ providedIn: 'root' })
export class ProjectController {
  private readonly database = inject(DatabaseMockService);
  private readonly authService = inject(AuthService);

  async getProjectDetails(
    projectId: number
  ): Promise<GetProjectDetailsResponse | null> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return null;
    const projectEntity = this.database.projects.find((p) => p.id === projectId);

    if (!projectEntity) {
      return null;
    }

    const projectMembersEntities = this.database.projectMembers.filter(
      (pm) => pm.projectId === projectId
    );

    const userIds = projectMembersEntities.map((pm) => pm.userId);
    const roleIds = projectMembersEntities.map((pm) => pm.roleId);

    const usersEntities = this.database.users.filter((user) =>
      userIds.includes(user.id)
    );

    const rolesEntities = this.database.roles.filter((role) =>
      roleIds.includes(role.id)
    );

    const tasksEntities = this.database.tasks.filter(
      (task) => task.projectId === projectId
    );

    const defaultStatusEntity = this.database.statuses[0];
    const taskStatusEntity = this.database.statuses.find(
      (status) => status.id === tasksEntities[0].statusId
    ) ?? defaultStatusEntity;

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

    const assignee = usersEntities.find(
      (user) => user.id === tasksEntities[0].assigneeId
    );
    if (!assignee) return null;

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
        projectId: pm.projectId,
        user: usersEntities.find((user) => user.id === pm.userId)!,
        role: rolesEntities.find((role) => role.id === pm.roleId)!,
      })),
      tasks: tasksEntities.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        assigneeId: task.assigneeId,
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
  ): Promise<GetProjectSummaryResponse[]> {
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
        const statusEntity =
          statusEntities.find((status) => status.id === project.statusId)
        const memberCount = this.database.projectMembers.filter(
          (pm) => pm.projectId === project.id
        ).length;

        const permissions = {
          deleteProject: await this.isAdmin(project.id, userId),
        };

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          status: statusEntity,
          memberCount,
          permissions,
        };
      })
    );

    return projectSummaries;
  }

  async getProjectSummary(
    projectId: number
  ): Promise<GetProjectSummaryResponse | null> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return null;

    const projectEntity = this.database.projects.find((p) => p.id === projectId);
    if (!projectEntity) {
      return null;
    }

    const statusEntity = this.database.statuses.find(
      (status) => status.id === projectEntity.statusId
    );

    const memberCount = this.database.projectMembers.filter(
      (pm) => pm.projectId === projectEntity.id
    ).length;

    const permissions = {
      deleteProject: await this.isAdmin(projectEntity.id, userId),
    };

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      status: statusEntity,
      memberCount,
      permissions,
    };
  }

  async getProject(projectId: number): Promise<GetProjectResponse | null> {
    const projectEntity = this.database.projects.find((p) => p.id === projectId);
    if (!projectEntity) return null;

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      statusId: projectEntity.statusId,
    };
  }

  async deleteProject(projectId: number): Promise<GetProjectResponse | null> {
    const projectEntity: ProjectEntity | undefined = this.database.projects.find(
      (p) => p.id === projectId
    );
    if (!projectEntity) return null;

    const canDelete = await this.isAdmin(projectId, this.authService.authUser()!.id);
    if (!canDelete) return null;

    this.database.projects.splice(this.database.projects.indexOf(projectEntity), 1);
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

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      statusId: projectEntity.statusId,
    }
  }

  async addProject(
    project: AddProjectRequest
  ): Promise<GetProjectResponse | null> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return null;

    const projectEntity: ProjectEntity = {
      id: this.database.projects.length + 1,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      statusId: 1,
    };

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
  ): Promise<GetProjectMemberResponse | null> {
    const canAdd = await this.isAdmin(projectId, this.authService.authUser()!.id);
    if (!canAdd) return null;

    const projectMemberEntity: ProjectMemberEntity = {
      projectId,
      userId,
      roleId,
    };

    this.database.projectMembers.push(projectMemberEntity);

    return {
      projectId: projectMemberEntity.projectId,
      userId: projectMemberEntity.userId,
      roleId: projectMemberEntity.roleId,
    };
  }
}
