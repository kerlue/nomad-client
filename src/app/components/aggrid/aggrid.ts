import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Orders } from '../../shared/interface';
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
      [gridOptions]="gridOptions"
      (cellClicked)="onCellClicked($event)"
      [enableCellTextSelection]="true"
      [rowData]="orders"
      [rowHeight]="42"
      [theme]="GLOBAL_GRID_THEME"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
    />
  `,
})
export class Aggrid {
  gridOptions: any = {
    suppressCellFocus: true,
  };

  defaultColDef: ColDef = {
    cellStyle: {
      alignItems: 'center',
      color: 'black',
      justifyContent: 'center',
      fontWeight: '400',
      fontFamily: 'Roboto, sans-serif',
      marginTop: '4px'
    },
  };

  colDefs: ColDef[] = [
    { headerName: 'Customer', field: 'customerName', width: 290 },
    { headerName: 'Order Number', field: 'customerCode', width: 195 },
    { headerName: 'Sales Order#', field: 'orderId', width: 195 },
    {
      headerName: 'Status',
      field: 'salesOrderNumber',
      //flex: 1,
      minWidth: 900,
      cellRenderer: StatusRendererComponent,
      sortable: true,
      filter: true,
      cellStyle: {
        marginTop: '0px'
      },
    },
  ];

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
