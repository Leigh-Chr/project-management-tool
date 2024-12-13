import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../components/ui/button.component';
import { TranslatorPipe } from '../i18n/translator.pipe';
import { AuthService } from '../services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pmt-default-layout',
  imports: [RouterLink, RouterLinkActive, ButtonComponent, TranslatorPipe],
  template: `
    <div
      class="
    grid grid-rows-[auto,1fr] min-h-screen"
    >
      @if (user(); as user) {
      <nav
        class="flex flex-wrap gap-2 items-center bg-neutral-50 dark:bg-neutral-950 px-8 py-4 justify-between sticky top-0 z-10"
      >
        <div class="flex items-center gap-4 lg:gap-20 flex-wrap">
          <h1 class="flex items-center gap-4 font-bold text-2xl">
            <i class="fi fi-br-tools"></i>
            Project Management Tool
          </h1>
          <ul class="flex items-center gap-4">
            <li>
              <a
                class="hover:underline cursor-pointer"
                routerLink="/dashboard"
                routerLinkActive="text-indigo-500"
                >{{ 'dashboard' | translate }}</a
              >
            </li>
            <li>
              <a
                class="hover:underline cursor-pointer"
                routerLink="/projects"
                routerLinkActive="text-indigo-500"
                >{{ 'projects' | translate }}</a
              >
            </li>
            <li>
              <a
                class="hover:underline cursor-pointer"
                routerLink="/tasks"
                routerLinkActive="text-indigo-500"
                >{{ 'tasks' | translate }}</a
              >
            </li>
          </ul>
        </div>

        <div class="flex items-center gap-4">
          <span class="flex items-center gap-2">
            <i class="fi fi-br-user"></i>
            <span>{{ user.username }}</span>
          </span>
          <ui-button
            label="{{ 'logout' | translate }}"
            icon="fi fi-br-exit"
            variant="danger"
            (click)="logout()"
          ></ui-button>
        </div>
      </nav>
      }
      <main class="p-2">
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
  readonly title = input.required<string>();

  constructor() {
    effect(() => {
      this.titleService.setTitle(this.title() + ' - Project Management Tool');
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
