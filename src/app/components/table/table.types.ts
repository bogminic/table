import { InputSignal, Type } from "@angular/core";

export interface ColDef<T extends TableRow = TableRow> {
  field: keyof T;
  headerName: string;
  width?: string;
  valueFormatting?: (value: SelectableTableRow<T>[keyof T]) => string;
  cellComponent?: Type<CellComponentInterface>;
};

export type SelectableTableRow<T extends TableRow = TableRow> = T & { [SELECTABLE_ROW_KEY]: boolean} 

export interface TableRow {
  [key: string]: unknown;
}

export interface CellComponentInterface {
  value: InputSignal<string> | InputSignal<number> | InputSignal<boolean> | InputSignal<unknown>;
}

export const SELECTABLE_ROW_KEY: symbol = Symbol();