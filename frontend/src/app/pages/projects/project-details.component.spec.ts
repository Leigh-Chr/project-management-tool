import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule, UrlTree } from '@angular/router';
import { ProjectDetailsComponent } from './project-details.component';
import { ProjectService } from '@app/shared/services/data/project.service';
import { TaskService } from '@app/shared/services/data/task.service';
import { AuthService } from '@app/shared/services/auth.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectDetailsComponent>;
  let router: Router;

  beforeEach(async () => {
    const mockProject = {
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      status: 'Active',
      startDate: new Date(),
      endDate: new Date(),
      projectMembers: [],
      tasks: [],
      myRole: 'Admin',
    };

    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent, RouterModule],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            events: of(),
            createUrlTree: (): UrlTree => ({} as UrlTree),
            serializeUrl: (): string => '',
            isActive: (): boolean => true,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '1' },
            },
          },
        },
        {
          provide: ProjectService,
          useValue: {
            getProjectDetails: jasmine
              .createSpy('getProjectDetails')
              .and.returnValue(of(mockProject)),
            deletedProject: signal(null),
            postedProject: signal(null),
            deletedProjectMember: signal(null),
            postedProjectMember: signal(null),
          },
        },
        {
          provide: TaskService,
          useValue: {
            postedTask: signal(null),
            deletedTask: signal(null),
          },
        },
        {
          provide: AuthService,
          useValue: {
            authUser: signal({ username: 'testuser' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize project details', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.project()).toBeTruthy();
    expect(component.project()?.name).toBe('Test Project');
  }));

  it('should navigate to task details', () => {
    const taskId = 1;
    component.goToTask(taskId);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks', taskId]);
  });

  it('should show add task popup', () => {
    component.showPopup('addTask', 1);
    expect(component.activePopup()).toBe('addTask');
    expect(component.activeId()).toBe(1);
  });

  it('should show delete task popup', () => {
    const taskId = 1;
    component.showPopup('deleteTask', taskId);
    expect(component.activePopup()).toBe('deleteTask');
    expect(component.activeId()).toBe(taskId);
  });

  it('should show add member popup', () => {
    component.showPopup('addMember', 1);
    expect(component.activePopup()).toBe('addMember');
    expect(component.activeId()).toBe(1);
  });

  it('should show delete member popup', () => {
    const memberId = 1;
    component.showPopup('deleteProjectMember', memberId);
    expect(component.activePopup()).toBe('deleteProjectMember');
    expect(component.activeId()).toBe(memberId);
  });

  it('should show delete project popup', () => {
    component.showPopup('deleteProject', 1);
    expect(component.activePopup()).toBe('deleteProject');
    expect(component.activeId()).toBe(1);
  });

  it('should hide popup', () => {
    component.showPopup('addTask', 1);
    component.hidePopup();
    expect(component.activePopup()).toBeNull();
    expect(component.activeId()).toBeNull();
  });
});
