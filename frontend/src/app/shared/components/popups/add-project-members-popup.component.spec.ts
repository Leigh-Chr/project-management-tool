import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddProjectMemberPopupComponent } from './add-project-members-popup.component';
import { ProjectService } from '../../services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { of } from 'rxjs';

describe('AddProjectMemberPopupComponent', () => {
  let component: AddProjectMemberPopupComponent;
  let fixture: ComponentFixture<AddProjectMemberPopupComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['postProjectMember']);
    projectSpy.postedProjectMember = jasmine.createSpy('postedProjectMember').and.returnValue(null);
    projectSpy.postedProjectMember.set = jasmine.createSpy('set');
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [AddProjectMemberPopupComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProjectMemberPopupComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
    
    const form = component.memberForm;
    expect(form.get('user')).toBeTruthy();
    expect(form.get('role')).toBeTruthy();
  });

  it('should validate required fields', () => {
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
    
    const form = component.memberForm;
    expect(form.invalid).toBe(true);
    
    form.patchValue({
      user: 'testuser',
      role: 'Member'
    });
    
    expect(form.valid).toBe(true);
  });

  it('should call postProjectMember when form is submitted', () => {
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
    
    const mockResponse = { 
      id: 1, 
      username: 'testuser', 
      email: 'test@example.com', 
      role: 'Member',
      project: 'Test Project'
    };
    projectService.postProjectMember.and.returnValue(of(mockResponse));
    
    component.memberForm.patchValue({
      user: '1',
      role: '1'
    });
    
    component.addMember();
    
    expect(projectService.postProjectMember).toHaveBeenCalled();
  });

  it('should emit onClose when close is triggered', () => {
    spyOn(component.onClose, 'emit');
    component.onClose.emit();
    expect(component.onClose.emit).toHaveBeenCalled();
  });
});
