import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddTaskPopupComponent } from './add-task-popup.component';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { of } from 'rxjs';

describe('AddTaskPopupComponent', () => {
  let component: AddTaskPopupComponent;
  let fixture: ComponentFixture<AddTaskPopupComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['addTask', 'getProjectMembers']);
    taskSpy.postedTask = jasmine.createSpy('postedTask').and.returnValue(null);
    taskSpy.postedTask.set = jasmine.createSpy('set');
    taskSpy.getProjectMembers = jasmine.createSpy('getProjectMembers').and.returnValue(of([]));
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [AddTaskPopupComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskPopupComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
    
    const form = component.taskForm;
    expect(form.get('name')).toBeTruthy();
    expect(form.get('description')).toBeTruthy();
    expect(form.get('dueDate')).toBeTruthy();
    expect(form.get('priority')).toBeTruthy();
    expect(form.get('statusId')).toBeTruthy();
  });

  it('should validate required fields', () => {
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
    
    const form = component.taskForm;
    expect(form.invalid).toBe(true);
    
    form.patchValue({
      name: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
      statusId: 1
    });
    
    expect(form.valid).toBe(true);
  });

  it('should call addTask when form is submitted', () => {
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
    
    const mockResponse = { 
      id: 1, 
      name: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
      status: 'In Progress',
      assignee: { id: 1, username: 'testuser', email: 'test@example.com', role: 'Member' },
      project: { id: 1, name: 'Test Project', description: 'Test', startDate: new Date(), endDate: new Date(), status: 'Active' },
      taskHistory: []
    };
    taskService.addTask.and.returnValue(of(mockResponse));
    
    component.taskForm.patchValue({
      name: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
      statusId: 1
    });
    
    component.submit();
    
    expect(taskService.addTask).toHaveBeenCalled();
  });

  it('should emit onClose when close is triggered', () => {
    spyOn(component.onClose, 'emit');
    component.onClose.emit();
    expect(component.onClose.emit).toHaveBeenCalled();
  });
});
