import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ToastProviderComponent } from './shared/components/toast/toast-provider.component';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'pmt-root',
  imports: [ToastProviderComponent, RouterOutlet, FormsModule],
  template: `
    <pmt-toast-provider providerId="root" />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly meta = inject(Meta).addTag({
    name: 'description',
    content: 'Project Management Tool',
  });
}
