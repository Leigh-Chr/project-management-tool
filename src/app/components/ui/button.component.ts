import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from './icon.component';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [NgClass, IconComponent, TooltipDirective],
  template: `
    @if (isLink) {
    <a
      attr.aria-label="{{ label }}"
      [href]="href"
      [attr.aria-disabled]="disabled"
      [ngClass]="buttonClasses"
      role="button"
    >
      @if (icon) {
      <ui-icon [class]="icon"></ui-icon>
      } @if (!iconOnly) {
      <span>{{ label }}</span>
      }
    </a>
    } @else {
    <button
      [tooltip]="iconOnly ? label : ''"
      attr.aria-label="{{ label }}"
      [disabled]="disabled"
      [ngClass]="buttonClasses"
      [attr.aria-disabled]="disabled"
    >
      @if (icon) {
      <ui-icon [class]="icon"></ui-icon>
      } @if (!iconOnly) {
      <span>{{ label }}</span>
      }
    </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input({
    required: true,
  })
  label!: string;

  @Input() iconOnly?: boolean;
  @Input() icon?: string;
  @Input() disabled?: boolean;
  @Input() isLink?: boolean;
  @Input() href?: string;
  @Input() variant?: 'primary' | 'secondary' | 'danger' | 'success';
  @Input() class?: string;

  get buttonClasses(): string {
    const baseClasses = `px-3 py-2 font-semibold rounded-md flex items-center justify-center gap-2 shadow-md transition-all duration-200 ease-in-out`;
    const stateClasses =
      'disabled:opacity-50 disabled:pointer-events-none enabled:hover:brightness-125';

    const variantClasses = {
      primary:
        'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white dark:from-indigo-700 dark:to-indigo-900 dark:text-neutral-200',
      secondary:
        'bg-gradient-to-br from-neutral-50 to-neutral-200 text-neutral-900 dark:from-neutral-700 dark:to-neutral-900 dark:text-neutral-200',
      danger:
        'bg-gradient-to-br from-red-500 to-red-700 text-white dark:from-red-700 dark:to-red-900 dark:text-neutral-200',
      success:
        'bg-gradient-to-br from-green-500 to-green-700 text-white dark:from-green-700 dark:to-green-900 dark:text-neutral-200',
    }[this.variant ?? 'primary'];

    return `${baseClasses} ${stateClasses} ${variantClasses} ${this.class}`;
  }
}
