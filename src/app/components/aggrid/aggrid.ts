import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  GetRowIdParams,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { StatusRendererComponent } from './status-renderer.component';
import { StateService } from '../../services/state.service';
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
      [rowHeight]="40"
      [theme]="GLOBAL_GRID_THEME"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
    />
  `,
})
export class Aggrid {
  defaultColDef: ColDef = {
    cellStyle: { display: 'flex', alignItems: 'center', color: 'black', fontWeight: '400', fontFamily: 'Roboto, sans-serif' },
  };

  colDefs: ColDef[] = [
    { headerName: 'Customer', field: 'customerName', width: 285 },
    { headerName: 'Order Number', field: 'customerCode', maxWidth: 165, width: 165 },
    { headerName: 'Sales Order#', field: 'orderId', width: 195 },
    {
      headerName: 'Status',
      field: 'salesOrderNumber',
      flex: 1,
      minWidth: 840,
      cellRenderer: StatusRendererComponent,
      sortable: true,
      filter: true,
    },
  ];

  @Input() status!: GridStatus;
  protected readonly GLOBAL_GRID_THEME = GLOBAL_GRID_THEME;
  @Input() orders: Orders[] = [];
  @Output() onRowSelected = new EventEmitter<unknown>();

  getRowId = (params: GetRowIdParams) => String(params.data.orderId);

  constructor(protected state: StateService) {}

  onGridReady($event: GridReadyEvent) {}

  onCellClicked($event: any) {
    const order = this.state.orders().find(
      o => o.orderId === $event.data.orderId
    ) ?? null;
    this.state.selectedOrder.set(order);
  }
}
