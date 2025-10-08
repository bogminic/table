export interface ColDef {
  field: string;
  headerName: string;
  width?: string;
  valueFormatting?: (value: unknown) => string;
};

export interface TableRow {
  [key: string]: unknown;
}