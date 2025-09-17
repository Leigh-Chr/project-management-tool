import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { DefaultLayoutComponent } from './default-layout.component';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core';

describe('DefaultLayoutComponent', () => {
  let component: DefaultLayoutComponent;
  let fixture: ComponentFixture<DefaultLayoutComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let titleService: jasmine.SpyObj<Title>;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    token: 'mock-token',
    exp: Date.now() + 3600000
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      authUser: signal(mockUser)
    });
    const titleSpy = jasmine.createSpyObj('Title', ['getTitle', 'setTitle']);
    titleSpy.getTitle.and.returnValue('Original Title');

    await TestBed.configureTestingModule({
      imports: [DefaultLayoutComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Title, useValue: titleSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultLayoutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    titleService = TestBed.inject(Title) as jasmine.SpyObj<Title>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information when user is logged in', () => {
    fixture.componentRef.setInput('pageTitle', 'Test Page');
    fixture.detectChanges();

    const usernameElement = fixture.nativeElement.querySelector('span span');
    expect(usernameElement.textContent.trim()).toBe('testuser');
  });

  it('should display navigation when user is logged in', () => {
    fixture.componentRef.setInput('pageTitle', 'Test Page');
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should call logout when logout button is clicked', () => {
    fixture.componentRef.setInput('pageTitle', 'Test Page');
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('.btn--danger');
    logoutButton.click();

    expect(authService.logout).toHaveBeenCalled();
  });

  it('should set page title when component initializes', () => {
    fixture.componentRef.setInput('pageTitle', 'Test Page');
    fixture.detectChanges();

    expect(titleService.setTitle).toHaveBeenCalledWith('Test Page - Original Title');
  });

  it('should display navigation when user is logged in', () => {
    fixture.componentRef.setInput('pageTitle', 'Test Page');
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should display logout button with correct icon', () => {
    fixture.componentRef.setInput('pageTitle', 'Test Page');
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('.btn--danger');
    const icon = logoutButton.querySelector('i');

    expect(logoutButton).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(icon.classList.contains('fi')).toBe(true);
    expect(icon.classList.contains('fi-br-exit')).toBe(true);
  });

  it('should display user icon', () => {
    fixture.componentRef.setInput('pageTitle', 'Test Page');
    fixture.detectChanges();

    const userIcon = fixture.nativeElement.querySelector('.fi-br-user');
    expect(userIcon).toBeTruthy();
  });
});
