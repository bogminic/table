import { Component, input } from '@angular/core';
import { CellComponentInterface } from '../../../../components/table/table.types';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-status',
  imports: [TitleCasePipe],
  templateUrl: './status.html',
  styleUrl: './status.css'
})
export class Status implements CellComponentInterface {
  value = input.required<string>();
}
