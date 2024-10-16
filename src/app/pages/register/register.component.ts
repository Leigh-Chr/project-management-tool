import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterParams } from '../../services/auth.service';
import { ButtonComponent } from '../../components/ui/button.component';
import { InputFieldComponent } from '../../components/ui/input-field.component';

@Component({
  imports: [ButtonComponent, ReactiveFormsModule, InputFieldComponent],
  host: {
    class: 'grid h-screen place-items-center',
  },
  template: `
    <div
      class="shadow-md p-8 rounded-lg w-full max-w-md bg-neutral-50 dark:bg-neutral-900"
    >
      <h1 class="mb-6 font-semibold text-4xl text-center">Sign Up</h1>
      <form (ngSubmit)="onSubmit()" [formGroup]="registerForm" novalidate>
        <ui-input-field
          [control]="username"
          id="username"
          label="Username"
          type="text"
          autocomplete="username"
          errorMessage="Username is required."
        />
        <ui-input-field
          [control]="email"
          id="email"
          label="Email"
          type="email"
          autocomplete="email"
          errorMessage="A valid email is required."
        />
        <ui-input-field
          [control]="password"
          id="password"
          label="Password"
          type="password"
          autocomplete="new-password"
          errorMessage="Password must be at least 8 characters long."
        />

        <div class="mt-6">
          <ui-button
            type="submit"
            [disabled]="registerForm.invalid"
            label="Sign Up"
          ></ui-button>
        </div>
      </form>
    </div>
  `,
  standalone: true,
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  registerForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  username = this.registerForm.get('username') as FormControl<string>;
  email = this.registerForm.get('email') as FormControl<string>;
  password = this.registerForm.get('password') as FormControl<string>;

  onSubmit(): void {
    if (!this.registerForm.valid) return;
    const registerParams: RegisterParams = this.registerForm.value;
    this.authService.register(registerParams);
    this.router.navigate(['/login']);
  }
}
