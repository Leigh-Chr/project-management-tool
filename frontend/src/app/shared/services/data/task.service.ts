import {
  Injectable,
  Injector,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly injector = inject(Injector);
  private readonly apiService = inject(ApiService);

  readonly deletedTask = signal<number | null>(null);
  readonly postedTask = signal<Task | null>(null);
  readonly patchedTask = signal<Task | null>(null);

  deleteTask(taskId: number): Observable<DeleteTaskResponse | undefined> {
    const deletedTaskObservable = this.apiService.delete<DeleteTaskResponse>(`/tasks/${taskId}`);

    const deletedTaskSignal = toSignal(deletedTaskObservable, {
      injector: this.injector,
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const deletedTask = deletedTaskSignal();
        if (!deletedTask) {
          return;
        }
        this.deletedTask.set(deletedTask.id);
      });
    });

    return deletedTaskObservable;
  }

  addTask(task: PostTaskRequest): Observable<PostTaskResponse | undefined> {
    const addedTaskObservable = this.apiService.post<PostTaskResponse>('/tasks', task);

    const addedTaskSignal = toSignal(addedTaskObservable, {
      injector: this.injector,
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const addedTask = addedTaskSignal();
        if (!addedTask) {
          return;
        }
        this.postedTask.set(addedTask);
      });
    });

    return addedTaskObservable;
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

    const patchedTaskSignal = toSignal(patchedTaskObservable, {
      injector: this.injector,
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const patchedTask = patchedTaskSignal();
        if (!patchedTask) {
          return;
        }
        this.patchedTask.set(patchedTask);
      });
    });

    return patchedTaskObservable;
  }
}
