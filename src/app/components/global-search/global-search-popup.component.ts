import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatFormField, MatPrefix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {AgGridAngular} from "ag-grid-angular";
import {CellClickedEvent, ColDef} from "ag-grid-community";
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";
import { StateService } from '../../services/state.service';
import { Orders } from '../../shared/interface';
import { GLOBAL_GRID_THEME } from '../aggrid/grid-theme.constant';
import { SearchInput } from '../search-input/search-input';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-global-search-popup',
  standalone: true,
  imports: [
    FormsModule,
    AgGridAngular,
    SearchInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './global-search-popup.component.scss',
  template: `
    <div class="global-search-container ">
      <div class="search-container">
        <app-search-input
          placeholder="Search order..."
          [debounce]="400"
          (valueChange)="onSearch($event)"
          (cleared)="clearSearch()"
        />
      </div>
      <div>
        <ag-grid-angular
          style="height: 95%; padding: 12px"
          [columnDefs]="colDefs"
          (cellClicked)="onCellClicked($event)"
          [enableCellTextSelection]="true"
          [rowData]="rowData"
          [theme]="GLOBAL_GRID_THEME"
          (gridReady)="onGridReady($event)"
        />
      </div>
    </div>
  `,
})
export class GlobalSearchPopupComponent {
  rowData: Orders[] = [];
  protected readonly GLOBAL_GRID_THEME = GLOBAL_GRID_THEME;

  colDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'shippingDate',
      width: 150,
      sort: 'desc',
      valueGetter: (params) => {
        const val = params.data?.shippingDate;
        if (!val) return null;
        return new Date(val);
      },
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date: Date = params.value;
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      },
      comparator: (dateA: Date, dateB: Date) => {
        if (!dateA && !dateB) return 0;
        if (!dateA) return -1;
        if (!dateB) return 1;
        return dateA.getTime() - dateB.getTime();
      },
    },
    { headerName: 'Customer Id', field: 'customerCode', maxWidth: 155, width: 155 },
    { headerName: 'Customer Name', field: 'customerName' , width: 255 },
    { headerName: 'Order Number', field: 'orderId', maxWidth: 165, width: 165 },
    { headerName: 'Source', field: 'source',  },

  ];

  constructor(
    protected apiService: ApiService,
    protected state: StateService,
    protected cdr: ChangeDetectorRef,
    protected dialogRef: MatDialogRef<GlobalSearchPopupComponent>,
  ) {}

  onCellClicked(order: CellClickedEvent<Orders>) {
    if(order.data){
      this.state.globalFilterOrderId.set(order.data.orderId)
      this.state.filter.set({orderSource: "none", orderStatus: "none", queryString: ""})
      this.state.orders.set([order.data])
    }

    this.dialogRef.close();
  }

  onGridReady(params: any) {}


  clearSearch() {
    this.rowData = []
  }

  onSearch(searchTerm: string) {
    let param = {
      query: searchTerm,
    };

    this.apiService.globalOrderSearch(param)
      .subscribe((result: Orders[]) => {
      this.rowData = result;
      this.cdr.detectChanges();
    });
  }
}
