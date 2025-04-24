import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output, OnDestroy,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'ui-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'popup',
  },
  template: `
    <div class="popup__overlay" role="dialog" [attr.aria-modal]="true">
      <div class="popup__content card flex flex-col gap-4">
        <h3>
          {{ popupTitle() }}
        </h3>
        <ng-content></ng-content>
        <div class="flex gap-2">
          <button class="btn btn--secondary" (click)="close()">
            {{ cancelLabel() }}
          </button>
          <button
            class="btn btn--primary"
            (click)="submit()"
            [disabled]="isSubmitDisabled()"
            [class.btn--disabled]="isSubmitDisabled()"
          >
            {{ submitLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .popup {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }

      .popup__overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .popup__content {
        position: relative;
        max-height: 90vh;
        max-width: 90vw;
        min-width: 30rem;
        overflow-y: auto;
      }

      .popup__button {
        margin-right: var(--space-2);
      }
    `,
  ],
})
export class PopupComponent implements OnDestroy {
  private readonly titleService = inject(Title);
  popupTitle = input.required<string>();
  isSubmitDisabled = input<boolean>(false);
  submitLabel = input<string>('Submit');
  cancelLabel = input<string>('Cancel');

  onClose = output<void>();
  onSubmit = output<void>();

  constructor() {
    effect(() => {
      if (this.popupTitle()) {
        const title = this.titleService.getTitle();
        this.titleService.setTitle(`${this.popupTitle()} - ${title}`);
      }
    });
  }

  ngOnDestroy(): void {
    const title = this.titleService.getTitle();
    const newTitle = title.replace(`${this.popupTitle()} - `, '');
    this.titleService.setTitle(newTitle);
  }

  close(): void {
    this.onClose.emit();
  }

  submit(): void {
    this.onSubmit.emit();
  }
}
