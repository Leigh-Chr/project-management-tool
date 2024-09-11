import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'ui-paginator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="
      flex items-center justify-center items-center gap-4
      bg-neutral-50 dark:bg-neutral-950
      px-4 py-2
    "
      aria-label="Pagination"
    >
      <button
        class="cursor-pointer"
        (click)="previousPage()"
        [disabled]="pageIndex === 0"
        aria-label="Previous Page"
      >
        <i class="fi fi-br-angle-left" aria-hidden="true"></i>
        <span class="sr-only">Previous Page</span>
      </button>
      <span aria-live="polite"
        >Page {{ pageIndex + 1 }} of {{ totalPages }}</span
      >
      <button
        class="cursor-pointer"
        (click)="nextPage()"
        [disabled]="pageIndex >= totalPages - 1"
        aria-label="Next Page"
      >
        <i class="fi fi-br-angle-right" aria-hidden="true"></i>
        <span class="sr-only">Next Page</span>
      </button>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  pageIndex = 0;
  totalPages = 0;

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.pageChange.emit(this.pageIndex);
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.pageChange.emit(this.pageIndex);
    }
  }
}
