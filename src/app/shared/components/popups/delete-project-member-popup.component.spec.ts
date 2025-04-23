import { signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProjectMember } from '../../models/project.models';
import { ProjectService } from '../../services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { DeleteProjectMemberPopupComponent } from './delete-project-member-popup.component';

describe('DeleteProjectMemberPopupComponent', () => {
  let component: DeleteProjectMemberPopupComponent;
  let fixture: ComponentFixture<DeleteProjectMemberPopupComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockProjectMember: ProjectMember = {
    id: 1,
    project: 'Test Project',
    username: 'testuser',
    email: 'test@example.com',
    role: 'Member'
  };

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['deleteProjectMember', 'getProjectMember'], {
      deletedProjectMember: signal(null)
    });
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    projectSpy.getProjectMember.and.returnValue(of(mockProjectMember));

    await TestBed.configureTestingModule({
      imports: [DeleteProjectMemberPopupComponent],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProjectMemberPopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projectMemberId', 1);
    fixture.detectChanges();
  });

  it('should create and initialize with project member data', () => {
    expect(component).toBeTruthy();
    expect(component.projectMember()).toEqual(mockProjectMember);
  });

  it('should delete project member and close popup on success', fakeAsync(() => {
    projectService.deleteProjectMember.and.returnValue(of(undefined));
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);
    
    component.deleteProjectMember();
    expect(projectService.deleteProjectMember).toHaveBeenCalledWith(1);
    
    projectService.deletedProjectMember.set(mockProjectMember);
    tick();
    fixture.detectChanges();
    expect(closeSpy).toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Success',
      message: 'Project member deleted',
      type: 'success'
    });
  }));

  it('should not close popup when member deletion fails', fakeAsync(() => {
    projectService.deleteProjectMember.and.returnValue(of(undefined));
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);
    
    component.deleteProjectMember();
    tick();
    fixture.detectChanges();
    
    expect(closeSpy).not.toHaveBeenCalled();
  }));
}); 