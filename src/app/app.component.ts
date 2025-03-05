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
    <div class="app">
      <pmt-toast-provider providerId="root" />
      <main role="main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: grid;
      grid-template-rows: 1fr;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly translatorPipe = inject(TranslatorPipe);
  private readonly meta = inject(Meta).addTag({
    name: 'description',
    content: 'Project Management Tool',
  });
}
