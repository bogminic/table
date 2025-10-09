import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table';
import { Component, input } from '@angular/core';
import { CellComponentInterface, TableRow } from './table.types';

describe('Table', () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
    }).compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rowData', [{ id: 1, name: 'Test Row' }]);
    fixture.componentRef.setInput('colDefs', [{ field: 'name', headerName: 'Name' }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display rowData in table body', () => {
    fixture.detectChanges();
    const rowElement = fixture.nativeElement.querySelector('table tbody tr');

    expect(rowElement).toBeTruthy();
    expect(rowElement.cells.length).toBe(1);
    expect(rowElement.cells[0].textContent).toContain('Test Row');
  });

  it('should display colDefs in table header', () => {
    fixture.detectChanges();
    const headerElement = fixture.nativeElement.querySelector('table thead tr');

    expect(headerElement).toBeTruthy();
    expect(headerElement.cells.length).toBe(1);
    expect(headerElement.cells[0].textContent).toContain('Name');
  });

  it('should display no data message when rowData is empty', () => {
    fixture.componentRef.setInput('rowData', []);
    fixture.detectChanges();
    const noDataElement = fixture.nativeElement.querySelector('table tbody tr td');

    expect(noDataElement).toBeTruthy();
    expect(noDataElement.textContent).toContain('No data available');
  });

  it('should table header be displayed with accessibility in mind', () => {
    fixture.detectChanges();
    const headerElement = fixture.nativeElement.querySelector('th');

    expect(headerElement).toBeTruthy();
    expect(headerElement.getAttribute('scope')).toBe('col');
    expect(headerElement.getAttribute('id')).toBe('col-0');
    expect(headerElement.getAttribute('aria-sort')).toBe('none');
  });

  it('should table cell be displayed with accessibility in mind', () => {
    fixture.detectChanges();
    const cellElement = fixture.nativeElement.querySelector('td');

    expect(cellElement).toBeTruthy();
    expect(cellElement.getAttribute('headers')).toBe('col-0');
  });

  it('should use title in aria-label when provided', () => {
    fixture.componentRef.setInput('title', 'Test Table');

    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('table');

    expect(titleElement.getAttribute('aria-label')).toBe('Data table of Test Table');
  });

  it('should not use title in aria-label by default', () => {
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('table');

    expect(titleElement.getAttribute('aria-label')).toBe(null);
  });

  it('should display description in caption when provided', () => {
    fixture.componentRef.setInput('description', 'This is a test table');

    fixture.detectChanges();
    const descriptionElement = fixture.nativeElement.querySelector('table caption');

    expect(descriptionElement.textContent).toContain('This is a test table');
  });

  it('should not display caption if description is not provided', () => {
    fixture.detectChanges();
    const descriptionElement = fixture.nativeElement.querySelector('table caption');

    expect(descriptionElement).toBe(null);
  });

  it('it should format cell value when valueFormatting function is provided in colDef', () => {
    fixture.componentRef.setInput('colDefs', [
      {
        field: 'name',
        headerName: 'Name',
        valueFormatting: (value: string) => `Formatted: ${value}`,
      },
    ]);
    fixture.detectChanges();

    const cellElement = fixture.nativeElement.querySelector('td');

    expect(cellElement.textContent).toContain('Formatted: Test Row');
  });

  it('it should display cell component when cellComponent is provided in colDef', () => {
    @Component({
      selector: 'app-mock-cell',
      template: `
        <span class="mock-cell">{{ value() }}</span>
      `,
    })
    class MockCellComponent implements CellComponentInterface {
      value = input.required<string>();
    }

    fixture.componentRef.setInput('colDefs', [
      { field: 'name', headerName: 'Name', cellComponent: MockCellComponent },
    ]);
    fixture.detectChanges();

    const cellElement = fixture.nativeElement.querySelector('td .mock-cell');

    expect(cellElement).toBeTruthy();
    expect(cellElement.textContent).toContain('Test Row');
  });

  it('should display select column when rowSelection is provided', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.detectChanges();

    const selectAllCol = fixture.nativeElement.querySelector('col.select-all-col');
    const selectAllCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');
    const colEmptyHeader = fixture.nativeElement.querySelector('thead th[aria-label="Select row"]');
    const selectRowCheckbox = fixture.nativeElement.querySelector('tbody input[type="checkbox"]');

    expect(selectAllCol).toBeTruthy();
    expect(selectAllCheckbox).toBeTruthy();
    expect(colEmptyHeader).toBeTruthy();
    expect(selectRowCheckbox).toBeTruthy();
  });

  it('should allow only the rows with selectableRowFn return true to be selected', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();
    const selectRowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    );

    expect(selectRowCheckboxes.length).toBe(3);
    expect(selectRowCheckboxes[0].disabled).toBeFalse();
    expect(selectRowCheckboxes[1].disabled).toBeTrue();
    expect(selectRowCheckboxes[2].disabled).toBeFalse();
  });

  it('should select-all checkbox be in an unselected state if no items are selected', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();
    const selectAllCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');

    expect(selectAllCheckbox.indeterminate).toBeFalse();
    expect(selectAllCheckbox.checked).toBeFalse();
  });
  // The select-all checkbox should be in a selected state if all items are selected
  it('should select-all checkbox be in a selected state if all items are selected', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();

    const selectAllCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');
    selectAllCheckbox.click();
    fixture.detectChanges();

    expect(selectAllCheckbox.indeterminate).toBeFalse();
    expect(selectAllCheckbox.checked).toBeTrue();
  });

  it('should select-all checkbox be in an indeterminate state if some but not all items are selected', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();

    const selectAllCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');
    const selectRowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    );
    selectRowCheckboxes[0].click();
    fixture.detectChanges();

    expect(selectAllCheckbox.indeterminate).toBeTrue();
    expect(selectAllCheckbox.checked).toBeFalse();
  });

  // * The "Selected 2" text should reflect the count of selected items and display "None Selected" when there are none selected.

  it('should display selected count correctly', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();
    const selectedCountElement = fixture.nativeElement.querySelector('.selected-count');

    expect(selectedCountElement.textContent).toContain('None Selected');

    const selectRowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    );
    selectRowCheckboxes[0].click();
    fixture.detectChanges();

    expect(selectedCountElement.textContent).toContain('Selected 1');

    selectRowCheckboxes[2].click();
    fixture.detectChanges();

    expect(selectedCountElement.textContent).toContain('Selected 2');
  });

  // * Clicking the select-all checkbox should select all items if none or some are selected.

  it('should select all rows when select-all checkbox is clicked', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();

    const selectAllCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');
    selectAllCheckbox.click();
    fixture.detectChanges();
    const selectRowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    );

    expect(selectRowCheckboxes[0].checked).toBeTrue();
    expect(selectRowCheckboxes[1].checked).toBeFalse();
    expect(selectRowCheckboxes[2].checked).toBeTrue();
  });

  //* Clicking the select-all checkbox should de-select all items if all are currently selected.

  it('should deselect all rows when select-all checkbox is clicked again', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();

    const selectAllCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');
    selectAllCheckbox.click();
    fixture.detectChanges();
    selectAllCheckbox.click();
    fixture.detectChanges();
    const selectRowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    );

    expect(selectRowCheckboxes[0].checked).toBeFalse();
    expect(selectRowCheckboxes[1].checked).toBeFalse();
    expect(selectRowCheckboxes[2].checked).toBeFalse();
  });

  it('should toogle individual row selection when row checkbox is clicked', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();

    const selectRowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    );
    selectRowCheckboxes[0].click();
    fixture.detectChanges();

    expect(selectRowCheckboxes[0].checked).toBeTrue();

    selectRowCheckboxes[0].click();
    fixture.detectChanges();

    expect(selectRowCheckboxes[0].checked).toBeFalse();
  });

  it('should not toggle selection when a disabled row checkbox is clicked', () => {
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();
    const selectRowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    );
    selectRowCheckboxes[1].click();
    fixture.detectChanges();

    expect(selectRowCheckboxes[1].checked).toBeFalse();
  });

  it('should emit selectedRowsChange event when selection changes', () => {
    spyOn(component.selectedRowsChange, 'emit');
    fixture.componentRef.setInput('rowSelection', true);
    fixture.componentRef.setInput('rowData', [
      { id: 1, name: 'Test Row' },
      { id: 2, name: 'Another Row' },
      { id: 3, name: 'Test Row' },
    ]);
    fixture.componentRef.setInput('selectableRowFn', (row: TableRow) => row['name'] === 'Test Row');
    fixture.detectChanges();

    const selectRowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    );
    selectRowCheckboxes[0].click();
    fixture.detectChanges();

    expect(component.selectedRowsChange.emit).toHaveBeenCalledWith(new Set([jasmine.objectContaining({ id: 1, name: 'Test Row' })]));

    selectRowCheckboxes[2].click();
    fixture.detectChanges();
    
    expect(component.selectedRowsChange.emit).toHaveBeenCalledWith(new Set([jasmine.objectContaining({ id: 1, name: 'Test Row' }), jasmine.objectContaining({ id: 3, name: 'Test Row' })]));
  });
});
