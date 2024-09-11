import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="isLink; else buttonTemplate">
      <a
        [href]="href"
        [class.disabled]="disabled"
        class="
        bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md
        py-2 px-4 font-semibold rounded-md flex items-center justify-center gap-2 
        dark:from-indigo-700 dark:to-indigo-900 dark:text-gray-200
        disabled:opacity-50 disabled:pointer-events-none
        enabled:hover:brightness-125 transition-all duration-200 ease-in-out
        "
      >
        <ng-container *ngIf="icon">
          <i class="{{ icon }}"></i>
        </ng-container>
        {{ label }}
      </a>
    </ng-container>
    <ng-template #buttonTemplate>
      <button
        [disabled]="disabled"
        class="
        bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md
        py-2 px-4 font-semibold rounded-md flex items-center justify-center gap-2 
        dark:from-indigo-700 dark:to-indigo-900 dark:text-gray-200
        disabled:opacity-50 disabled:cursor-inherit
        enabled:hover:brightness-125 transition-all duration-200 ease-in-out
        "
      >
        <ng-container *ngIf="icon">
          <i class="{{ icon }}"></i>
        </ng-container>
        {{ label }}
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() disabled?: boolean;
  @Input() isLink = false;
  @Input() href?: string;
}
