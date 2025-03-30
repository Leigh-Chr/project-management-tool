import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../shared/components/toast/toast.service';
import { InputFieldComponent } from '../../shared/components/ui/input-field.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'pmt-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    RouterModule,
  ],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <div class="card">
        <h1 class="title">Register</h1>
        <form
          [formGroup]="registerForm()"
          (ngSubmit)="onSubmit()"
          class="form"
          novalidate
        >
          <ui-input-field
            [control]="usernameControl()"
            label="Username"
            type="text"
            [errorMessage]="usernameControl().errors?.['required'] ? 'Username is required' : ''"
            [required]="true"
            autocomplete="username"
          />

          <ui-input-field
            [control]="emailControl()"
            label="Email"
            type="email"
            [errorMessage]="emailControl().errors?.['required'] ? 'Email is required' : ''"
            [required]="true"
            autocomplete="email"
          />

          <ui-input-field
            [control]="passwordControl()"
            label="Password"
            type="password"
            [errorMessage]="
              passwordControl().errors?.['minlength']
                ? 'Password must be at least 8 characters long
'
                : '' +
                  passwordControl().errors?.['required']
                    ? 'Password is required
'
                    : ''
            "
            [required]="true"
            autocomplete="new-password"
          />

          <ui-input-field
            [control]="confirmPasswordControl()"
            label="Confirm Password"
            type="password"
            [errorMessage]="
              confirmPasswordControl().errors?.['mismatch']
                ? 'Passwords do not match
'
                : '' +
                  confirmPasswordControl().errors?.['required']
                    ? 'Please confirm your password
'
                    : ''
            "
            [required]="true"
            autocomplete="new-password"
          />

          <div class="flex flex-col gap-2">
            <button
              class="btn btn--primary"
              type="submit"
              [disabled]="registerForm().invalid"
              [class.btn--disabled]="registerForm().invalid"
            >
              Register
            </button>
            <p class="text">
              Already have an account?
              <a routerLink="/login" class="link"> Login </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly matchValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const source = 'password';
    const target = 'confirmPassword';
    const sourceCtrl = control.get(source);
    const targetCtrl = control.get(target);
    return sourceCtrl?.value === targetCtrl?.value ? null : { mismatch: true };
  };

  readonly registerForm = signal<FormGroup>(
    this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValidator]],
    })
  );

  readonly usernameControl = computed(
    () => this.registerForm().get('username') as FormControl
  );
  readonly emailControl = computed(
    () => this.registerForm().get('email') as FormControl
  );
  readonly passwordControl = computed(
    () => this.registerForm().get('password') as FormControl
  );
  readonly confirmPasswordControl = computed(
    () => this.registerForm().get('confirmPassword') as FormControl
  );

  async onSubmit(): Promise<void> {
    if (this.registerForm().invalid) return;

    const { password, confirmPassword } = this.registerForm().value;
    if (password !== confirmPassword) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Passwords do not match',
        type: 'error',
      });
      return;
    }

    const res = await this.authService.register(this.registerForm().value);
    if (!res) {
      this.toastService.showToast({
        title: 'Success',
        message: 'Registration successful',
        type: 'success',
      });
      return;
    }

    this.router.navigate(['/login']);
  }
}
