import { signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ProjectService } from '../../services/data/project.service';
import { RoleService } from '../../services/data/role.service';
import { UserService } from '../../services/data/user.service';
import { ToastService } from '../toast/toast.service';
import { AddProjectMemberPopupComponent } from './add-project-members-popup.component';

describe('AddProjectMemberPopupComponent', () => {
  let component: AddProjectMemberPopupComponent;
  let fixture: ComponentFixture<AddProjectMemberPopupComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let userService: jasmine.SpyObj<UserService>;
  let roleService: jasmine.SpyObj<RoleService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockProject = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    status: 'To Do',
    myRole: 'Admin'
  };

  const mockUsers = [
    { id: 1, username: 'user1', email: 'user1@test.com' },
    { id: 2, username: 'user2', email: 'user2@test.com' }
  ];

  const mockRoles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Member' }
  ];

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['getProject', 'postProjectMember'], {
      postedProjectMember: signal(null)
    });
    const userSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    const roleSpy = jasmine.createSpyObj('RoleService', ['getRoles']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    projectSpy.getProject.and.returnValue(of(mockProject));
    userSpy.getUsers.and.returnValue(of(mockUsers));
    roleSpy.getRoles.and.returnValue(of(mockRoles));

    await TestBed.configureTestingModule({
      imports: [AddProjectMemberPopupComponent, ReactiveFormsModule],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: UserService, useValue: userSpy },
        { provide: RoleService, useValue: roleSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectMemberPopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
  });

  it('should create and initialize with project data', () => {
    expect(component).toBeTruthy();
    expect(component.project()).toEqual(mockProject);
  });

  it('should load user and role options', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(roleService.getRoles).toHaveBeenCalled();
    expect(component.userOptions().length).toBe(2);
    expect(component.roleOptions().length).toBe(2);
  });

  it('should not submit if form is invalid', () => {
    component.addMember();
    expect(projectService.postProjectMember).not.toHaveBeenCalled();
  });

  it('should add member and close popup on success', fakeAsync(() => {
    component.userControl.setValue('1');
    component.roleControl.setValue('2');

    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    component.addMember();
    expect(projectService.postProjectMember).toHaveBeenCalledWith(1, 1, 2);

    projectService.postedProjectMember.set({
      id: 1,
      project: 'Test Project',
      username: 'user1',
      email: 'user1@test.com',
      role: 'Member'
    });
    tick();
    fixture.detectChanges();

    expect(closeSpy).toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith({
      title: 'Success',
      message: 'Member added',
      type: 'success'
    });
  }));

  it('should not close popup when member addition fails', fakeAsync(() => {
    component.userControl.setValue('1');
    component.roleControl.setValue('2');

    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    component.addMember();
    tick();
    fixture.detectChanges();

    expect(closeSpy).not.toHaveBeenCalled();
  }));
}); 