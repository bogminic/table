import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table';

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
    expect(rowElement.cells[0].textContent).toBe('Test Row');
  });

  it('should display colDefs in table header', () => {
    fixture.detectChanges();
    const headerElement = fixture.nativeElement.querySelector('table thead tr');

    expect(headerElement).toBeTruthy();
    expect(headerElement.cells.length).toBe(1);
    expect(headerElement.cells[0].textContent).toBe('Name');
  });

  it('should display no data message when rowData is empty', () => {
    fixture.componentRef.setInput('rowData', []);
    fixture.detectChanges();
    const noDataElement = fixture.nativeElement.querySelector('table tbody tr td');

    expect(noDataElement).toBeTruthy();
    expect(noDataElement.textContent).toBe('No data available');
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

    expect(descriptionElement.textContent).toBe(' This is a test table ');
  });

  it('should not display caption if description is not provided', () => {
    fixture.detectChanges();
    const descriptionElement = fixture.nativeElement.querySelector('table caption');

    expect(descriptionElement).toBe(null);
  });

  it('it should format cell value when valueFormatting function is provided in colDef', () => {
    fixture.componentRef.setInput('colDefs', [{ field: 'name', headerName: 'Name', valueFormatting: (value: string) => `Formatted: ${value}` }]);
    fixture.detectChanges();

    const cellElement = fixture.nativeElement.querySelector('td');
    expect(cellElement.textContent).toBe('Formatted: Test Row');
  });
});
