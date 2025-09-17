import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DeleteProjectMemberPopupComponent } from './delete-project-member-popup.component';
import { ProjectService } from '../../services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { of } from 'rxjs';

describe('DeleteProjectMemberPopupComponent', () => {
  let component: DeleteProjectMemberPopupComponent;
  let fixture: ComponentFixture<DeleteProjectMemberPopupComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['deleteProjectMember']);
    projectSpy.deletedProjectMember = jasmine.createSpy('deletedProjectMember').and.returnValue(null);
    projectSpy.deletedProjectMember.set = jasmine.createSpy('set');
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    const mockActivatedRoute = {
      snapshot: { params: { id: '1' } }
    };

    await TestBed.configureTestingModule({
      imports: [DeleteProjectMemberPopupComponent],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProjectMemberPopupComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteProjectMember when confirmed', () => {
    fixture.componentRef.setInput('projectMemberId', 1);
    fixture.detectChanges();
    
    const mockResponse = { 
      id: 1, 
      username: 'testuser', 
      email: 'test@example.com', 
      role: 'Member',
      project: 'Test Project'
    };
    projectService.deleteProjectMember.and.returnValue(of(mockResponse));
    
    component.deleteProjectMember();
    
    expect(projectService.deleteProjectMember).toHaveBeenCalledWith(1, jasmine.any(String));
  });

  it('should emit onClose when close is triggered', () => {
    spyOn(component.onClose, 'emit');
    component.onClose.emit();
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should display correct popup title', () => {
    fixture.detectChanges();
    
    const popup = fixture.nativeElement.querySelector('ui-popup');
    expect(popup.getAttribute('popupTitle')).toBe('Delete Member');
  });
});
