import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { InputFieldComponent } from '../../shared/components/ui/input-field.component';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pmt-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputFieldComponent
  ],
  template: `
    <div class="login">
      <div class="login__card">
        <h1 class="login__title" id="login-title">Login</h1>
        <form 
          [formGroup]="loginForm" 
          (ngSubmit)="onSubmit()" 
          class="login__form"
          novalidate
          aria-labelledby="login-title"
        >
          <ui-input-field
            [control]="emailControl"
            label="Email"
            type="email"
            [errorMessage]="emailControl.errors?.['required'] ? 'Email is required' : emailControl.errors?.['email'] ? 'Please enter a valid email address' : ''"
            [required]="true"
            autocomplete="email"
            aria-required="true"
            [attr.aria-invalid]="emailControl.invalid"
            [attr.aria-describedby]="emailControl.invalid ? 'email-error' : null"
          />

          <ui-input-field
            [control]="passwordControl"
            label="Password"
            type="password"
            [errorMessage]="passwordControl.errors?.['required'] ? 'Password is required' : passwordControl.errors?.['minlength'] ? 'Password must be at least 6 characters long' : ''"
            [required]="true"
            autocomplete="current-password"
            aria-required="true"
            [attr.aria-invalid]="passwordControl.invalid"
            [attr.aria-describedby]="passwordControl.invalid ? 'password-error' : null"
          />

          <small 
            class="login__error" 
            *ngIf="error"
            role="alert"
            id="login-error"
          >
            {{ error }}
          </small>

          <ui-button
            [label]="'Login'"
            [disabled]="loginForm.invalid"
            class="login__button"
            type="submit"
            aria-label="Sign in to your account"
          />
        </form>

        <div class="login__footer">
          <p class="login__text">
            Don't have an account?
            <a 
              routerLink="/register" 
              class="login__link"
              aria-label="Go to registration page"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: var(--space-4);
      background-color: var(--surface-1);
    }

    .login__card {
      width: 100%;
      max-width: 400px;
      padding: var(--space-6);
      background-color: var(--surface-2);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
    }

    .login__title {
      margin-bottom: var(--space-6);
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-color);
      text-align: center;
    }

    .login__form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .login__error {
      color: var(--danger-color);
      font-size: var(--font-size-sm);
    }

    .login__button {
      margin-top: var(--space-4);
    }

    .login__footer {
      margin-top: var(--space-6);
      text-align: center;
    }

    .login__text {
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
    }

    .login__link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }

      &:focus-visible {
        outline: var(--outline-size) var(--outline-style) var(--outline-color);
        outline-offset: var(--focus-ring-offset);
      }
    }
  `],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['/']);
      this.toastService.showToast(
        {
          type: 'success',
          title: 'Success',
          message: 'Login successful',
          duration: 3000,
        },
        'root'
      );
    } catch (err) {
      this.error = 'Invalid email or password';
      console.error('Login error:', err);
    }
  }
}
