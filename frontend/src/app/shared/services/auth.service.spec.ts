import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { LoginRequest, RegisterRequest } from '../models/auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;
  let cookieService: jasmine.SpyObj<CookieService>;

  const mockLoginResponse = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    token: 'mock-jwt-token',
    exp: Date.now() + 3600000 // 1 hour from now
  };

  const mockRegisterResponse = {
    id: 1,
    username: 'newuser',
    email: 'new@example.com',
    token: 'mock-jwt-token',
    exp: Date.now() + 3600000
  };

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['post']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const cookieSpy = jasmine.createSpyObj('CookieService', ['get', 'set', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
        { provide: CookieService, useValue: cookieSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      apiService.post.and.returnValue(of(mockLoginResponse));

      const result = await service.login(loginRequest);

      expect(result).toBeTruthy();
      expect(result?.email).toBe('test@example.com');
      expect(apiService.post).toHaveBeenCalledWith('/auth/login', loginRequest);
      expect(cookieService.set).toHaveBeenCalledWith('user', jasmine.any(String));
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle login failure', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      apiService.post.and.returnValue(throwError(() => new Error('Invalid credentials')));

      const result = await service.login(loginRequest);

      expect(result).toBeNull();
      expect(apiService.post).toHaveBeenCalledWith('/auth/login', loginRequest);
      expect(cookieService.set).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const registerRequest: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      apiService.post.and.returnValue(of(mockRegisterResponse));

      const result = await service.register(registerRequest);

      expect(result).toBeTruthy();
      expect(result?.email).toBe('new@example.com');
      expect(apiService.post).toHaveBeenCalledWith('/auth/register', registerRequest);
      expect(cookieService.set).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle registration failure', async () => {
      const registerRequest: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      apiService.post.and.returnValue(throwError(() => new Error('Email already exists')));

      const result = await service.register(registerRequest);

      expect(result).toBeNull();
      expect(apiService.post).toHaveBeenCalledWith('/auth/register', registerRequest);
      expect(cookieService.set).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      apiService.post.and.returnValue(of({}));
      service.logout();

      expect(apiService.post).toHaveBeenCalledWith('/auth/logout', {});
      expect(cookieService.delete).toHaveBeenCalledWith('user');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(service.authUser()).toBeNull();
    });
  });

  describe('authUser signal', () => {
    it('should be initialized as null', () => {
      expect(service.authUser()).toBeNull();
    });

    it('should be settable', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'mock-token',
        exp: Date.now() + 3600000
      };
      service.authUser.set(mockUser);
      expect(service.authUser()).toEqual(mockUser);
    });
  });
});
