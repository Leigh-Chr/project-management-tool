import {
  Injectable,
  Injector,
  inject,
  signal,
} from '@angular/core';
import type { Observable } from 'rxjs';
import type {
  DeleteTaskResponse,
  GetTaskDetailsResponse,
  GetTaskResponse,
  GetTasksResponse,
  PatchTaskRequest,
  PatchTaskResponse,
  PostTaskRequest,
  PostTaskResponse,
  Task,
} from '../../models/task.models';
import type { ProjectMember } from '../../models/project.models';
import { ApiService } from '../api.service';
import { CrudUtils } from '../../utils/crud.utils';
import { ToastService } from '../../components/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly injector = inject(Injector);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  private deleteCounter = 0;
  private postCounter = 0;
  private patchCounter = 0;

  readonly deletedTask = signal<{id: number, counter: number} | null>(null);
  readonly postedTask = signal<{task: Task, counter: number} | null>(null);
  readonly patchedTask = signal<{task: Task, counter: number} | null>(null);

  deleteTask(taskId: number): Observable<DeleteTaskResponse | undefined> {
    const deletedTaskObservable = this.apiService.delete<DeleteTaskResponse>(`/tasks/${taskId}`);

    return CrudUtils.createCrudOperation(
      deletedTaskObservable,
      this.injector,
      (_result) => {
        this.deleteCounter++;
        this.deletedTask.set({id: taskId, counter: this.deleteCounter});
      },
      (_error) => {
        this.toastService.showToast({
          title: 'Error',
          message: 'Failed to delete task',
          type: 'error'
        });
      }
    );
  }

  addTask(task: PostTaskRequest): Observable<PostTaskResponse | undefined> {
    const addedTaskObservable = this.apiService.post<PostTaskResponse>('/tasks', task);

    return CrudUtils.createPostOperation(
      addedTaskObservable,
      this.injector,
      (result) => {
        this.postCounter++;
        this.postedTask.set({task: result, counter: this.postCounter});
      },
      this.toastService
    );
  }

  getTask(taskId: number): Observable<GetTaskResponse | undefined> {
    return this.apiService.get<GetTaskResponse>(`/tasks/${taskId}`);
  }

  getTasks(): Observable<GetTasksResponse> {
    return this.apiService.get<GetTasksResponse>('/tasks');
  }

  getTaskDetails(
    taskId: number
  ): Observable<GetTaskDetailsResponse | undefined> {
    return this.apiService.get<GetTaskDetailsResponse>(`/tasks/${taskId}/details`);
  }

  getProjectMembers(projectId: number): Observable<ProjectMember[]> {
    return this.apiService.get<ProjectMember[]>(`/projects/${projectId}/members`);
  }

  patchTask(
    taskId: number,
    task: PatchTaskRequest
  ): Observable<PatchTaskResponse | undefined> {
    const patchedTaskObservable = this.apiService.patch<PatchTaskResponse>(`/tasks/${taskId}`, task);

    return CrudUtils.createPatchOperation(
      patchedTaskObservable,
      this.injector,
      (result) => {
        this.patchCounter++;
        this.patchedTask.set({task: result, counter: this.patchCounter});
      },
      this.toastService
    );
  }
}
