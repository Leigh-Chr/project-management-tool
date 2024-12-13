import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TasksPanelComponent } from '../../shared/components/panels/tasks-panel.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';

@Component({
  selector: 'pmt-tasks',
  imports: [DefaultLayoutComponent, TasksPanelComponent, TranslatorPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pmt-default-layout title="{{ 'tasks' | translate }}">
      <pmt-tasks-panel />
    </pmt-default-layout>
  `,
})
export class TasksComponent {}
