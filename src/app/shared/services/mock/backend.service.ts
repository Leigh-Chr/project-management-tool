import { inject, Injectable } from '@angular/core';
import {
  ProjectDetails,
  ProjectMember,
  Task,
} from '../../models/ProjectDetails';
import {
  filterEntitiesByField,
  findEntityById,
  mapEntities,
} from './backend.utils';
import { DatabaseMockService } from './database.service';
import {
  ProjectEntity,
  ProjectMemberEntity,
  StatusEntity,
  TaskEntity,
} from './entities';
import { mapProjectMember, mapStatus, mapTask } from './mappers';
import { NotFoundError } from '../../errors/NotFoundError';

@Injectable({ providedIn: 'root' })
export class BackendMockService {
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
    const taskStatusEntity = findEntityById<StatusEntity>(
      this.database.statuses,
      1,
      'Task Status'
    );

    const projectStatusEntity =
      this.database.statuses.find(
        (status) => status.id === projectEntity.statusId
      ) || defaultStatusEntity;

    const projectStatus = mapStatus(projectStatusEntity);
    const taskStatus = mapStatus(taskStatusEntity);

    const projectMembers = mapEntities<ProjectMemberEntity, ProjectMember>(
      projectMembersEntities,
      (pmEntity) => mapProjectMember(pmEntity, usersEntities, rolesEntities)
    );

    const tasks = mapEntities<TaskEntity, Task>(tasksEntities, (taskEntity) =>
      mapTask(taskEntity, projectMembers, taskStatus)
    );

    return {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      status: projectStatus,
      projectMembers,
      tasks,
    };
  }

  async deleteProject(projectId: number): Promise<void> {
    const projectIndex = this.database.projects.findIndex(
      (p) => p.id === projectId
    );
    if (projectIndex === -1) {
      throw new NotFoundError('Project');
    }

    this.database.projects.splice(projectIndex, 1);
  }
}
