import { SELECTABLE_ROW_KEY, TableRow, SelectableTableRow } from './table.types';

/**
 * Add a selectable flag to each row based on a given predicate.
 * If no function is provided, all rows are selectable.
 * @param rows - original table rows
 * @param selectableFn - optional function to determine if a row is selectable
 */
export function augmentRowsWithSelectable<T extends TableRow>(
  rows: T[],
  selectableFn?: ((row: T) => boolean) | null
): SelectableTableRow<T>[] {
  return rows.map((row) => ({
    ...row,
    [SELECTABLE_ROW_KEY]: selectableFn ? !!selectableFn(row) : true,
  }));
}

