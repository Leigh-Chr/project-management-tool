import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { IconComponent } from './icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

@Component({
  selector: 'ui-button',
  imports: [NgClass, IconComponent, TooltipDirective],
  template: `
    @if (isLink) {
    <a
      [href]="href"
      [attr.aria-disabled]="disabled"
      [attr.aria-label]="label"
      [attr.aria-expanded]="expanded"
      [attr.aria-controls]="controls"
      [attr.aria-pressed]="pressed"
      [ngClass]="buttonClasses"
      role="button"
      [tabindex]="disabled ? -1 : 0"
    >
      @if (icon) {
      <ui-icon [class]="icon" aria-hidden="true"></ui-icon>
      } @if (!iconOnly) {
      <span>{{ label }}</span>
      }
    </a>
    } @else {
    <button
      [tooltip]="iconOnly ? label : ''"
      [attr.aria-label]="label"
      [attr.aria-expanded]="expanded"
      [attr.aria-controls]="controls"
      [attr.aria-pressed]="pressed"
      [disabled]="disabled"
      [ngClass]="buttonClasses"
      [attr.aria-disabled]="disabled"
      [tabindex]="disabled ? -1 : 0"
    >
      @if (icon) {
      <ui-icon [class]="icon" aria-hidden="true"></ui-icon>
      } @if (!iconOnly) {
      <span>{{ label }}</span>
      }
    </button>
    }
  `,
  styles: [`
    .button {
      padding: var(--space-3) var(--space-2);
      font-weight: 600;
      border: none;
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      box-shadow: var(--shadow-md);
      transition: all var(--transition-normal);
    }

    .button--primary {
      background: linear-gradient(to bottom right, var(--primary-color), var(--primary-active));
      color: var(--light-color);
    }

    .button--secondary {
      background: linear-gradient(to bottom right, var(--surface-2), var(--surface-3));
      color: var(--text-color);
    }

    .button--danger {
      background: linear-gradient(to bottom right, var(--danger-color), var(--danger-active));
      color: var(--light-color);
    }

    .button--success {
      background: linear-gradient(to bottom right, var(--success-color), var(--success-active));
      color: var(--light-color);
    }

    .button:disabled {
      opacity: var(--disabled-opacity);
      pointer-events: none;
    }

    .button:not(:disabled):hover {
      filter: brightness(var(--hover-brightness));
    }

    .button:not(:disabled):active {
      filter: brightness(var(--active-brightness));
    }

    .button:focus-visible {
      outline: var(--outline-size) var(--outline-style) var(--outline-color);
      outline-offset: var(--focus-ring-offset);
    }
  `],
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
  @Input() variant?: ButtonVariant;
  @Input() class?: string;
  @Input() expanded?: boolean;
  @Input() controls?: string;
  @Input() pressed?: boolean;

  get buttonClasses(): string {
    const baseClass = 'button';
    const variantClass = `button--${this.variant ?? 'primary'}`;
    return `${baseClass} ${variantClass} ${this.class}`;
  }
}
