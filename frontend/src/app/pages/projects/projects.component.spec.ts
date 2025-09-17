import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProjectsComponent } from './projects.component';
import { ProjectService } from '@app/shared/services/data/project.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let router: Router;

  beforeEach(async () => {
    const mockProjects = [
      { id: 1, name: 'Project 1', status: 'Active' },
      { id: 2, name: 'Project 2', status: 'Completed' },
    ];

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent, HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: ProjectService,
          useValue: {
            getProjects: jasmine
              .createSpy('getProjects')
              .and.returnValue(of(mockProjects)),
            deletedProject: signal(null),
            postedProject: signal(null),
            deletedProjectMember: signal(null),
            postedProjectMember: signal(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize projects', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.projects()).toEqual([
      { id: 1, name: 'Project 1', status: 'Active' },
      { id: 2, name: 'Project 2', status: 'Completed' },
    ]);
  }));

  it('should navigate to project details', () => {
    const projectId = 1;
    component.goToProject(projectId);
    expect(router.navigate).toHaveBeenCalledWith(['/projects', projectId]);
  });

  it('should show add project popup', () => {
    component.showPopup('addProject');
    expect(component.activePopup()).toBe('addProject');
  });

  it('should show delete project popup', () => {
    const projectId = 1;
    component.showPopup('deleteProject', projectId);
    expect(component.activePopup()).toBe('deleteProject');
    expect(component.activeProjectId()).toBe(projectId);
  });

  it('should hide popup', () => {
    component.showPopup('addProject');
    component.hidePopup();
    expect(component.activePopup()).toBeNull();
    expect(component.activeProjectId()).toBeNull();
  });
});
