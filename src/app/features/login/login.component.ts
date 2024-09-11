import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../ui/button.component';
import { InputFieldComponent } from '../../ui/input-field.component';

@Component({
  imports: [ButtonComponent, ReactiveFormsModule, InputFieldComponent],
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
            type="submit"
            [disabled]="loginForm.invalid"
            label="Submit"
          ></ui-button>
        </div>
      </form>
    </div>
  `,
  standalone: true,
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

  onSubmit(): void {
    if (!this.loginForm.valid) return;
    const loginParams = this.loginForm.value;
    const isLoggedIn = this.authService.login(loginParams);
    if (!isLoggedIn) {
      this.errorMessage = 'Invalid email or password';
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
