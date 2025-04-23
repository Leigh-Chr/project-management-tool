import { signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Task } from '../../models/task.models';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { DeleteTaskPopupComponent } from './delete-task-popup.component';

describe('DeleteTaskPopupComponent', () => {
  let component: DeleteTaskPopupComponent;
  let fixture: ComponentFixture<DeleteTaskPopupComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockTask: Task = {
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    status: 'To Do',
    project: {
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      status: 'ACTIVE',
      myRole: 'Member'
    },
    assignee: {
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      role: 'Member'
    },
    priority: 1,
    dueDate: new Date(),
    taskHistory: [],
    myRole: 'Member'
  };

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['deleteTask', 'getTask'], {
      deletedTask: signal<number | null>(null)
    });
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    taskSpy.getTask.and.returnValue(of(mockTask));

    await TestBed.configureTestingModule({
      imports: [DeleteTaskPopupComponent],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    fixture = TestBed.createComponent(DeleteTaskPopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('taskId', 1);
    fixture.detectChanges();
  });

  it('should create and initialize with task data', () => {
    expect(component).toBeTruthy();
    expect(component.task()).toEqual(mockTask);
  });

  it('should delete task and close popup on success', fakeAsync(() => {
    taskService.deleteTask.and.returnValue(of(undefined));
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    component.deleteTask();
    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    
    taskService.deletedTask.set(1);
    tick();
    fixture.detectChanges();
    expect(closeSpy).toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Success',
      message: 'Task deleted',
      type: 'success'
    });
  }));

  it('should show error toast when task not found', fakeAsync(() => {
    taskService.getTask.and.returnValue(of(undefined));
    
    fixture = TestBed.createComponent(DeleteTaskPopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('taskId', 1);
    fixture.detectChanges();
    
    tick();
    fixture.detectChanges();
    
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Error',
      message: 'Task not found',
      type: 'error'
    });
  }));
}); 