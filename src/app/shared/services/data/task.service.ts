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
import { TaskController } from '../mock/backend/task.controller';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly injector = inject(Injector);
  private readonly taskController = inject(TaskController);

  readonly deletedTask = signal<number | null>(null);
  readonly postedTask = signal<Task | null>(null);
  readonly patchedTask = signal<Task | null>(null);

  deleteTask(taskId: number): Observable<DeleteTaskResponse | undefined> {
    const deletedTaskObservable = this.taskController.deleteTask(taskId);

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
    const addedTaskObservable = this.taskController.addTask(task);

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
    return this.taskController.getTask(taskId);
  }

  getTasks(): Observable<GetTasksResponse> {
    return this.taskController.getTasks();
  }

  getTaskDetails(
    taskId: number
  ): Observable<GetTaskDetailsResponse | undefined> {
    return this.taskController.getTaskDetails(taskId);
  }

  patchTask(
    taskId: number,
    task: PatchTaskRequest
  ): Observable<PatchTaskResponse | undefined> {
    const patchedTaskObservable = this.taskController.patchTask(taskId, task);

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
