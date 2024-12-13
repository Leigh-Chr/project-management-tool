import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectsPanelComponent } from '../../shared/components/panels/projects-panel.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';

@Component({
  selector: 'pmt-projects',
  imports: [DefaultLayoutComponent, ProjectsPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pmt-default-layout>
      <pmt-projects-panel />
    </pmt-default-layout>
  `,
})
export class ProjectsComponent {}
