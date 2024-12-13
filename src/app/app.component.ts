import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ToastProviderComponent } from './shared/components/toast/toast-provider.component';
import { TranslatorPipe } from './shared/i18n/translator.pipe';

@Component({
  selector: 'pmt-root',
  providers: [TranslatorPipe],
  imports: [ToastProviderComponent, RouterOutlet, FormsModule],
  template: `
    <toast-provider providerId="root" />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
