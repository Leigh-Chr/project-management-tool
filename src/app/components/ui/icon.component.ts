import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-icon',
  template: `
    <i
      class="{{ class }}
      grid content-center h-[1.5em]
      "
    ></i>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input({ required: true }) class!: string;
}
