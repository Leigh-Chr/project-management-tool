import {
  Injectable,
  Injector,
  inject,
  signal,
} from '@angular/core';
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
import { CrudUtils } from '../../utils/crud.utils';
import { ToastService } from '../../components/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly apiService = inject(ApiService);
  private readonly injector = inject(Injector);
  private readonly toastService = inject(ToastService);

  private deleteCounter = 0;
  private postCounter = 0;
  private deleteMemberCounter = 0;
  private postMemberCounter = 0;

  readonly deletedProject = signal<{id: number, counter: number} | null>(null);
  readonly postedProject = signal<{project: Project, counter: number} | null>(null);

  readonly deletedProjectMember = signal<{member: ProjectMember, counter: number} | null>(null);
  readonly postedProjectMember = signal<{member: ProjectMember, counter: number} | null>(null);

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

    return CrudUtils.createCrudOperation(
      deletedProjectObservable,
      this.injector,
      (_result) => {
        this.deleteCounter++;
        this.deletedProject.set({id: projectId, counter: this.deleteCounter});
      },
      (_error) => {
        this.toastService.showToast({
          title: 'Error',
          message: 'Failed to delete project',
          type: 'error'
        });
      }
    );
  }

  postProject(
    project: PostProjectRequest
  ): Observable<PostProjectResponse | undefined> {
    const postedProjectObservable = this.apiService.post<PostProjectResponse>('/projects', project);

    return CrudUtils.createPostOperation(
      postedProjectObservable,
      this.injector,
      (result) => {
        this.postCounter++;
        this.postedProject.set({project: result, counter: this.postCounter});
      },
      this.toastService
    );
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

    return CrudUtils.createPostOperation(
      postedProjectMemberObservable,
      this.injector,
      (result) => {
        this.postMemberCounter++;
        this.postedProjectMember.set({member: result, counter: this.postMemberCounter});
      },
      this.toastService
    );
  }

  deleteProjectMember(
    projectId: number,
    projectMemberId: number
  ): Observable<DeleteProjectMemberResponse | undefined> {
    const deletedProjectMemberObservable =
      this.apiService.delete<DeleteProjectMemberResponse>(`/projects/${projectId}/members/${projectMemberId}`);

    return CrudUtils.createCrudOperation(
      deletedProjectMemberObservable,
      this.injector,
      (result) => {
        this.deleteMemberCounter++;
        this.deletedProjectMember.set({member: result, counter: this.deleteMemberCounter});
      },
      () => {
        this.toastService.showToast({
          title: 'Error',
          message: 'Failed to remove project member',
          type: 'error'
        });
      }
    );
  }
}
