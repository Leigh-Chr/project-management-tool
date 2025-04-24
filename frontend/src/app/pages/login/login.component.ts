import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
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
    InputFieldComponent,
  ],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <div class="card">
        <h1 class="title">Login</h1>
        <form
          [formGroup]="loginForm()"
          (ngSubmit)="onSubmit()"
          class="form"
          novalidate
        >
          <ui-input-field
            [control]="emailControl()"
            label="Email"
            type="email"
            [errorMessage]="emailControl().errors?.['required'] ? 'Email is required' : emailControl().errors?.['email'] ? 'Please enter a valid email address' : ''"
            [required]="true"
            autocomplete="email"
          />

          <ui-input-field
            [control]="passwordControl()"
            label="Password"
            type="password"
            [errorMessage]="passwordControl().errors?.['required'] ? 'Password is required' : passwordControl().errors?.['minlength'] ? 'Password must be at least 6 characters long' : ''"
            [required]="true"
            autocomplete="current-password"
          />

          <div class="flex flex-col gap-2">
            <button
              [disabled]="loginForm().invalid"
              [class.btn--disabled]="loginForm().invalid"
              class="btn btn--primary w-full"
              type="submit"
            >
              Login
            </button>

            <p>
              Don't have an account?
              <a routerLink="/register" class="link"> Register </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly loginForm = signal<FormGroup>(
    this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  );

  readonly emailControl = computed(
    () => this.loginForm().get('email') as FormControl
  );
  readonly passwordControl = computed(
    () => this.loginForm().get('password') as FormControl
  );

  async onSubmit(): Promise<void> {
    if (this.loginForm().invalid) {
      return;
    }

    const res = await this.authService.login(this.loginForm().value);
    if (!res) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Invalid email or password',
        type: 'error',
      });
      return;
    }

    this.router.navigate(['/']);
  }
}
