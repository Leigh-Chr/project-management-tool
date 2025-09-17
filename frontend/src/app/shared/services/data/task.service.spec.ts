import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TaskService } from './task.service';
import { ApiService } from '../api.service';
import { ToastService } from '../../components/toast/toast.service';
import { Task } from '../../models/task.models';

describe('TaskService', () => {
  let service: TaskService;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockTask: Task = {
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    dueDate: new Date('2024-12-31'),
    priority: 1,
    status: 'In Progress',
    assignee: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'Admin'
    },
    project: {
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'In Progress'
    },
    taskHistory: []
  };

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'patch', 'delete']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: ApiService, useValue: apiSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    service = TestBed.inject(TaskService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should return tasks from API', () => {
      const mockTasks = [mockTask];
      apiService.get.and.returnValue(of(mockTasks));

      service.getTasks().subscribe(response => {
        expect(response).toEqual(mockTasks);
        expect(apiService.get).toHaveBeenCalledWith('/tasks');
      });
    });

    it('should handle API error', () => {
      apiService.get.and.returnValue(throwError(() => new Error('API Error')));

      service.getTasks().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('API Error');
        }
      });
    });
  });

  describe('getTask', () => {
    it('should return task details from API', () => {
      apiService.get.and.returnValue(of(mockTask));

      service.getTask(1).subscribe(response => {
        expect(response).toEqual(mockTask);
        expect(apiService.get).toHaveBeenCalledWith('/tasks/1');
      });
    });
  });

  describe('addTask', () => {
    it('should create a new task', () => {
      const newTask = {
        name: 'New Task',
        description: 'New Description',
        dueDate: new Date('2024-12-31'),
        priorityId: 1,
        statusId: 1,
        assigneeId: 1,
        projectId: 1
      };

      apiService.post.and.returnValue(of(mockTask));

      service.addTask(newTask).subscribe(response => {
        expect(response).toEqual(mockTask);
        expect(apiService.post).toHaveBeenCalledWith('/tasks', newTask);
      });
    });

    it('should handle creation error', () => {
      const newTask = {
        name: 'New Task',
        description: 'New Description',
        dueDate: new Date('2024-12-31'),
        priorityId: 1,
        statusId: 1,
        assigneeId: 1,
        projectId: 1
      };

      apiService.post.and.returnValue(throwError(() => new Error('Creation failed')));

      service.addTask(newTask).subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        error: (error) => {
          expect(error.message).toBe('Creation failed');
        }
      });
    });
  });

  describe('patchTask', () => {
    it('should update a task', () => {
      const updatedTask = {
        name: 'Updated Task',
        description: 'Updated Description',
        dueDate: new Date('2024-12-31'),
        priorityId: 2,
        statusId: 2,
        assigneeId: 2
      };

      const updatedMockTask = { ...mockTask, ...updatedTask };
      apiService.patch.and.returnValue(of(updatedMockTask));

      service.patchTask(1, updatedTask).subscribe(response => {
        expect(response).toEqual(updatedMockTask);
        expect(apiService.patch).toHaveBeenCalledWith('/tasks/1', updatedTask);
      });
    });

    it('should handle update error', () => {
      const updatedTask = {
        name: 'Updated Task',
        description: 'Updated Description'
      };

      apiService.patch.and.returnValue(throwError(() => new Error('Update failed')));

      service.patchTask(1, updatedTask).subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        error: (error) => {
          expect(error.message).toBe('Update failed');
        }
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', () => {
      const deleteResponse = { message: 'Task deleted successfully' };
      apiService.delete.and.returnValue(of(deleteResponse));

      service.deleteTask(1).subscribe(response => {
        expect(response).toBeTruthy();
        expect(apiService.delete).toHaveBeenCalledWith('/tasks/1');
      });
    });

    it('should handle deletion error', () => {
      apiService.delete.and.returnValue(throwError(() => new Error('Deletion failed')));

      service.deleteTask(1).subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        error: (error) => {
          expect(error.message).toBe('Deletion failed');
        }
      });
    });
  });

  describe('signals', () => {
    it('should initialize with null values', () => {
      expect(service.deletedTask()).toBeNull();
      expect(service.postedTask()).toBeNull();
      expect(service.patchedTask()).toBeNull();
    });
  });
});
