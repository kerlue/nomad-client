import { Component, Input } from '@angular/core';
import { GridStatus, Orders } from '../../shared/interface';
import { GLOBAL_GRID_THEME } from './grid-theme.constant';
import {
  AllCommunityModule,
  ColDef, ColumnState,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  RowDragModule,
  RowSelectionOptions,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
ModuleRegistry.registerModules([AllCommunityModule, RowDragModule]);

@Component({
  selector: 'app-aggrid',
  imports: [AgGridAngular],
  styleUrl: './aggrid.scss',
  template: `
    <ag-grid-angular
      style="height: 100%;"
      [columnDefs]="colDefs"
      (cellClicked)="onCellClicked($event)"
      [enableCellTextSelection]="true"
      [rowData]="orders"
      [theme]="GLOBAL_GRID_THEME"
      (gridReady)="onGridReady($event)"
    />
  `,
})
export class Aggrid {
  colDefs: ColDef[] = [
    { headerName: 'Customer Id', field: 'orderId', maxWidth: 155, width: 155 },
    { headerName: 'Order Number', field: 'customerCode', maxWidth: 165, width: 165 },
    { headerName: 'Status', field: 'salesOrderNumber', flex: 1 },
  ];



  @Input() status!: GridStatus;
  protected readonly GLOBAL_GRID_THEME = GLOBAL_GRID_THEME;
  @Input() orders: Orders[] = [];

  onGridReady($event: any) {}

  onCellClicked($event: any) {}
}
