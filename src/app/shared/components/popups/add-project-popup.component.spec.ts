import { signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Project } from '../../models/project.models';
import { ProjectService } from '../../services/data/project.service';
import { StatusService } from '../../services/data/status.service';
import { ToastService } from '../toast/toast.service';
import { AddProjectPopupComponent } from './add-project-popup.component';

describe('AddProjectPopupComponent', () => {
  let component: AddProjectPopupComponent;
  let fixture: ComponentFixture<AddProjectPopupComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let statusService: jasmine.SpyObj<StatusService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['postProject'], {
      postedProject: signal(null)
    });
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    const statusSpy = jasmine.createSpyObj('StatusService', ['getStatuses']);

    statusSpy.getStatuses.and.returnValue(of([
      { id: 1, name: 'To Do' },
      { id: 2, name: 'In Progress' },
      { id: 3, name: 'Done' }
    ]));

    await TestBed.configureTestingModule({
      imports: [AddProjectPopupComponent, ReactiveFormsModule],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: StatusService, useValue: statusSpy }
      ]
    }).compileComponents();

    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    statusService = TestBed.inject(StatusService) as jasmine.SpyObj<StatusService>;

    fixture = TestBed.createComponent(AddProjectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize form controls', () => {
    expect(component).toBeTruthy();
    expect(component.name).toBeTruthy();
    expect(component.description).toBeTruthy();
    expect(component.startDate).toBeTruthy();
    expect(component.endDate).toBeTruthy();
    expect(component.status).toBeTruthy();
  });

  it('should load status options', () => {
    expect(statusService.getStatuses).toHaveBeenCalled();
    expect(component.statusOptions().length).toBe(3);
  });

  it('should not submit if form is invalid', () => {
    component.submit();
    expect(projectService.postProject).not.toHaveBeenCalled();
  });

  it('should submit if form is valid and close popup on success', fakeAsync(() => {
    const newProject = {
      name: 'Test Project',
      description: 'Test Description',
      startDate: new Date(),
      statusId: 1
    };

    component.name.setValue(newProject.name);
    component.description.setValue(newProject.description);
    component.startDate.setValue(newProject.startDate.toISOString().split('T')[0]);
    component.status.setValue(newProject.statusId.toString());

    const mockProject: Project = {
      id: 1,
      name: newProject.name,
      description: newProject.description,
      startDate: newProject.startDate,
      status: 'To Do',
      myRole: 'Member'
    };

    projectService.postProject.and.returnValue(of(undefined));
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    component.submit();
    expect(projectService.postProject).toHaveBeenCalledWith({
      name: newProject.name,
      description: newProject.description,
      startDate: jasmine.any(Date),
      endDate: undefined,
      statusId: newProject.statusId
    });
    
    projectService.postedProject.set(mockProject);
    tick();
    fixture.detectChanges();
    expect(closeSpy).toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Success',
      message: 'Project created',
      type: 'success'
    });
  }));

  it('should not close popup when project creation fails', fakeAsync(() => {
    projectService.postProject.and.returnValue(of(undefined));
    component.name.setValue('Test Project');
    component.description.setValue('Test Description');
    component.startDate.setValue(new Date().toISOString().split('T')[0]);
    component.status.setValue('1');
    
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);
    
    component.submit();
    tick();
    fixture.detectChanges();
    
    expect(closeSpy).not.toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Error',
      message: 'Failed to create project',
      type: 'error'
    });
  }));
}); 