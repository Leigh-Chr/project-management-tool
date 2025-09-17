import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProjectService } from './project.service';
import { ApiService } from '../api.service';
import { ToastService } from '../../components/toast/toast.service';
import { Project, ProjectMember } from '../../models/project.models';

describe('ProjectService', () => {
  let service: ProjectService;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'In Progress'
  };

  const mockProjectMember: ProjectMember = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'Admin',
    project: 'Test Project'
  };

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'delete']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        { provide: ApiService, useValue: apiSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    service = TestBed.inject(ProjectService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProjects', () => {
    it('should return projects from API', () => {
      const mockProjects = [mockProject];
      apiService.get.and.returnValue(of(mockProjects));

      service.getProjects().subscribe(response => {
        expect(response).toEqual(mockProjects);
        expect(apiService.get).toHaveBeenCalledWith('/projects');
      });
    });

    it('should handle API error', () => {
      apiService.get.and.returnValue(throwError(() => new Error('API Error')));

      service.getProjects().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('API Error');
        }
      });
    });
  });

  describe('getProject', () => {
    it('should return project details from API', () => {
      apiService.get.and.returnValue(of(mockProject));

      service.getProject(1).subscribe(response => {
        expect(response).toEqual(mockProject);
        expect(apiService.get).toHaveBeenCalledWith('/projects/1');
      });
    });
  });

  describe('postProject', () => {
    it('should create a new project', () => {
      const newProject = {
        name: 'New Project',
        description: 'New Description',
        startDate: new Date('2024-01-01'),
        statusId: 1
      };

      apiService.post.and.returnValue(of(mockProject));

      service.postProject(newProject).subscribe(response => {
        expect(response).toEqual(mockProject);
        expect(apiService.post).toHaveBeenCalledWith('/projects', newProject);
      });
    });

    it('should handle creation error', () => {
      const newProject = {
        name: 'New Project',
        description: 'New Description',
        startDate: new Date('2024-01-01'),
        statusId: 1
      };

      apiService.post.and.returnValue(throwError(() => new Error('Creation failed')));

      service.postProject(newProject).subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        error: (error) => {
          expect(error.message).toBe('Creation failed');
        }
      });
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', () => {
      const deleteResponse = { message: 'Project deleted successfully' };
      apiService.delete.and.returnValue(of(deleteResponse));

      service.deleteProject(1).subscribe(response => {
        expect(response).toBeTruthy();
        expect(apiService.delete).toHaveBeenCalledWith('/projects/1');
      });
    });

    it('should handle deletion error', () => {
      apiService.delete.and.returnValue(throwError(() => new Error('Deletion failed')));

      service.deleteProject(1).subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        error: (error) => {
          expect(error.message).toBe('Deletion failed');
        }
      });
    });
  });

  describe('getProjectMembers', () => {
    it('should return project members from API', () => {
      const mockMembers = [mockProjectMember];
      apiService.get.and.returnValue(of(mockMembers));

      service.getProjectMembers(1).subscribe(response => {
        expect(response).toBeTruthy();
        expect(apiService.get).toHaveBeenCalledWith('/projects/1/members');
      });
    });
  });

  describe('postProjectMember', () => {
    it('should add a new project member', () => {
      const memberData = {
        projectId: 1,
        userId: 2,
        roleId: 1
      };

      apiService.post.and.returnValue(of(mockProjectMember));

      service.postProjectMember(1, 2, 1).subscribe(response => {
        expect(response).toEqual(mockProjectMember);
        expect(apiService.post).toHaveBeenCalledWith('/projects/1/members', memberData);
      });
    });
  });

  describe('deleteProjectMember', () => {
    it('should remove a project member', () => {
      const deleteResponse = { message: 'Member removed successfully' };
      apiService.delete.and.returnValue(of(deleteResponse));

      service.deleteProjectMember(1, 1).subscribe(response => {
        expect(response).toBeTruthy();
        expect(apiService.delete).toHaveBeenCalledWith('/projects/1/members/1');
      });
    });
  });

  describe('signals', () => {
    it('should initialize with null values', () => {
      expect(service.deletedProject()).toBeNull();
      expect(service.postedProject()).toBeNull();
      expect(service.deletedProjectMember()).toBeNull();
      expect(service.postedProjectMember()).toBeNull();
    });
  });
});
