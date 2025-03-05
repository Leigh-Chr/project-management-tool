import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  computed,
  input,
  signal,
} from '@angular/core';
import { PaginatorComponent } from './paginator.component';

export type ItemType = 'text' | 'date' | 'number';

export type TableColumn<Item> = {
  name: string;
  key: keyof Item;
  type: ItemType;
};

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [PaginatorComponent, NgTemplateOutlet],
  template: `
    <div class="table-container" role="region" aria-label="Data table">
      <table class="table" role="grid">
        <thead class="table__header">
          <tr>
            @for (column of columns; track $index) {
            <th class="table__header-cell" scope="col">
              {{ column.name }}
            </th>
            } @if (actionTemplate) {
            <th class="table__header-cell" scope="col">
              Actions
            </th>
            }
          </tr>
        </thead>
        <tbody class="table__body">
          @if (paginatedData().length === 0) {
          <tr>
            <td
              class="table__empty-cell"
              [attr.colspan]="columns.length + (actionTemplate ? 1 : 0)"
              role="alert"
            >
              No data available
            </td>
          </tr>
          } @else { @for (item of paginatedData(); track $index) {
          <tr class="table__row">
            @for (column of columns; track $index) {
            <td class="table__cell">
              {{ getCellValue(item, column) }}
            </td>
            } @if (actionTemplate) {
            <td class="table__cell">
              <ng-container
                *ngTemplateOutlet="actionTemplate; context: { $implicit: item }"
              ></ng-container>
            </td>
            }
          </tr>
          } }
        </tbody>
        <tfoot class="table__footer">
          <tr>
            <td [attr.colspan]="columns.length + (actionTemplate ? 1 : 0)">
              <ui-paginator
                [totalItems]="data().length"
                [pageSizeOptions]="pageSizeOptions"
                [showTotalPages]="showTotalPages"
                [showTotalItems]="showTotalItems"
                [showPageSizeSelector]="showPageSizeSelector"
                (pageChange)="onPageChange($event)"
                (pageSizeChange)="onPageSizeChange($event)"
              ></ui-paginator>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  `,
  styles: [`
    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table__header {
      background-color: var(--surface-2);
    }

    .table__header-cell {
      padding: var(--table-header-padding);
      text-align: left;
      font-size: var(--font-size-xs);
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table__body {
      background-color: var(--surface-1);
    }

    .table__row {
      &:hover {
        background-color: var(--table-hover-color);
      }
    }

    .table__cell {
      padding: var(--table-cell-padding);
      font-size: var(--font-size-sm);
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 20rem;
    }

    .table__empty-cell {
      padding: var(--table-cell-padding);
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }

    .table__footer {
      background-color: var(--surface-2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends Record<string, unknown>> {
  @Input() columns: TableColumn<T>[] = [];
  readonly data = input.required<T[]>();

  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() showTotalPages = false;
  @Input() showTotalItems = false;
  @Input() showPageSizeSelector = false;

  readonly pageSize = signal(0);
  readonly pageIndex = signal(1);

  readonly paginatedData = computed(() => {
    const startIndex = (this.pageIndex() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.data().slice(startIndex, endIndex);
  });

  @ContentChild('actionTemplate', { static: false })
  actionTemplate!: TemplateRef<{ $implicit: T }>;

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize.set(newPageSize);
    this.pageIndex.set(1);
  }

  isDate(value: unknown): value is Date {
    return value instanceof Date;
  }

  getCellValue(item: T, column: TableColumn<T>): string {
    const value = item[column.key];
    if (value === undefined) return '-';
    
    if (column.type === 'date' && this.isDate(value)) {
      return this.formatDate(value as Date);
    }
    
    return String(value);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
