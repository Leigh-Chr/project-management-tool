import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'pmt-default-layout',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col p-4 gap-4">
      @if (user(); as user) {
      <nav class="card rounded elevation p-4 w-full flex justify-between">
        <h1>
          <a [routerLink]="['/']" class="link">Project Management Tool</a>
        </h1>

        <div class="flex items-center gap-4">
          <span class="flex items-center gap-2">
            <i class="fi fi-br-user"></i>
            <span>{{ user.username }}</span>
          </span>
          <button class="btn btn--danger" (click)="logout()">
            <span>Logout</span>
            <i class="fi fi-br-exit"></i>
          </button>
        </div>
      </nav>
      }
      <main class="w-full h-full">
        <ng-content />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultLayoutComponent {
  private readonly titleService = inject(Title);
  private readonly authService = inject(AuthService);
  readonly user = this.authService.authUser;
  readonly pageTitle = input.required<string>();

  constructor() {
    effect(() => {
      const title = this.titleService.getTitle();
      this.titleService.setTitle(`${this.pageTitle()} - ${title}`);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
