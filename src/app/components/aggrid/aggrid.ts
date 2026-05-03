import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterObject, Orders } from '../../shared/interface';
import { GLOBAL_GRID_THEME } from './grid-theme.constant';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRowNode,
  ModuleRegistry,
  RowDragModule,
  GetRowIdParams,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { StatusRenderer } from './status-renderer';
import { StateService } from '../../services/state.service';
import { CsvExporter } from './csv-exporter';
ModuleRegistry.registerModules([AllCommunityModule, RowDragModule]);

@Component({
  selector: 'app-aggrid',
  imports: [AgGridAngular],
  styleUrl: './aggrid.scss',
  template: `
    <ag-grid-angular
      style="height: calc(100% - 18px); margin-left: 18px; margin-right: 18px;"
      [columnDefs]="colDefs"
      [defaultColDef]="defaultColDef"
      [gridOptions]="gridOptions"
      (cellClicked)="onCellClicked($event)"
      [enableCellTextSelection]="true"
      [rowData]="currentOrders"
      [rowHeight]="42"
      [theme]="GLOBAL_GRID_THEME"
      (rowDataUpdated)="onRowDataUpdated()"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
    />
  `,
})
export class Aggrid {
  private currentFilter: FilterObject | null = null;

  gridOptions: GridOptions = {
    suppressCellFocus: true,
    isExternalFilterPresent: () => this.isExternalFilterPresent(),
    doesExternalFilterPass: (node) => this.doesExternalFilterPass(node),
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
    { headerName: 'Customer', field: 'customerName', flex: 1, minWidth: 0 },
    { headerName: 'Order Number', field: 'customerCode', width: 190 },
    { headerName: 'Sales Order#', field: 'orderId', width: 190 },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusRenderer,
      sortable: true,
      filter: true,
      cellStyle: { marginTop: '0px' },
      flex: 2,
      minWidth: 820
    },
  ];

  protected readonly GLOBAL_GRID_THEME = GLOBAL_GRID_THEME;
  protected currentOrders: Orders[] = [];
  @Output() onRowSelected = new EventEmitter<unknown>();

  getRowId = (params: GetRowIdParams) => String(params.data.orderId);
  private gridApi!: GridApi<Orders>;

  constructor(protected state: StateService) {}

  @Input()
  set filter(value: FilterObject | null) {
    this.currentFilter = value;
    if (value && this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', value.queryString);
      this.gridApi.onFilterChanged();
    }
  }

  @Input() set onExportCsv(val: number) {
    if(val <= 0)return;

    const filterd: Orders[] = []
    this.gridApi.forEachNodeAfterFilter(node => {  // respects current filters
      if(node.data){
        filterd.push(node.data)
      }
    });

    CsvExporter.download(filterd, 'orders.csv');
    //this.convertToCSV(headers, rows);
  }

  @Input()
  set orders(value: Orders[]) {
    this.currentOrders = value;
    this.gridApi?.setGridOption('rowData', this.currentOrders);
  }

  onRowDataUpdated() {
    this.gridApi?.refreshCells({ force: true });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    // Apply any filter that arrived before the grid was ready
    if (this.currentFilter) {
      this.gridApi.setGridOption('quickFilterText', this.currentFilter.queryString);
      this.gridApi.onFilterChanged();
    }
  }

  onCellClicked($event: any) {
    const order = this.state.orders().find(
      o => o.orderId === $event.data.orderId
    ) ?? null;
    this.state.selectedOrder.set(order);
  }

  private isExternalFilterPresent(): boolean {
    const f = this.currentFilter;
    if (!f) return false;
    return (f.orderSource && f.orderSource !== 'none')
      || (f.orderStatus && f.orderStatus !== 'none');
  }

  private doesExternalFilterPass(node: IRowNode<Orders>): boolean {
    const f = this.currentFilter;
    if (!f || !node.data) return true;

    const data = node.data;

    // Source check — passes if filter is off, or row's source matches
    const sourceOk =
      f.orderSource === 'none' ||
      data.source?.toLowerCase() === f.orderSource.toLowerCase();

    // Status check — passes if filter is off, or row matches the status rule
    let statusOk = false;
    switch (f.orderStatus) {
      case 'none':
        statusOk = true;
        break;
      case 'dynamics':
        statusOk = !data.erpIntegrated;
        break;
      case 'integrated':
        statusOk = data.integrationStatus == 'PENDING' ||  data.integrationStatus == 'PARTIAL';
        break;
      case 'routed':
        statusOk = !data.routedAt;
        break;
      case 'shipped':
        statusOk = !data.invoicedAt;
        break;
    }

    return sourceOk && statusOk;
  }
}
