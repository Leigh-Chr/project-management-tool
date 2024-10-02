import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [NgClass],
  template: `
    @if ( isLink ) {

    <a [href]="href" [class.disabled]="disabled" [ngClass]="buttonClasses">
      @if (icon) {
      <i class="{{ icon }}"></i>
      }
      <span>
        {{ label }}
      </span>
    </a>
    } @else {
    <button [disabled]="disabled" [ngClass]="buttonClasses">
      @if (icon) {
      <i class="{{ icon }}"></i>
      }
      <span>
        {{ label }}
      </span>
    </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() disabled?: boolean;
  @Input() isLink = false;
  @Input() href?: string;
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';

  get buttonClasses(): string {
    const baseClasses =
      'py-2 px-4 font-semibold rounded-md flex items-center justify-center gap-2 shadow-md transition-all duration-200 ease-in-out';
    const stateClasses =
      'disabled:opacity-50 disabled:pointer-events-none enabled:hover:brightness-125';

    const variantClasses = {
      primary:
        'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white dark:from-indigo-700 dark:to-indigo-900 dark:text-gray-200',
      secondary:
        'bg-gradient-to-br from-gray-500 to-gray-700 text-white dark:from-gray-700 dark:to-gray-900 dark:text-gray-200',
      success:
        'bg-gradient-to-br from-green-500 to-green-700 text-white dark:from-green-700 dark:to-green-900 dark:text-gray-200',
      danger:
        'bg-gradient-to-br from-red-500 to-red-700 text-white dark:from-red-700 dark:to-red-900 dark:text-gray-200',
    }[this.variant];

    return `${baseClasses} ${stateClasses} ${variantClasses}`;
  }
}
