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
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly apiService = inject(ApiService);
  private readonly injector = inject(Injector);

  readonly deletedProject = signal<number | null>(null);
  readonly postedProject = signal<Project | null>(null);

  readonly deletedProjectMember = signal<ProjectMember | null>(null);
  readonly postedProjectMember = signal<ProjectMember | null>(null);

  getProject(projectId: number): Observable<GetProjectResponse | undefined> {
    return this.apiService.get<GetProjectResponse>(`/projects/${projectId}`);
  }

  getProjects(): Observable<GetProjectsResponse | undefined> {
    return this.apiService.get<GetProjectsResponse>('/projects');
  }

  deleteProject(
    projectId: number
  ): Observable<DeleteProjectResponse | undefined> {
    const deletedProjectObservable =
      this.apiService.delete<DeleteProjectResponse>(`/projects/${projectId}`);

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
    const postedProjectObservable = this.apiService.post<PostProjectResponse>('/projects', project);

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
    return this.apiService.get<GetProjectDetailsResponse>(`/projects/${projectId}/details`);
  }

  getProjectMember(
    projectMemberId: number,
    projectId: number
  ): Observable<GetProjectMemberResponse | undefined> {
    return this.apiService.get<GetProjectMemberResponse>(`/projects/${projectId}/members/${projectMemberId}`);
  }

  getProjectMembers(projectId: number): Observable<ProjectMemberEntity[]> {
    return this.apiService.get<ProjectMemberEntity[]>(`/projects/${projectId}/members`);
  }

  postProjectMember(
    projectId: number,
    userId: number,
    roleId: number
  ): Observable<PostProjectMemberResponse | undefined> {
    const requestBody = { projectId, userId, roleId };
    const postedProjectMemberObservable =
      this.apiService.post<PostProjectMemberResponse>(`/projects/${projectId}/members`, requestBody);

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
    projectId: number,
    projectMemberId: number
  ): Observable<DeleteProjectMemberResponse | undefined> {
    const deletedProjectMemberObservable =
      this.apiService.delete<DeleteProjectMemberResponse>(`/projects/${projectId}/members/${projectMemberId}`);

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
