import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { InputFieldComponent } from '../../shared/components/ui/input-field.component';
import { LoginRequest } from '../../shared/models/auth.models';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        InputFieldComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form and call login service', () => {
    const form = component.loginForm;
    form.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    } as LoginRequest);
  });

  it('should show error toast on failed login', async () => {
    authService.login.and.returnValue(Promise.resolve(null));
    const form = component.loginForm;
    form.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    await component.onSubmit();
    expect(toastService.showToast).toHaveBeenCalled();
  });
});
