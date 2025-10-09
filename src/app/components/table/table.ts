import { Component, computed, input, output } from '@angular/core';
import { ColDef, SELECTABLE_ROW_KEY, SelectableTableRow, TableRow } from './table.types';
import { augmentRowsWithSelectable } from './table.utils';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [NgComponentOutlet],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  /** Data rows to display in the table */
  public rowData = input.required<TableRow[]>();

  /** Column definitions for the table */
  public colDefs = input.required<ColDef[]>();

  /** Table title and description */
  public title = input<string>('');
  public description = input<string>('');

  /** Row selection configuration */
  public rowSelection = input<boolean>(false);
  public selectableRowFn = input<((row: TableRow) => boolean) | null>(null);

  /** Emits when selected rows change */
  public selectedRowsChange = output<Set<SelectableTableRow>>();

  /** Internal selected row set */
  public selectedRows: Set<SelectableTableRow> = new Set();

  /**
   * Key to identify selectable rows
   */
  readonly SELECTABLE_ROW_KEY = SELECTABLE_ROW_KEY;

  /** Computed table rows with selectable metadata */
  rowDataWithSelectable = computed<SelectableTableRow[]>(() =>
    augmentRowsWithSelectable(this.rowData(), this.selectableRowFn() || undefined),
  );

  /** Filter only selectable rows */
  get selectableRows(): SelectableTableRow[] {
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
  toggleRowSelection(row: SelectableTableRow) {
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
}
