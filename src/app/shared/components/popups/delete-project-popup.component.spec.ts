import { signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Project } from '../../models/project.models';
import { ProjectService } from '../../services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { DeleteProjectPopupComponent } from './delete-project-popup.component';

describe('DeleteProjectPopupComponent', () => {
  let component: DeleteProjectPopupComponent;
  let fixture: ComponentFixture<DeleteProjectPopupComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    status: 'To Do',
    myRole: 'Admin'
  };

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['deleteProject', 'getProject'], {
      deletedProject: signal<number | null>(null)
    });
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    projectSpy.getProject.and.returnValue(of(mockProject));

    await TestBed.configureTestingModule({
      imports: [DeleteProjectPopupComponent],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProjectPopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.project()).toEqual(mockProject);
  });

  it('should delete project and close popup on success', fakeAsync(() => {
    projectService.deleteProject.and.returnValue(of(undefined));
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);
    
    component.deleteProject();
    expect(projectService.deleteProject).toHaveBeenCalledWith(1);
    
    projectService.deletedProject.set(1);
    tick();
    fixture.detectChanges();
    expect(closeSpy).toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Success',
      message: 'Project deleted',
      type: 'success'
    });
  }));

  it('should not close popup when project deletion fails', fakeAsync(() => {
    projectService.deleteProject.and.returnValue(of(undefined));
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);
    
    component.deleteProject();
    tick();
    fixture.detectChanges();
    
    expect(closeSpy).not.toHaveBeenCalled();
  }));
}); 