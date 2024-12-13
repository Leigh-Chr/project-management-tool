import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TasksPanelComponent } from '../../shared/components/panels/tasks-panel.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';

@Component({
  selector: 'pmt-tasks',
  imports: [DefaultLayoutComponent, TasksPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pmt-default-layout>
      <pmt-tasks-panel />
    </pmt-default-layout>
  `,
})
export class TasksComponent {}
