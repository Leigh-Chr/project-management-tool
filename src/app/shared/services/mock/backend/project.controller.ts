import { Injectable, inject } from '@angular/core';
import type {
  DeleteProjectResponse,
  GetProjectDetailsResponse,
  GetProjectResponse,
  GetProjectsResponse,
  PostProjectRequest,
  PostProjectResponse,
} from '@app/shared/models/project.models';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import type { ProjectEntity } from '../../../models/entities';
import { DatabaseMockService } from '../database/database.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProjectController {
  private readonly database = inject(DatabaseMockService);
  private readonly authService = inject(AuthService);

  getProject(projectId: number): Observable<GetProjectResponse | undefined> {
    const myRole = this.authService.getRole(projectId);
    if (!myRole) {
      return of(undefined);
    }

    const projectEntity = this.database.projects.find(
      (p) => p.id === projectId
    );
    if (!projectEntity) {
      return of(undefined);
    }
    const statusEntity = this.database.statuses.find(
      (s) => s.id === projectEntity.statusId
    );
    if (!statusEntity) {
      return of(undefined);
    }

    const project: GetProjectResponse = {
      ...projectEntity,
      status: statusEntity.name,
      myRole,
    };

    return of(project);
  }

  getProjects(): Observable<GetProjectsResponse> {
    return of(
      this.database.projects
        .map((p) => {
          const myRole = this.authService.getRole(p.id);
          if (!myRole) {
            return null;
          }

          const statusEntity = this.database.statuses.find(
            (s) => s.id === p.statusId
          );

          if (!statusEntity) {
            return null;
          }

          return {
            ...p,
            status: statusEntity.name,
            myRole,
          };
        })
        .filter(
          (project): project is NonNullable<typeof project> => project !== null
        )
    );
  }

  deleteProject(
    projectId: number
  ): Observable<DeleteProjectResponse | undefined> {
    const myRole = this.authService.getRole(projectId);
    if (myRole !== 'Administrator') {
      return of(undefined);
    }

    const projectEntity = this.database.projects.find(
      (p) => p.id === projectId
    );
    if (!projectEntity) {
      return of(undefined);
    }

    this.database.projects.splice(
      this.database.projects.indexOf(projectEntity),
      1
    );

    const projectMembers = this.database.projectMembers.filter(
      (pm) => pm.projectId === projectId
    );
    for (const pm of projectMembers) {
      this.database.projectMembers.splice(
        this.database.projectMembers.indexOf(pm),
        1
      );
    }

    const taskIds = this.database.tasks
      .filter((t) => t.projectId === projectId)
      .map((t) => t.id);

    for (const taskId of taskIds) {
      const task = this.database.tasks.find((t) => t.id === taskId);
      if (task) {
        this.database.tasks.splice(this.database.tasks.indexOf(task), 1);
      }
      const historyIndex = this.database.taskHistory.findIndex(
        (th) => th.taskId === taskId
      );
      if (historyIndex !== -1) {
        this.database.taskHistory.splice(historyIndex, 1);
      }
    }

    const status = this.database.statuses.find(
      (s) => s.id === projectEntity.statusId
    );

    if (!status) {
      return of(undefined);
    }

    return of({
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      status: status.name,
    });
  }

  postProject(
    project: PostProjectRequest
  ): Observable<PostProjectResponse | undefined> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return of(undefined);
    }

    const projectEntity: ProjectEntity = {
      id: this.database.projects.length + 1,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      statusId: project.statusId,
    };

    this.database.projects.push(projectEntity);

    const status = this.database.statuses.find(
      (s) => s.id === projectEntity.statusId
    );
    if (!status) {
      return of(undefined);
    }

    const role = this.database.roles.find((r) => r.name === 'Administrator');
    if (!role) {
      return of(undefined);
    }

    this.database.projectMembers.push({
      id: this.database.projectMembers.length + 1,
      projectId: projectEntity.id,
      userId,
      roleId: role.id,
    });

    return of({
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      status: status.name,
      myRole: role.name,
    });
  }

  getProjectDetails(
    projectId: number
  ): Observable<GetProjectDetailsResponse | undefined> {
    const myRole = this.authService.getRole(projectId);
    console.log('myRole', myRole);
    if (!myRole) {
      return of(undefined);
    }

    const projectEntity = this.database.projects.find(
      (p) => p.id === projectId
    );
    if (!projectEntity) {
      return of(undefined);
    }

    const statusEntity = this.database.statuses.find(
      (s) => s.id === projectEntity.statusId
    );
    if (!statusEntity) {
      return of(undefined);
    }

    const projectMembers = this.database.projectMembers
      .filter((pm) => pm.projectId === projectId)
      .map((pm) => {
        const user = this.database.users.find((u) => u.id === pm.userId);
        const role = this.database.roles.find((r) => r.id === pm.roleId);
        if (!user || !role) {
          return null;
        }
        return {
          id: pm.id,
          user: user.username,
          role: role.name,
        };
      })
      .filter(
        (member): member is NonNullable<typeof member> => member !== null
      );
    const tasks = this.database.tasks.filter((t) => t.projectId === projectId);

    const projectDetails: GetProjectDetailsResponse = {
      id: projectEntity.id,
      name: projectEntity.name,
      description: projectEntity.description,
      startDate: projectEntity.startDate,
      endDate: projectEntity.endDate,
      status: statusEntity.name,
      projectMembers: projectMembers
        .map((pm) => {
          const user = this.database.users.find((u) => u.id === pm.id);
          if (!user) {
            return null;
          }
          return {
            id: pm.id,
            project: projectEntity.name,
            username: user.username,
            email: user.email,
            role: pm.role,
          };
        })
        .filter(
          (member): member is NonNullable<typeof member> => member !== null
        ),
      tasks: tasks
        .map((t) => {
          const assignee = this.database.users.find(
            (u) => u.id === t.assigneeId
          );
          const status = this.database.statuses.find(
            (s) => s.id === t.statusId
          );
          if (!status) {
            return null;
          }

          const projectMember = this.database.projectMembers.find(
            (pm) =>
              pm.userId === t.assigneeId && pm.projectId === projectEntity.id
          );
          const roleEntity = this.database.roles.find(
            (r) => r.id === projectMember?.roleId
          );
          if (!roleEntity) {
            return null;
          }

          return {
            id: t.id,
            name: t.name,
            description: t.description,
            status: status.name,
            project: {
              id: projectEntity.id,
              name: projectEntity.name,
              description: projectEntity.description,
              status: status.name,
            },
            assignee: assignee
              ? {
                  id: assignee.id,
                  username: assignee.username,
                  email: assignee.email,
                  role: roleEntity.name,
                }
              : undefined,
            priority: t.priority,
          };
        })
        .filter((task): task is NonNullable<typeof task> => task !== null),
      myRole,
    };

    return of(projectDetails);
  }
}
