import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatchTaskPopupComponent } from './patch-task-popup.component';
import { TaskService } from '../../services/data/task.service';
import { ProjectService } from '../../services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { StatusService } from '@app/shared/services/data/status.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { Task } from '../../models/task.models';
import { fakeAsync, tick } from '@angular/core/testing';

describe('PatchTaskPopupComponent', () => {
  let component: PatchTaskPopupComponent;
  let fixture: ComponentFixture<PatchTaskPopupComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let statusService: jasmine.SpyObj<StatusService>;

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
    taskService = jasmine.createSpyObj('TaskService', ['patchTask', 'getProjectMembers'], {
      patchedTask: signal(null)
    });
    projectService = jasmine.createSpyObj('ProjectService', ['getProjectDetails']);
    toastService = jasmine.createSpyObj('ToastService', ['showToast']);
    statusService = jasmine.createSpyObj('StatusService', ['getStatuses']);

    taskService.getProjectMembers.and.returnValue(of([
      {
        id: 1,
        username: 'testUser',
        email: 'test@example.com',
        role: 'Member',
        project: 'Test Project'
      }
    ]));

    projectService.getProjectDetails.and.returnValue(of({
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      status: 'ACTIVE',
      projectMembers: [
        {
          id: 1,
          username: 'testUser',
          email: 'test@example.com',
          role: 'Member',
          project: 'Test Project'
        }
      ],
      tasks: []
    }));

    statusService.getStatuses.and.returnValue(of([
      { id: 1, name: 'To Do' },
      { id: 2, name: 'In Progress' },
      { id: 3, name: 'Done' }
    ]));

    await TestBed.configureTestingModule({
      imports: [PatchTaskPopupComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ProjectService, useValue: projectService },
        { provide: StatusService, useValue: statusService },
        { provide: ToastService, useValue: toastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatchTaskPopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create and initialize with task data', () => {
    expect(component).toBeTruthy();
    expect(component.task()).toEqual(mockTask);
  });

  it('should submit task changes and close popup on success', fakeAsync(() => {
    const updatedTask = { ...mockTask, name: 'Updated Task' };
    taskService.patchTask.and.returnValue(of(updatedTask));
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    component.submit();
    expect(taskService.patchTask).toHaveBeenCalledWith(1, jasmine.any(Object));
    
    taskService.patchedTask.set(updatedTask);
    tick();
    fixture.detectChanges();
    expect(closeSpy).toHaveBeenCalled();
  }));

  it('should show error toast when task update fails', fakeAsync(() => {
    taskService.patchTask.and.returnValue(of(undefined));
    
    component.name.setValue('Test Task');
    component.statusId.setValue(1);
    
    component.submit();
    tick();
    fixture.detectChanges();
    
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Error',
      message: 'Failed to update task',
      type: 'error'
    });
  }));
}); 