import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'pmt-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <div class="card home-card flex flex-col gap-4">
        <h1 class="title">Welcome to Project Management Tool</h1>
        <p class="text">
          Manage your projects efficiently with our powerful project management
          tool.
        </p>
        <button class="btn btn--primary w-full" [routerLink]="['/login']">
          Get Started
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .home-card {
        max-width: 28rem;
      }
    `,
  ],
})
export class HomeComponent {}
