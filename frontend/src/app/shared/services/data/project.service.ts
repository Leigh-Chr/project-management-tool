import {
  Injectable,
  Injector,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type {
  DeleteProjectMemberResponse,
  DeleteProjectResponse,
  GetProjectDetailsResponse,
  GetProjectMemberResponse,
  GetProjectResponse,
  GetProjectsResponse,
  PostProjectMemberResponse,
  PostProjectRequest,
  PostProjectResponse,
  Project,
  ProjectMember,
} from '@app/shared/models/project.models';
import type { Observable } from 'rxjs';
import type { ProjectMemberEntity } from '../../models/entities';
import { ProjectMemberController } from '../mock/backend/project-member.controller';
import { ProjectController } from '../mock/backend/project.controller';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projectController = inject(ProjectController);
  private readonly projectMemberController = inject(ProjectMemberController);
  private readonly injector = inject(Injector);

  readonly deletedProject = signal<number | null>(null);
  readonly postedProject = signal<Project | null>(null);

  readonly deletedProjectMember = signal<ProjectMember | null>(null);
  readonly postedProjectMember = signal<ProjectMember | null>(null);

  getProject(projectId: number): Observable<GetProjectResponse | undefined> {
    return this.projectController.getProject(projectId);
  }

  getProjects(): Observable<GetProjectsResponse | undefined> {
    return this.projectController.getProjects();
  }

  deleteProject(
    projectId: number
  ): Observable<DeleteProjectResponse | undefined> {
    const deletedProjectObservable =
      this.projectController.deleteProject(projectId);

    const deletedProjectSignal = toSignal(deletedProjectObservable, {
      injector: this.injector,
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const deletedProject = deletedProjectSignal();
        if (!deletedProject) {return;}
        this.deletedProject.set(projectId);
      });
    });

    return deletedProjectObservable;
  }

  postProject(
    project: PostProjectRequest
  ): Observable<PostProjectResponse | undefined> {
    const postedProjectObservable = this.projectController.postProject(project);

    const postedProjectSignal = toSignal(postedProjectObservable, {
      injector: this.injector,
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const postedProject = postedProjectSignal();
        if (!postedProject) {return;}
        this.postedProject.set(postedProject);
      });
    });

    return postedProjectObservable;
  }

  getProjectDetails(
    projectId: number
  ): Observable<GetProjectDetailsResponse | undefined> {
    return this.projectController.getProjectDetails(projectId);
  }

  getProjectMember(
    projectMemberId: number
  ): Observable<GetProjectMemberResponse | undefined> {
    return this.projectMemberController.getProjectMember(projectMemberId);
  }

  getProjectMembers(): Observable<ProjectMemberEntity[]> {
    return this.projectMemberController.getProjectMembers();
  }

  postProjectMember(
    projectId: number,
    userId: number,
    roleId: number
  ): Observable<PostProjectMemberResponse | undefined> {
    const postedProjectMemberObservable =
      this.projectMemberController.postProjectMember(projectId, userId, roleId);

    const postedProjectMemberSignal = toSignal(postedProjectMemberObservable, {
      injector: this.injector,
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const postedProjectMember = postedProjectMemberSignal();
        if (!postedProjectMember) {return;}
        this.postedProjectMember.set(postedProjectMember);
      });
    });

    return postedProjectMemberObservable;
  }

  deleteProjectMember(
    projectMemberId: number
  ): Observable<DeleteProjectMemberResponse | undefined> {
    const deletedProjectMemberObservable =
      this.projectMemberController.deleteProjectMember(projectMemberId);

    const deletedProjectMemberSignal = toSignal(
      deletedProjectMemberObservable,
      {
        injector: this.injector,
      }
    );

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const deletedProjectMember = deletedProjectMemberSignal();
        if (!deletedProjectMember) {return;}
        this.deletedProjectMember.set(deletedProjectMember);
      });
    });

    return deletedProjectMemberObservable;
  }
}
