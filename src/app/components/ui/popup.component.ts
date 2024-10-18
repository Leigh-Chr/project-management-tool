import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'ui-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center',
  },
  template: `
    <div
      class="rounded-lg bg-white dark:bg-neutral-800 p-4 shadow-lg w-full max-w-md"
    >
      <ng-content />
    </div>
  `,
})
export class PopupComponent {}
