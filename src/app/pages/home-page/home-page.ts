import { Component, signal } from '@angular/core';
import { File } from './home-page.types';
import { Table } from '../../components/table/table';
import { ColDef, TableRow } from '../../components/table/table.types';
import { Status } from './components/status/status';

@Component({
  selector: 'app-home-page',
  imports: [Table],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

  // Table data
  public files: File[] = [
    {
      name: 'smss.exe',
      device: 'Mario',
      path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe',
      status: 'scheduled',
    },

    {
      name: 'netsh.exe',
      device: 'Luigi',
      path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
      status: 'available',
    },

    {
      name: 'uxtheme.dll',
      device: 'Peach',
      path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
      status: 'available',
    },

    {
      name: 'aries.sys',
      device: 'Daisy',
      path: '\\Device\\HarddiskVolume1\\Windows\\System32\\aries.sys',
      status: 'scheduled',
    },

    {
      name: 'cryptbase.dll',
      device: 'Yoshi',
      path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll',
      status: 'scheduled',
    },

    {
      name: '7za.exe',
      device: 'Toad',
      path: '\\Device\\HarddiskVolume1\\temp\\7za.exe',
      status: 'scheduled',
    },
  ];

  // Table column definitions
  public columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Name' },
    { field: 'device', headerName: 'Device' },
    { field: 'path', headerName: 'Path', width: '50%' },
    { field: 'status', headerName: 'Status', cellComponent: Status },
  ];

  // Predicate to determine if a row is selectable
  readonly selectableRow = (row: TableRow): boolean => row['status'] === 'available';

  // Signal to hold selected rows
  selectedRows = signal<Set<TableRow>>(new Set());

  // Handler for when selected rows change
  public onSelectedRowsChange(selectedRows: Set<TableRow>) {
    this.selectedRows.set(selectedRows);
  }

  // Handler for downloading selected files
  public downloadSelected() {
    const selectedFiles = Array.from(this.selectedRows()).map(row => `Device: ${row['device']}, Path: ${row['path']}`);
    alert('Downloading selected files:\n' + selectedFiles.join('\n'));
  }

  get isDownloadDisabled(): boolean {
    return this.selectedRows().size === 0;
  }
}
