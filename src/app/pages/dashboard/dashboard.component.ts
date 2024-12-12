import { Component } from '@angular/core';
import { ProjectsPanelComponent } from '../../shared/components/panels/projects-panel.component';
import { TaskHistoriesPanelComponent } from '../../shared/components/panels/task-histories-panel.component';
import { TasksPanelComponent } from '../../shared/components/panels/tasks-panel.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';

@Component({
  imports: [
    DefaultLayoutComponent,
    ProjectsPanelComponent,
    TasksPanelComponent,
    TaskHistoriesPanelComponent,
  ],
  template: `
    <default-layout>
      <div class="gap-2 grid lg:grid-cols-[2fr,1fr] p-2 h-full">
        <div class="gap-2 grid lg:grid-cols-1">
          <projects-panel [assignedOnly]="true" />
          <tasks-panel [assignedOnly]="true" />
        </div>
        <task-histories-panel />
      </div>
    </default-layout>
  `,
})
export class DashboardComponent {}
