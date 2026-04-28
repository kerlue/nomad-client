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
import { OrderStatusRendererComponent } from './order-status-renderer.component';
ModuleRegistry.registerModules([AllCommunityModule, RowDragModule]);

@Component({
  selector: 'app-aggrid',
  imports: [AgGridAngular],
  styleUrl: './aggrid.scss',
  template: `
    <ag-grid-angular
      style="height: 100%;"
      [columnDefs]="colDefs"
      [defaultColDef]="defaultColDef"
      (cellClicked)="onCellClicked($event)"
      [enableCellTextSelection]="true"
      [rowData]="orders"
      [rowHeight]="45"
      [theme]="GLOBAL_GRID_THEME"
      (gridReady)="onGridReady($event)"
    />
  `,
})
export class Aggrid {
  defaultColDef: ColDef = {
    cellStyle: { display: 'flex', alignItems: 'center' },
  };

  colDefs: ColDef[] = [
    { headerName: 'Customer Id', field: 'orderId', maxWidth: 155, width: 155 },
    { headerName: 'Order Number', field: 'customerCode', maxWidth: 165, width: 165 },
    {
      headerName: 'Status',
      field: 'salesOrderNumber',
      flex: 1,
      minWidth: 340,
      cellRenderer: OrderStatusRendererComponent,
      sortable: true,
      filter: true,
    },
  ];



  @Input() status!: GridStatus;
  protected readonly GLOBAL_GRID_THEME = GLOBAL_GRID_THEME;
  @Input() orders: Orders[] = [];

  onGridReady($event: any) {}

  onCellClicked($event: any) {}
}
