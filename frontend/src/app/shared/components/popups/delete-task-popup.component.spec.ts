import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteTaskPopupComponent } from './delete-task-popup.component';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { of } from 'rxjs';

describe('DeleteTaskPopupComponent', () => {
  let component: DeleteTaskPopupComponent;
  let fixture: ComponentFixture<DeleteTaskPopupComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['deleteTask']);
    taskSpy.deletedTask = jasmine.createSpy('deletedTask').and.returnValue(null);
    taskSpy.deletedTask.set = jasmine.createSpy('set');
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [DeleteTaskPopupComponent],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTaskPopupComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteTask when confirmed', () => {
    fixture.componentRef.setInput('taskId', 1);
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
    taskService.deleteTask.and.returnValue(of(mockResponse));
    
    component.deleteTask();
    
    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should emit onClose when close is triggered', () => {
    spyOn(component.onClose, 'emit');
    component.onClose.emit();
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should display correct popup title', () => {
    fixture.detectChanges();
    
    const popup = fixture.nativeElement.querySelector('ui-popup');
    expect(popup.getAttribute('popupTitle')).toBe('Delete Task');
  });
});
