import { Component } from '@angular/core';
import { ProjectsPanelComponent } from '../../shared/components/panels/projects-panel.component';
import { TaskHistoryPanelComponent } from '../../shared/components/panels/task-history-panel.component';
import { TasksPanelComponent } from '../../shared/components/panels/tasks-panel.component';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';

@Component({
  selector: 'pmt-dashboard',
  imports: [
    DefaultLayoutComponent,
    ProjectsPanelComponent,
    TasksPanelComponent,
    TaskHistoryPanelComponent,
    TranslatorPipe,
  ],
  template: `
    <pmt-default-layout title="{{ 'dashboard' | translate }}">
      <div class="gap-2 grid lg:grid-cols-[2fr,1fr] p-2 h-full">
        <div class="gap-2 grid lg:grid-cols-1">
          <pmt-projects-panel [assignedOnly]="true" />
          <pmt-tasks-panel [assignedOnly]="true" />
        </div>
        <pmt-task-histories-panel />
      </div>
    </pmt-default-layout>
  `,
})
export class DashboardComponent {}
