import { InputSignal, Type } from "@angular/core";

export interface ColDef {
  field: string;
  headerName: string;
  width?: string;
  valueFormatting?: (value: unknown) => string;
  cellComponent?: Type<CellComponentInterface>;
};

export type SelectableTableRow = TableRow & { [SELECTABLE_ROW_KEY: symbol]: boolean} 

export interface TableRow {
  [key: string]: unknown;
}

export interface CellComponentInterface {
  value: InputSignal<string> | InputSignal<number> | InputSignal<boolean> | InputSignal<unknown>;
}

export const SELECTABLE_ROW_KEY = Symbol();