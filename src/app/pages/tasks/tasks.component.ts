import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TasksPanelComponent } from '../../shared/components/panels/tasks-panel.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';

@Component({
  imports: [DefaultLayoutComponent, TasksPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <default-layout>
      <tasks-panel />
    </default-layout>
  `,
})
export class TasksComponent {}
