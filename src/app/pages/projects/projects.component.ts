import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectsPanelComponent } from '../../shared/components/panels/projects-panel.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';

@Component({
  selector: 'pmt-projects',
  imports: [DefaultLayoutComponent, ProjectsPanelComponent, TranslatorPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pmt-default-layout title="{{ 'projects' | translate }}">
      <pmt-projects-panel />
    </pmt-default-layout>
  `,
})
export class ProjectsComponent {}
