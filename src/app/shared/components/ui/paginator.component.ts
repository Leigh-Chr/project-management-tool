import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Input,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'ui-paginator',
  imports: [NgClass],
  template: `
    <nav>
      <div class="flex justify-center">
        <div>
          <button
            class="paginator__button"
            (click)="previousPage()"
            [disabled]="pageIndex() === 1"
            [ngClass]="{ 'paginator__button--disabled': pageIndex() === 1 }"
          >
            <i class="fi fi-br-angle-left" aria-hidden="true"></i>
          </button>

          <span class="paginator__info" aria-live="polite">
            {{ pageIndex() }} / {{ totalPages() }}
          </span>

          <button
            class="paginator__button"
            (click)="nextPage()"
            [disabled]="pageIndex() >= totalPages()"
            [ngClass]="{
              'paginator__button--disabled': pageIndex() >= totalPages()
            }"
          >
            <i class="fi fi-br-angle-right" aria-hidden="true"></i>
          </button>
        </div>

        @if (showPageSizeSelector) {
        <div>
          <select
            [id]="uniqueId"
            [value]="pageSize()"
            (change)="onPageSizeChange($event)"
          >
            @for (size of pageSizeOptions(); track size) {
            <option [value]="size">
              {{ size }}
            </option>
            }
          </select>
        </div>
        }
      </div>

      @if (showTotalPages || showTotalItems) {
      <div class="paginator__summary">
        @if (showTotalItems) {
        <span>{{ totalItems() }}</span>
        } @if (showTotalPages) {
        <span>{{ totalPages() }}</span>
        }
      </div>
      }
    </nav>
  `,
  styles: [
    `
      .paginator__button {
        appearance: none;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  readonly totalItems = input.required<number>();
  readonly pageSizeOptions = input<number[]>([5, 10, 20, 50]);
  @Input() showTotalPages = false;
  @Input() showTotalItems = false;
  @Input() showPageSizeSelector = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageSize = signal(0);
  pageIndex = signal(1);

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize()))
  );

  uniqueId = `pageSizeSelect-${Math.random().toString(36).substring(2, 9)}`;

  constructor() {
    effect(() => {
      this.pageChange.emit(this.pageIndex());
    });

    effect(() => {
      this.pageSizeChange.emit(this.pageSize());
    });
  }

  ngOnInit(): void {
    this.pageSize.set(this.pageSizeOptions()[0]);
  }

  nextPage(): void {
    if (this.pageIndex() < this.totalPages()) {
      this.pageIndex.update((page) => page + 1);
    }
  }

  previousPage(): void {
    if (this.pageIndex() > 1) {
      this.pageIndex.update((page) => page - 1);
    }
  }

  onPageSizeChange(event: Event): void {
    const newSize = +(event.target as HTMLSelectElement).value;
    this.pageSize.set(newSize);
    this.pageIndex.set(1);
  }
}
