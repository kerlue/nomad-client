import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Orders } from '../../shared/interface';

interface TimelineRow {
  event: string;
  field: keyof Orders;
  timestamp: string | null;
  timestampDate: Date | null;
  status: 'completed' | 'pending';
}

@Component({
  selector: 'app-info-timeline',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  styleUrl: './info-timeline.scss',
  template: `
    @if (rowData.length > 0) {
      <div class="timeline-container">
        <h3>Integration Timeline</h3>
        <ag-grid-angular
          class="ag-theme-quartz"
          style="width: 100%; height: 400px;"
          [rowData]="rowData"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [gridOptions]="gridOptions">
        </ag-grid-angular>
      </div>
    } @else {
      <div class="empty-state">No order selected</div>
    }
  `
})
export class InfoTimeline {
  rowData: TimelineRow[] = [];

  // Map of field name -> human-readable event label
  private readonly timelineFields: { field: keyof Orders; label: string }[] = [
    { field: 'intraDbIntegrateAt', label: 'Intra DB' },
    { field: 'waveDbIntegratedAt', label: 'Wave DB' },
    { field: 'driverDbIntegratedAt', label: 'Driver DB' },
    { field: 'hJumpDbIntegratedAt', label: 'HighJump DB' },
    { field: 'routedAt', label: 'Routed' },
    { field: 'invoicedAt', label: 'Invoiced' }
  ];

  columnDefs: ColDef<TimelineRow>[] = [
    {
      headerName: 'Event',
      field: 'event',
      minWidth: 200
    },
    {
      headerName: 'Timestamp',
      field: 'timestampDate',
      minWidth: 250,
      sort: 'asc',
      comparator: (a: Date | null, b: Date | null) => {
        // Push nulls (pending events) to the bottom
        if (a === null && b === null) return 0;
        if (a === null) return 1;
        if (b === null) return -1;
        return a.getTime() - b.getTime();
      },
      valueFormatter: (params) => {
        if (!params.value) return '—';
        return (params.value as Date).toLocaleString();
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 250,
      cellClass: (params) =>
        params.value === 'completed' ? 'status-completed' : 'status-pending',
      valueFormatter: (params) =>
        params.value === 'completed' ? '✓ Completed' : 'Pending'
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true
  };

  gridOptions: GridOptions<TimelineRow> = {
    animateRows: true,
    rowHeight: 40
  };

  @Input()
  set selectedOrder(value: Orders | null) {
    if (!value) {
      this.rowData = [];
      return;
    }
    this.rowData = this.buildTimelineRows(value);
  }

  private buildTimelineRows(order: Orders): TimelineRow[] {
    return this.timelineFields.map(({ field, label }) => {
      const rawValue = order[field] as string | undefined;
      const date = this.parseDate(rawValue);
      return {
        event: label,
        field,
        timestamp: rawValue ?? null,
        timestampDate: date,
        status: date ? 'completed' : 'pending'
      };
    });
  }

  private parseDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}
