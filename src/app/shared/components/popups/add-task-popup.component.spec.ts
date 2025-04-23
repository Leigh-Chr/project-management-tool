import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddTaskPopupComponent } from './add-task-popup.component';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { StatusService } from '../../services/data/status.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { Task } from '../../models/task.models';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AddTaskPopupComponent', () => {
  let component: AddTaskPopupComponent;
  let fixture: ComponentFixture<AddTaskPopupComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let statusService: jasmine.SpyObj<StatusService>;

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['addTask', 'getProjectMembers'], {
      postedTask: signal(null)
    });
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    const statusSpy = jasmine.createSpyObj('StatusService', ['getStatuses']);

    taskSpy.getProjectMembers.and.returnValue(of([
      { id: 1, username: 'User 1' },
      { id: 2, username: 'User 2' }
    ]));

    statusSpy.getStatuses.and.returnValue(of([
      { id: 1, name: 'To Do' },
      { id: 2, name: 'In Progress' },
      { id: 3, name: 'Done' }
    ]));

    await TestBed.configureTestingModule({
      imports: [AddTaskPopupComponent, ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: StatusService, useValue: statusSpy }
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    statusService = TestBed.inject(StatusService) as jasmine.SpyObj<StatusService>;

    fixture = TestBed.createComponent(AddTaskPopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
  });

  it('should create and initialize form controls', () => {
    expect(component).toBeTruthy();
    expect(component.name).toBeTruthy();
    expect(component.description).toBeTruthy();
    expect(component.dueDate).toBeTruthy();
    expect(component.priority).toBeTruthy();
    expect(component.assigneeId).toBeTruthy();
    expect(component.statusId).toBeTruthy();
  });

  it('should load project members and statuses', () => {
    expect(taskService.getProjectMembers).toHaveBeenCalledWith(1);
    expect(statusService.getStatuses).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.submit();
    expect(taskService.addTask).not.toHaveBeenCalled();
  });

  it('should submit if form is valid and close popup on success', fakeAsync(() => {
    const newTask = {
      name: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
      assigneeId: 1,
      projectId: 1,
      statusId: 1
    };

    component.name.setValue(newTask.name);
    component.description.setValue(newTask.description);
    component.dueDate.setValue(newTask.dueDate);
    component.priority.setValue(newTask.priority);
    component.assigneeId.setValue(newTask.assigneeId);
    component.statusId.setValue(newTask.statusId);

    const mockTask: Task = {
      id: 1,
      name: newTask.name,
      description: newTask.description,
      status: 'To Do',
      project: {
        id: newTask.projectId,
        name: 'Test Project',
        description: 'Test Description',
        status: 'ACTIVE',
        myRole: 'Member'
      },
      assignee: {
        id: newTask.assigneeId,
        username: 'testUser',
        email: 'test@example.com',
        role: 'Member'
      },
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      taskHistory: [],
      myRole: 'Member'
    };

    taskService.addTask.and.returnValue(of(mockTask));
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    component.submit();
    expect(taskService.addTask).toHaveBeenCalledWith(newTask);
    
    taskService.postedTask.set(mockTask);
    tick();
    fixture.detectChanges();
    expect(closeSpy).toHaveBeenCalled();
  }));

  it('should show error toast when task creation fails', fakeAsync(() => {
    taskService.addTask.and.returnValue(of(undefined));
    component.name.setValue('Test Task');
    component.description.setValue('Test Description');
    component.dueDate.setValue(new Date());
    component.priority.setValue(1);
    component.assigneeId.setValue(1);
    component.statusId.setValue(1);
    component.submit();
    tick();
    fixture.detectChanges();
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Error',
      message: 'Failed to add task',
      type: 'error'
    });
  }));
}); 