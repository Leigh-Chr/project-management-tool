import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddProjectPopupComponent } from './add-project-popup.component';
import { ProjectService } from '../../services/data/project.service';
import { StatusService } from '../../services/data/status.service';
import { ToastService } from '../toast/toast.service';
import { of } from 'rxjs';

describe('AddProjectPopupComponent', () => {
  let component: AddProjectPopupComponent;
  let fixture: ComponentFixture<AddProjectPopupComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let statusService: jasmine.SpyObj<StatusService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockStatuses = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Completed' }
  ];

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['postProject']);
    projectSpy.postedProject = jasmine.createSpy('postedProject').and.returnValue(null);
    projectSpy.postedProject.set = jasmine.createSpy('set');
    const statusSpy = jasmine.createSpyObj('StatusService', ['getStatuses']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    statusSpy.getStatuses.and.returnValue(of(mockStatuses));

    await TestBed.configureTestingModule({
      imports: [AddProjectPopupComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: StatusService, useValue: statusSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProjectPopupComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    statusService = TestBed.inject(StatusService) as jasmine.SpyObj<StatusService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    fixture.detectChanges();
    
    const form = component.projectForm;
    expect(form.get('name')).toBeTruthy();
    expect(form.get('description')).toBeTruthy();
    expect(form.get('startDate')).toBeTruthy();
    expect(form.get('status')).toBeTruthy();
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    
    const form = component.projectForm;
    expect(form.invalid).toBe(true);
    
    form.patchValue({
      name: 'Test Project',
      description: 'Test Description',
      startDate: '2024-01-01',
      status: '1'
    });
    
    expect(form.valid).toBe(true);
  });

  it('should call postProject when form is submitted', () => {
    fixture.detectChanges();
    
    const mockResponse = { 
      id: 1, 
      name: 'Test Project',
      description: 'Test Description',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Active'
    };
    projectService.postProject.and.returnValue(of(mockResponse));
    
    component.projectForm.patchValue({
      name: 'Test Project',
      description: 'Test Description',
      startDate: '2024-01-01',
      status: '1'
    });
    
    component.submit();
    
    expect(projectService.postProject).toHaveBeenCalled();
  });

  it('should emit onClose when close is triggered', () => {
    spyOn(component.onClose, 'emit');
    component.onClose.emit();
    expect(component.onClose.emit).toHaveBeenCalled();
  });
});
