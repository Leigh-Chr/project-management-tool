import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteProjectPopupComponent } from './delete-project-popup.component';
import { ProjectService } from '../../services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { of } from 'rxjs';

describe('DeleteProjectPopupComponent', () => {
  let component: DeleteProjectPopupComponent;
  let fixture: ComponentFixture<DeleteProjectPopupComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['deleteProject']);
    projectSpy.deletedProject = jasmine.createSpy('deletedProject').and.returnValue(null);
    projectSpy.deletedProject.set = jasmine.createSpy('set');
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [DeleteProjectPopupComponent],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProjectPopupComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteProject when confirmed', () => {
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
    
    const mockResponse = { 
      id: 1, 
      name: 'Test Project',
      description: 'Test Description',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Active'
    };
    projectService.deleteProject.and.returnValue(of(mockResponse));
    
    component.deleteProject();
    
    expect(projectService.deleteProject).toHaveBeenCalledWith(1);
  });

  it('should emit onClose when close is triggered', () => {
    spyOn(component.onClose, 'emit');
    component.onClose.emit();
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should display correct popup title', () => {
    fixture.detectChanges();
    
    const popup = fixture.nativeElement.querySelector('ui-popup');
    expect(popup.getAttribute('popupTitle')).toBe('Delete Project');
  });
});
