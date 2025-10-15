import { Component, input, output, signal, linkedSignal } from '@angular/core';
import { ColDef, SELECTABLE_ROW_KEY, SelectableTableRow, TableRow } from './table.types';
import { augmentRowsWithSelectable } from './table.utils';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [NgComponentOutlet],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table<T extends TableRow = TableRow> {
  /** Data rows to display in the table */
  public rowData = input.required<T[]>();

  /** Column definitions for the table */
  public colDefs = input.required<ColDef<T>[]>();

  /** Table title and description */
  public title = input<string>('');
  public description = input<string>('');

  /** Row selection configuration */
  public rowSelection = input<boolean>(false);
  public selectableRowFn = input<((row: T) => boolean) | null>(null);

  /** Emits when selected rows change */
  public selectedRowsChange = output<Set<SelectableTableRow<T>>>();

  /** Internal selected row set */
  public selectedRows: Set<SelectableTableRow<T>> = new Set();

  /**
   * Key to identify selectable rows
   */
  readonly SELECTABLE_ROW_KEY = SELECTABLE_ROW_KEY;

  sort = signal<{ field: keyof T; direction: 'asc' | 'desc' } | null>({
    field: 'name',
    direction: 'asc',
  });

  /** Linked signal for table rows with selectable metadata and sorting */
  rowDataWithSelectable = linkedSignal<SelectableTableRow<T>[]>(() => {
    const baseRows = augmentRowsWithSelectable(this.rowData(), this.selectableRowFn());
    const sort = this.sort();

    // If no sort configuration, just return the base rows
    if (!sort) {
      return baseRows;
    }

    const { field, direction } = sort;
    const isAscending = direction === 'asc';

    // Return a sorted shallow copy to avoid mutating original rows
    return [...baseRows].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue === bValue) {
        return 0;
      }

      const comparison = aValue < bValue ? -1 : 1;
      return isAscending ? comparison : -comparison;
    });
  });

  /** Filter only selectable rows */
  get selectableRows(): SelectableTableRow<T>[] {
    return this.rowDataWithSelectable().filter((r) => r[SELECTABLE_ROW_KEY]);
  }

  /** Select all state helpers */
  get isAllSelected(): boolean {
    return this.selectedRows.size > 0 && this.selectedRows.size === this.selectableRows.length;
  }
  get isNoneSelected(): boolean {
    return this.selectedRows.size === 0;
  }
  get isIndeterminate(): boolean {
    return !this.isNoneSelected && !this.isAllSelected;
  }

  /**
   * Toggle all rows
   * @param checked - boolean indicating whether to select or deselect all
   */
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedRows = new Set(this.selectableRows);
      this.selectedRowsChange.emit(this.selectedRows);
    } else {
      this.selectedRows.clear();
      this.selectedRowsChange.emit(this.selectedRows);
    }
  }

  /**
   * Toggle one row
   * @param row - the row to toggle selection for
   */
  toggleRowSelection(row: SelectableTableRow<T>): void {
    if (row[SELECTABLE_ROW_KEY] === false) {
      return;
    }

    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
      this.selectedRowsChange.emit(this.selectedRows);
    } else {
      this.selectedRows.add(row);
      this.selectedRowsChange.emit(this.selectedRows);
    }
  }

  toggleSort(field: keyof T): void {
    const currentSort = this.sort();
    if (currentSort && currentSort.field === field) {
      // Toggle direction
      const newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
      this.sort.set({ field, direction: newDirection });
    } else {
      // Set new sort field and default to ascending
      this.sort.set({ field, direction: 'asc' });
    }
  }
}
