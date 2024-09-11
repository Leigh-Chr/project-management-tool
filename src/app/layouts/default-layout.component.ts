import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'default-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div
      class="
    grid grid-rows-[auto,1fr] min-h-screen"
    >
      <nav
        class="lg:flex items-center bg-neutral-50 dark:bg-neutral-950 px-8 py-4 justify-between sticky top-0 z-10"
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
                >Dashboard</a
              >
            </li>
            <li>
              <a
                class="hover:underline cursor-pointer"
                routerLink="/projects"
                routerLinkActive="text-indigo-500"
                >Projects</a
              >
            </li>
            <li>
              <a
                class="hover:underline cursor-pointer"
                routerLink="/tasks"
                routerLinkActive="text-indigo-500"
                >Tasks</a
              >
            </li>
          </ul>
        </div>
        <button>
          <i class="fi fi-br-user"></i>
        </button>
      </nav>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultLayoutComponent {}
