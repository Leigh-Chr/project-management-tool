import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ButtonComponent } from '../components/ui/button.component';
import { TranslatorPipe } from '../i18n/translator.pipe';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pmt-default-layout',
  imports: [ButtonComponent, TranslatorPipe, RouterLink],
  template: `
    <div class="layout">
      @if (user(); as user) {
        <nav class="nav" role="navigation" aria-label="Main navigation">
          <div class="nav__left">
            <h1 class="nav__title">
              <a [routerLink]="['/']" class="nav__link" aria-label="Home">Project Management Tool</a>
            </h1>
          </div>

          <div class="nav__right">
            <span class="nav__user">
              <i class="fi fi-br-user" aria-hidden="true"></i>
              <span>{{ user.username }}</span>
            </span>
            <ui-button
              [label]="'logout' | translate"
              icon="fi fi-br-exit"
              variant="danger"
              (click)="logout()"
              [attr.aria-label]="'logout' | translate"
            ></ui-button>
          </div>
        </nav>
      }
      <main class="layout__main" role="main">
        <ng-content />
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 100vh;
    }

    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      align-items: center;
      background-color: var(--surface-2);
      padding: var(--space-4) var(--space-8);
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
    }

    .nav__left {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .nav__right {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .nav__title {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      font-size: var(--font-size-2xl);
      font-weight: 700;
    }

    .nav__link {
      color: var(--text-color);
      text-decoration: none;
      transition: color var(--transition-normal);

      &:hover {
        color: var(--primary-color);
      }

      &:focus-visible {
        outline: var(--outline-size) var(--outline-style) var(--outline-color);
        outline-offset: var(--focus-ring-offset);
      }
    }

    .nav__user {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .layout__main {
      padding: var(--space-2);
    }
  `],
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
