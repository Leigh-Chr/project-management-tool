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
    <nav
      class="
      flex flex-col items-center
      bg-neutral-50 dark:bg-neutral-950
      px-4 py-2
      w-full
    "
      aria-label="Pagination"
    >
      <div
        class="flex justify-center items-center gap-4 flex-wrap"
        style="width: 100%"
      >
        <div class="flex justify-center items-center gap-4">
          <button
            class="cursor-pointer"
            (click)="previousPage()"
            [disabled]="pageIndex() === 1"
            [ngClass]="{ 'opacity-50': pageIndex() === 1 }"
            aria-label="Previous Page"
          >
            <i class="fi fi-br-angle-left" aria-hidden="true"></i>
            <span class="sr-only">Previous Page</span>
          </button>

          <span aria-live="polite"
            >Page {{ pageIndex() }} of {{ totalPages() }}</span
          >

          <button
            class="cursor-pointer"
            (click)="nextPage()"
            [disabled]="pageIndex() >= totalPages()"
            [ngClass]="{ 'opacity-50': pageIndex() >= totalPages() }"
            aria-label="Next Page"
          >
            <i class="fi fi-br-angle-right" aria-hidden="true"></i>
            <span class="sr-only">Next Page</span>
          </button>
        </div>

        @if (showPageSizeSelector) {
        <div class="page-size-selector flex items-center gap-2">
          <label
            [for]="uniqueId"
            class="text-sm text-neutral-600 dark:text-neutral-400"
            >Items per page:</label
          >
          <select
            [id]="uniqueId"
            [value]="pageSize()"
            (change)="onPageSizeChange($event)"
            class="border rounded px-2 py-1
            bg-neutral-100 dark:bg-neutral-800
            border-neutral-200 dark:border-neutral-700
            text-sm text-neutral-700 dark:text-neutral-300"
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
      <div class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
        @if (showTotalItems) {
        <span> Total items: {{ totalItems() }} </span>
        } @if (showTotalPages) {
        <span class="ml-4"> Total pages: {{ totalPages() }} </span>
        }
      </div>
      }
    </nav>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
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
