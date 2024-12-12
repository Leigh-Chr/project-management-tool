import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { ProjectsPanelComponent } from "../../shared/components/panels/projects-panel.component";
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';

@Component({
    imports: [
    
    DefaultLayoutComponent,
    ProjectsPanelComponent
],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <default-layout>
        <projects-panel/>
    </default-layout>
  `
})
export class ProjectsComponent {
}
