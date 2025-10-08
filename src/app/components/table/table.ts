import { Component, input } from '@angular/core';
import { ColDef, TableRow } from './table.types';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {

  /**
   * Data to display in the table
   */
  public rowData = input.required<TableRow[]>();

  /**
   * Column definitions for the table
   */
  public colDefs = input.required<ColDef[]>();

  /**
   * Title of the table
   */
  public title = input<string>('');

  /**
   * Description of the table
   */
  public description = input<string>('');

}