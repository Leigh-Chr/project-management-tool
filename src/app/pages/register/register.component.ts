import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { InputFieldComponent } from '../../shared/components/ui/input-field.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'pmt-register',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    InputFieldComponent,
    RouterModule,
  ],
  template: `
    <div class="register">
      <div class="register__card">
        <h1 class="register__title" id="register-title">Register</h1>
        <form 
          [formGroup]="registerForm" 
          (ngSubmit)="onSubmit()" 
          class="register__form"
          aria-labelledby="register-title"
        >
          <ui-input-field
            [control]="emailControl"
            label="Email"
            type="email"
            [errorMessage]="emailControl.errors?.['required'] ? 'Email is required' : ''"
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
            [errorMessage]="passwordControl.errors?.['required'] ? 'Password is required' : ''"
            [required]="true"
            autocomplete="new-password"
            aria-required="true"
            [attr.aria-invalid]="passwordControl.invalid"
            [attr.aria-describedby]="passwordControl.invalid ? 'password-error' : null"
          />

          <ui-input-field
            [control]="confirmPasswordControl"
            label="Confirm Password"
            type="password"
            [errorMessage]="confirmPasswordControl.errors?.['required'] ? 'Please confirm your password' : ''"
            [required]="true"
            autocomplete="new-password"
            aria-required="true"
            [attr.aria-invalid]="confirmPasswordControl.invalid"
            [attr.aria-describedby]="confirmPasswordControl.invalid ? 'confirm-password-error' : null"
          />

          <small 
            class="register__error" 
            *ngIf="error"
            role="alert"
            id="register-error"
          >
            {{ error }}
          </small>

          <ui-button
            [label]="'Register'"
            [disabled]="registerForm.invalid"
            class="register__button"
            type="submit"
            aria-label="Create new account"
          />
        </form>

        <div class="register__footer">
          <p class="register__text">
            Already have an account?
            <a 
              routerLink="/login" 
              class="register__link"
              aria-label="Go to login page"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: var(--space-4);
      background-color: var(--surface-1);
    }

    .register__card {
      width: 100%;
      max-width: 28rem;
      padding: var(--space-8);
      background-color: var(--surface-2);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
    }

    .register__title {
      margin-bottom: var(--space-6);
      font-size: var(--font-size-4xl);
      font-weight: 600;
      text-align: center;
      color: var(--text-color);
    }

    .register__form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .register__error {
      font-size: var(--font-size-xs);
      color: var(--danger-color);
    }

    .register__button {
      width: 100%;
    }

    .register__footer {
      margin-top: var(--space-4);
      text-align: center;
    }

    .register__text {
      font-size: var(--font-size-sm);
      color: var(--text-color);
    }

    .register__link {
      color: var(--primary-color);
      text-decoration: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  `],
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;

  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    try {
      await this.authService.register(this.registerForm.value);
      this.router.navigate(['/login']);
      this.toastService.showToast({
        title: 'Success',
        message: 'Registration successful',
        type: 'success',
        duration: 5000
      }, 'root');
    } catch {
      this.error = 'Registration failed';
    }
  }
}
