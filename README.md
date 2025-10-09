# Table

This project provides a **proof of concept (POC)** for a reusable **table component** built with Angular.  
It also includes a **home page** showcasing a sample file list.

## Install dependencies

Before starting, make sure you have **Node.js** and **npm** installed on your machine.  
Then, install the project dependencies using:

```bash
npm install
```

## Development server

To start the local development server, run:

```bash
ng serve
```

After the server starts, open your browser and navigate to  
[`http://localhost:4200/`](http://localhost:4200/).  
The application will automatically reload whenever you modify any source files.

## Running unit tests

To run the unit tests using [Karma](https://karma-runner.github.io), use:

```bash
ng test
```

To generate a **code coverage report**, run:

```bash
ng test --no-watch --code-coverage
```

## 🧩 Table Component

The **`Table`** component is a reusable, accessible, and flexible Angular table that supports configurable columns, selectable rows, and custom cell rendering.  

---

### 🏗️ Overview

| Feature | Description |
|----------|--------------|
| **Dynamic Columns** | Define table structure via `colDefs` |
| **Row Selection** | Built-in single and bulk (Select All) selection |
| **Custom Cells** | Render cells using Angular components |
| **Accessible** | ARIA labels, keyboard navigation, indeterminate state |

---

### ⚙️ API Reference

#### Inputs

| Name | Type | Default | Description |
|------|------|----------|-------------|
| `rowData` | `TableRow[]` | — | Data items to display in rows |
| `colDefs` | `ColDef[]` | — | Defines columns and cell behavior |
| `title` | `string` | `''` | Optional table title |
| `description` | `string` | `''` | Optional caption text |
| `rowSelection` | `boolean` | `false` | Enables selection checkboxes |
| `selectableRowFn` | `(row: TableRow) => boolean` | `null` | Predicate to allow/disallow selection per row |

#### Outputs

| Name | Type | Description |
|------|------|-------------|
| `selectedRowsChange` | `Set<SelectableTableRow>` | Emits whenever selected rows change |

---

### 🧱 Column Definition

```ts
interface ColDef {
  field: string;                // Field name from the row object
  headerName: string;           // Column header label
  width?: string;               // Optional width (e.g., '150px' or '25%')
  valueFormatting?: (v: any) => string; // Optional display formatter
  cellComponent?: Type<any>;    // Optional Angular component for custom cells
}
```

---

### 🧠 Component Behavior

| Property | Type | Description |
|-----------|------|-------------|
| `selectedRows` | `Set<SelectableTableRow>` | Tracks the selected rows |
| `isAllSelected` | `boolean` | True if all selectable rows are selected |
| `isIndeterminate` | `boolean` | True if some but not all rows are selected |
| `rowDataWithSelectable` | `SelectableTableRow[]` | Internal computed list with selection metadata |

#### Methods

| Method | Description |
|---------|-------------|
| `toggleSelectAll(event: Event)` | Selects or deselects all rows |
| `toggleRowSelection(row: SelectableTableRow)` | Toggles an individual row |

---

### 📊 Example Usage

#### Basic Table

```html
<app-table
  [rowData]="users"
  [colDefs]="columns"
  title="User List"
  description="Registered application users">
</app-table>
```

```ts
users = [
  { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'User' },
];

columns = [
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'role', headerName: 'Role' },
];
```

---

#### With Row Selection

```html
<app-table
  [rowData]="users"
  [colDefs]="columns"
  [rowSelection]="true"
  (selectedRowsChange)="onSelectionChange($event)">
</app-table>
```

```ts
onSelectionChange(selected: Set<any>) {
  console.log('Selected rows:', Array.from(selected));
}
```

---

#### With Custom Cell Rendering

```ts
columns = [
  { field: 'name', headerName: 'Name' },
  { field: 'status', headerName: 'Status', cellComponent: StatusBadgeComponent },
];
```

```ts
@Component({
  selector: 'app-status-badge',
  template: `<span [class.active]="value === 'Active'">{{ value }}</span>`,
  styles: [`.active { color: green; font-weight: 500; }`],
})
export class StatusBadgeComponent {
  value!: string;
}
```

---

### ♿ Accessibility

- **Keyboard navigation:** Enter/Space toggles selection  
- **ARIA labels:** Added for headers, checkboxes, and rows  
- **Caption support:** Provided when `description` is set  
- **Visual feedback:** Hover, selected, and focus styles included  

---

