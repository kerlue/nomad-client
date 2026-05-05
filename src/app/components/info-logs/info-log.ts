import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { JsonViewerDialogComponent } from './json-expand-cell';
import { ApiService } from '../../services/api.service';
import { Orders } from '../../shared/interface';
import { OperationFailedDialog } from '../dialogs/operation-failed-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

export interface ApiLog {
  id: number;
  type: string | null;
  url: string | null;
  json: string | null;
  responseText: string | null;
  startDate: Date;
  statusCode: number | null;
  storedProcedure: string | null;
}

@Component({
  selector: 'app-api-log',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatProgressSpinner],
  template: `
    @if (loading) {
      <div class="loader-overlay">
        <mat-spinner diameter="60" strokeWidth="4"></mat-spinner>
      </div>
    }
    <div class="grid-wrapper">
      <ag-grid-angular
        class="ag-theme-alpine"
        style="width: 100%; height: 600px;"
        [rowData]="rowData"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [animateRows]="true"
        (cellClicked)="onCellClicked($event)"
        [rowHeight]="40"
        (gridReady)="onGridReady($event)"
      />
    </div>
  `,
  styles: [
    `
      .grid-wrapper {
        padding: 16px;
      }
    `,
  ],
})
export class ApiLogComponent implements OnInit {
  protected loading: boolean = false;

  constructor(
    private apiService: ApiService,
    protected dialog: MatDialog,
    protected cdr: ChangeDetectorRef,
  ) {}

  @Input() rowData: ApiLog[] = [];

  private gridApi!: GridApi;

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
  };

  columnDefs: ColDef[] = [
    {
      field: 'startdate',
      headerName: 'Start Date',
      width: 140,
      valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : ''),
    },
    {
      field: 'statuscode',
      headerName: 'Code',
      width: 60,
      valueFormatter: (params) => params.value,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 110,
      valueFormatter: (params) => params.value,
    },
    {
      field: 'json',
      headerName: 'JSON',
      width: 200,
      flex: 1,
      cellRendererParams: { label: 'View JSON' },
      autoHeight: true,
    },
    {
      field: 'responsetext',
      headerName: 'Response Text',
      width: 200,
      flex: 1,
      cellRendererParams: { label: 'View Response' },
      autoHeight: true,
    },
  ];
  @Input() selectedOrder!: Orders | null;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onCellClicked(event: any): void {
    const clickableFields = ['json', 'responsetext'];
    if (!clickableFields.includes(event.colDef.field!) || !event.value) return;

    this.dialog.open(JsonViewerDialogComponent, {
      width: '700px',
      maxHeight: '80vh',
      data: {
        label: event.colDef.headerName,
        json: this.tryParse(event.value),
        raw: event.value
      }
    });
  }

  private tryParse(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }



  ngOnInit() {
    if (!this.selectedOrder) {
      return;
    }

    const input = {
      orderId: this.selectedOrder.orderId,
      source: this.selectedOrder.source,
      date: this.selectedOrder.createdDate,
    };

    this.loading = true;
    this.apiService.fetchOrderLogs(input).subscribe({
      next: (value: any) => {
        this.rowData = value;

        console.log(value);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.dialog.open(OperationFailedDialog, {
          data: {
            message: err.error,
          },
        });
      },
    });
  }
}
