export interface ColDef {
  field: string;
  headerName: string;
  width?: string;
};

export interface TableRow {
  [key: string]: unknown;
}