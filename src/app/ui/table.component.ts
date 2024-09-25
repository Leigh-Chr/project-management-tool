import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-table',
  imports: [CommonModule, DatePipe],
  template: `
    <table
      class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800"
    >
      <thead class="bg-neutral-50 dark:bg-neutral-950">
        <tr>
          <th
            *ngFor="let header of headers"
            class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
          >
            {{ header.name }}
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800"
      >
        <tr
          *ngFor="let item of data"
          class="hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <td
            *ngFor="let column of columns"
            class="px-4 py-2 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-200 overflow-hidden text-ellipsis max-w-xs"
          >
            <ng-container [ngSwitch]="column.type">
              <ng-container *ngSwitchCase="'date'">
                {{
                  item[column.key] !== undefined
                    ? (item[column.key] | date : 'mediumDate')
                    : '-'
                }}
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ item[column.key] !== undefined ? item[column.key] : '-' }}
              </ng-container>
            </ng-container>
          </td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TableComponent<T extends Record<string, string | number | Date>> {
  @Input() headers: { name: string; key: keyof T }[] = [];
  @Input() columns: { key: keyof T; type: string }[] = [];
  @Input() data: T[] = [];
}
