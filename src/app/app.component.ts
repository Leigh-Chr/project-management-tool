import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ToastProviderComponent } from './shared/components/toast/toast-provider.component';

@Component({
  selector: 'app-root',
  imports: [ToastProviderComponent, RouterOutlet, FormsModule],
  template: `
    <toast-provider providerId="root" />
    <router-outlet />
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
