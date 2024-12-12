import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { InputFieldComponent } from '../../shared/components/ui/input-field.component';
import { LoginRequest } from '../../shared/models/Auth/LoginRequest';

@Component({
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    InputFieldComponent,
    RouterModule,
  ],
  host: {
    class: 'grid h-screen place-items-center',
  },
  template: `
    <div
      class="shadow-md p-8 rounded-lg w-full max-w-md bg-neutral-50 dark:bg-neutral-900"
    >
      <h1 class="mb-6 font-semibold text-4xl text-center">Sign In</h1>
      <form (ngSubmit)="onSubmit()" [formGroup]="loginForm" novalidate>
        <ui-input-field
          [control]="email"
          id="email"
          label="Email"
          type="email"
          errorMessage="A valid email is required."
        />
        <ui-input-field
          [control]="password"
          id="password"
          label="Password"
          type="password"
          errorMessage="Password is required."
        />

        @if (errorMessage) {
        <small class="text-xs">{{ errorMessage }}</small>
        }
        <div class="mt-6">
          <ui-button
            class="w-full"
            type="submit"
            [disabled]="loginForm.invalid"
            label="Submit"
          ></ui-button>
        </div>
      </form>
      <div class="mt-4 text-center">
        <a
          routerLink="/register"
          class="text-sm text-indigo-500 hover:underline cursor-pointer"
        >
          Don't have an account? Register here
        </a>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  email = this.loginForm.get('email') as FormControl<string>;
  password = this.loginForm.get('password') as FormControl<string>;
  errorMessage: string | null = null;

  constructor() {
    if (this.authService.authUser()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;
    const loginRequest = this.loginForm.value as LoginRequest;
    const isLoggedIn = !!this.authService.login(loginRequest);
    if (!isLoggedIn) {
      this.errorMessage = 'Invalid email or password';
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
