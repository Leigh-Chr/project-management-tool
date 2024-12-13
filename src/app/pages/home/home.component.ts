import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';

@Component({
  imports: [ButtonComponent, TranslatorPipe],
  template: `
    <div
      class="shadow-md p-8 rounded-lg w-full max-w-md bg-white dark:bg-neutral-900"
    >
      <h1 class="mb-6 font-bold text-4xl">
        {{ 'home.welcome' | translate }}
      </h1>
      <p
        class="mb-8 text-center text-lg text-neutral-600 dark:text-neutral-400"
      >
        {{ 'home.description' | translate }}
      </p>
      <div class="flex space-x-4">
        <ui-button
          [isLink]="true"
          href="/register"
          [label]="'home.register' | translate"
        />
        <ui-button
          [isLink]="true"
          href="/login"
          [label]="'home.login' | translate"
        />
      </div>
    </div>
  `,
  host: { class: 'grid h-screen place-items-center' },
})
export class HomeComponent {}
