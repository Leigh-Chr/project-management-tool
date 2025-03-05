import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-icon',
  template: `
    <i 
      class="icon {{ class }}" 
      [attr.aria-hidden]="true"
      role="img"
      [attr.aria-label]="ariaLabel"
    ></i>
  `,
  styles: [`
    .icon {
      display: grid;
      align-content: center;
      height: 1.5em;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input({ required: true }) class!: string;
  @Input() ariaLabel?: string;
}
