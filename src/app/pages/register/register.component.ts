import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { InputFieldComponent } from '../../shared/components/ui/input-field.component';
import { RegisterRequest } from '../../shared/models/Auth/RegisterRequest';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';

@Component({
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    InputFieldComponent,
    RouterModule,
    TranslatorPipe,
    DefaultLayoutComponent,
  ],
  host: {
    class: 'grid h-screen place-items-center',
  },
  template: `
    <pmt-default-layout title="{{ 'register.title' | translate }}">
      <div
        class="shadow-md p-8 rounded-lg w-full max-w-md bg-neutral-50 dark:bg-neutral-900"
      >
        <h1 class="mb-6 font-semibold text-4xl text-center">
          {{ 'register.title' | translate }}
        </h1>
        <form (ngSubmit)="onSubmit()" [formGroup]="registerForm" novalidate>
          <ui-input-field
            [control]="username"
            id="username"
            [label]="'register.username' | translate"
            type="text"
            autocomplete="username"
            [errorMessage]="'register.usernameRequired' | translate"
          />
          <ui-input-field
            [control]="email"
            id="email"
            [label]="'register.email' | translate"
            type="email"
            autocomplete="email"
            [errorMessage]="'register.emailRequired' | translate"
          />
          <ui-input-field
            [control]="password"
            id="password"
            [label]="'register.password' | translate"
            type="password"
            autocomplete="new-password"
            [errorMessage]="'register.passwordRequired' | translate"
          />

          <div class="mt-6">
            <ui-button
              class="w-full"
              type="submit"
              [disabled]="registerForm.invalid"
              [label]="'register.submit' | translate"
            ></ui-button>
          </div>
        </form>
        <div class="mt-4 text-center">
          <a
            routerLink="/login"
            class="text-sm text-indigo-500 hover:underline cursor-pointer"
          >
            {{ 'register.loginLink' | translate }}
          </a>
        </div>
      </div>
    </pmt-default-layout>
  `,
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
    const registerRequest: RegisterRequest = this.registerForm
      .value as RegisterRequest;
    this.authService.register(registerRequest);
    this.router.navigate(['/login']);
  }
}
