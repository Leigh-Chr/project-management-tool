import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectsPanelComponent } from '../../shared/components/panels/projects-panel.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';

@Component({
  selector: 'pmt-projects',
  imports: [DefaultLayoutComponent, ProjectsPanelComponent, TranslatorPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="projects">
      <pmt-default-layout title="{{ 'projects' | translate }}">
        <main role="main">
          <pmt-projects-panel />
        </main>
      </pmt-default-layout>
    </div>
  `,
  styles: [`
    .projects {
      min-height: 100vh;
      display: grid;
      grid-template-rows: 1fr;
    }
  `],
})
export class ProjectsComponent {}
