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
    <nav class="paginator" aria-label="Pagination">
      <div class="paginator__content">
        <div class="paginator__controls">
          <button
            class="paginator__button"
            (click)="previousPage()"
            [disabled]="pageIndex() === 1"
            [ngClass]="{ 'paginator__button--disabled': pageIndex() === 1 }"
            aria-label="Previous Page"
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
            [ngClass]="{ 'paginator__button--disabled': pageIndex() >= totalPages() }"
            aria-label="Next Page"
          >
            <i class="fi fi-br-angle-right" aria-hidden="true"></i>
          </button>
        </div>

        @if (showPageSizeSelector) {
        <div class="paginator__selector">
          <select
            [id]="uniqueId"
            [value]="pageSize()"
            (change)="onPageSizeChange($event)"
            class="paginator__select"
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
        <span class="paginator__summary-item">{{ totalPages() }}</span>
        }
      </div>
      }
    </nav>
  `,
  styles: [`
    .paginator {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--surface-2);
      padding: var(--space-2) var(--space-4);
      width: 100%;
    }

    .paginator__content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-4);
      flex-wrap: wrap;
      width: 100%;
    }

    .paginator__controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-4);
    }

    .paginator__button {
      cursor: pointer;
      background: none;
      border: none;
      color: var(--text-color);
      padding: var(--space-1);
      transition: opacity var(--transition-normal);

      &:hover:not(:disabled) {
        opacity: var(--hover-opacity);
      }

      &:disabled {
        opacity: var(--disabled-opacity);
        cursor: not-allowed;
      }
    }

    .paginator__info {
      font-size: var(--font-size-sm);
      color: var(--text-color);
    }

    .paginator__selector {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .paginator__select {
      padding: var(--space-1) var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-color);
      background-color: var(--surface-3);
      border: var(--input-border);
      border-radius: var(--border-radius-sm);
    }

    .paginator__summary {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      margin-top: var(--space-2);
    }

    .paginator__summary-item {
      margin-left: var(--space-4);
    }
  `],
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
