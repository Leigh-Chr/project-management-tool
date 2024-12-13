import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ToastProviderComponent } from './shared/components/toast/toast-provider.component';
import { TranslatorPipe } from './shared/i18n/translator.pipe';
import { Meta } from '@angular/platform-browser';

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
export class AppComponent {
  private readonly translatorPipe = inject(TranslatorPipe);
  private readonly meta = inject(Meta).addTag({
    name: 'description',
    content: this.translatorPipe.transform('home.description'),
  });
}
