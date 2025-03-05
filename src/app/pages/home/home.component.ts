import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/ui/button.component';

@Component({
  selector: 'pmt-home',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="home">
      <div class="home__card">
        <h1 class="home__title" id="home-title">Welcome to Project Management Tool</h1>
        <p class="home__description" aria-labelledby="home-title">
          Manage your projects efficiently with our powerful project management tool.
        </p>
        <ui-button
          [label]="'Get Started'"
          routerLink="/projects"
          class="home__button"
          aria-label="Go to projects page"
        />
      </div>
    </div>
  `,
  styles: [`
    .home {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: var(--space-4);
      background-color: var(--surface-1);
    }

    .home__card {
      width: 100%;
      max-width: 28rem;
      padding: var(--space-8);
      background-color: var(--surface-2);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
    }

    .home__title {
      margin-bottom: var(--space-6);
      font-size: var(--font-size-4xl);
      font-weight: 700;
      color: var(--text-color);
    }

    .home__description {
      margin-bottom: var(--space-8);
      font-size: var(--font-size-lg);
      text-align: center;
      color: var(--text-muted);
    }

    .home__button {
      width: 100%;
    }
  `],
})
export class HomeComponent {}
