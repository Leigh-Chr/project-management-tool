import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatchTaskPopupComponent } from './patch-task-popup.component';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { of } from 'rxjs';

describe('PatchTaskPopupComponent', () => {
  let component: PatchTaskPopupComponent;
  let fixture: ComponentFixture<PatchTaskPopupComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockTask = {
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

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['patchTask']);
    taskSpy.patchedTask = jasmine.createSpy('patchedTask').and.returnValue(null);
    taskSpy.patchedTask.set = jasmine.createSpy('set');
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [PatchTaskPopupComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatchTaskPopupComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with task data', () => {
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
    
    const form = component.taskForm;
    expect(form.get('name')?.value).toBe('Test Task');
    expect(form.get('description')?.value).toBe('Test Description');
    expect(form.get('priority')?.value).toBe(1);
  });

  it('should call patchTask when form is submitted', () => {
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
    
    const mockResponse = { 
      id: 1, 
      name: 'Updated Task',
      description: 'Updated Description',
      dueDate: new Date(),
      priority: 2,
      status: 'Completed',
      assignee: { id: 1, username: 'testuser', email: 'test@example.com', role: 'Member' },
      project: { id: 1, name: 'Test Project', description: 'Test', startDate: new Date(), endDate: new Date(), status: 'Active' },
      taskHistory: []
    };
    taskService.patchTask.and.returnValue(of(mockResponse));
    
    component.submit();
    
    expect(taskService.patchTask).toHaveBeenCalled();
  });

  it('should emit onClose when close is triggered', () => {
    spyOn(component.onClose, 'emit');
    component.onClose.emit();
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should display correct popup title', () => {
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
    
    const popup = fixture.nativeElement.querySelector('ui-popup');
    expect(popup.getAttribute('popupTitle')).toBe('Edit Task');
  });
});
