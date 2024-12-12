import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/ui/button.component';

@Component({
    imports: [ButtonComponent],
    template: `
    <div
      class="shadow-md p-8 rounded-lg w-full max-w-md bg-white dark:bg-neutral-900"
    >
      <h1 class="mb-6 font-bold text-4xl">
        Welcome to Project Management Tool
      </h1>
      <p
        class="mb-8 text-center text-lg text-neutral-600 dark:text-neutral-400"
      >
        Plan, track, and collaborate on projects efficiently.
      </p>
      <div class="flex space-x-4">
        <ui-button [isLink]="true" href="/register" label="Register" />
        <ui-button [isLink]="true" href="/login" label="Login" />
      </div>
    </div>
  `,
    host: { class: 'grid h-screen place-items-center' }
})
export class HomeComponent {}
