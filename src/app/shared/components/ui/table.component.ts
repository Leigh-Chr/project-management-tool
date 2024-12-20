import { DatePipe, NgTemplateOutlet } from '@angular/common';
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
  imports: [DatePipe, PaginatorComponent, NgTemplateOutlet],
  template: `
    <table
      class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800"
    >
      <thead class="bg-neutral-50 dark:bg-neutral-950">
        <tr>
          @for (column of columns; track $index) {
          <th
            class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
          >
            {{ column.name }}
          </th>
          } @if (actionTemplate) {
          <th
            class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
          >
            Actions
          </th>
          }
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800"
      >
        @if (paginatedData().length === 0) {
        <tr>
          <td
            class="px-4 py-2 text-center text-sm text-neutral-500 dark:text-neutral-400"
            [attr.colspan]="columns.length + (actionTemplate ? 1 : 0)"
          >
            No data available
          </td>
        </tr>
        } @else { @for (item of paginatedData(); track $index) {
        <tr class="hover:bg-neutral-100 dark:hover:bg-neutral-800">
          @for (column of columns; track $index) {
          <td
            class="px-4 py-2 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-200 overflow-hidden text-ellipsis max-w-xs"
          >
            @switch (column.type) { @case ('date') {
            {{
              item[column.key] !== undefined
                ? (item[column.key] | date : 'mediumDate')
                : '-'
            }}
            } @default {
            {{ item[column.key] !== undefined ? item[column.key] : '-' }}
            } }
          </td>
          } @if (actionTemplate) {
          <td class="px-4 py-2 text-sm text-neutral-900 dark:text-neutral-200">
            <ng-container
              *ngTemplateOutlet="actionTemplate; context: { $implicit: item }"
            ></ng-container>
          </td>
          }
        </tr>
        } }
      </tbody>
      <tfoot>
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends Record<string, any>> {
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
}
