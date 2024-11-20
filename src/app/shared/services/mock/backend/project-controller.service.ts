import { inject, Injectable } from '@angular/core';
import { Project } from '../../../models/Project';
import {
  ProjectDetails,
  ProjectDetailsPermissions,
} from '../../../models/ProjectDetails';
import { filterEntitiesByField, findEntityById } from '../database/utils';
import { DatabaseMockService } from '../database/database.service';
import {
  ProjectEntity,
  ProjectMemberEntity,
  StatusEntity,
  TaskEntity,
} from '../database/entities';
import { ProjectSummary } from '../../../models/ProjectSummary';
import { ProjectMember } from '../../../models/ProjectMember';

@Injectable({ providedIn: 'root' })
export class ProjectControllerService {
  private readonly database = inject(DatabaseMockService);

  async getProjectDetails(projectId: number): Promise<ProjectDetails | null> {
    const userId = 1;
    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      projectId
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

  async getProjectSummaries(): Promise<ProjectSummary[]> {
    const userId = 1; // Hardcoded user ID for now
    const projectEntities = this.database.projects;
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

  async getProjectSummary(projectId: number): Promise<ProjectSummary | null> {
    const userId = 1; // Hardcoded user ID for now
    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      projectId
    );

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

  async getProject(projectId: number): Promise<Project | null> {
    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      projectId
    );

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

  async deleteProject(projectId: number): Promise<Project | null> {
    const project: Project | undefined = this.database.projects.find(
      (p) => p.id === projectId
    );
    if (!project) return null;
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
    return project;
  }

  async addProject(
    project: Omit<Project, 'id' | 'statusId'>
  ): Promise<Project> {
    const userId = 1; // Hardcoded user ID for now

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
  ): Promise<ProjectMember> {
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
