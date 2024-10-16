import { Component } from '@angular/core';
import { DefaultLayoutComponent } from '../../layouts/default-layout.component';
import { PaginatorComponent } from '../../components/ui/paginator.component';
import { ProjectsPanelComponent } from './panels/projects-panel.component';
import { TaskHistoriesPanelComponent } from './panels/task-histories-panel.component';
import { TasksPanelComponent } from './panels/tasks-panel.component';

@Component({
  standalone: true,
  imports: [
    DefaultLayoutComponent,
    PaginatorComponent,
    ProjectsPanelComponent,
    TasksPanelComponent,
    TaskHistoriesPanelComponent,
  ],
  template: `
    <default-layout>
      <div class="gap-4 grid lg:grid-cols-[2fr,1fr] p-4 h-full">
        <div class="gap-4 grid lg:grid-cols-1">
          <projects-panel />
          <tasks-panel />
        </div>
        <task-histories-panel />
      </div>
    </default-layout>
  `,
})
export class DashboardComponent {}
