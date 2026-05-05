import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';
import { ServerNotReachableDialogComponent } from '../dialogs/server-not-reachable-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { Orders } from '../../shared/interface';
import { SearchInput } from '../search-input/search-input';
import { OperationFailedDialog } from '../dialogs/operation-failed-dialog.component';
import { Util } from '../../services/util';

@Component({
  selector: 'app-info-order-details',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule,
    NgxJsonViewerModule,
    SearchInput,
  ],
  styleUrl: './info-order-details.scss',
  template: `
    <div class="container">
      @if (loading) {
        <div class="loader-overlay">
          <mat-spinner diameter="60" strokeWidth="4"></mat-spinner>
        </div>
      }
      <mat-toolbar class="toolbar">
        <app-search-input
          placeholder="Search order..."
          [debounce]="400"
          (valueChange)="onSearch($event)"
          (cleared)="clearSearch()"
        />

        <span class="spacer"></span>

        <button mat-icon-button (click)="onRefresh()" aria-label="Refresh" matTooltip="Refresh">
          <mat-icon>refresh</mat-icon>
        </button>
      </mat-toolbar>

      <div class="content">
        <ngx-json-viewer [json]="filteredData"></ngx-json-viewer>
      </div>
    </div>
  `,
})
export class InfoOrderDetails implements OnInit {
  private orderData: any;
  protected filteredData: any;
  protected loading = false;
  @Input() selectedOrder!: Orders | null;

  constructor(
    protected api: ApiService,
    protected state: StateService,
    protected dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  onSearch(inputStr: string): void {
    this.applyFilter(inputStr);
  }

  clearSearch(): void {
    this.applyFilter('');
  }

  onRefresh(): void {
    this.loadOrder();
  }

  private applyFilter(str: string): void {
    const query = str.trim().toLowerCase();
    if (!query) {
      this.filteredData = this.orderData;
      return;
    }
    this.filteredData = Util.filterJson(this.orderData, query);
  }

  private loadOrder() {
    const orderId = this.state.selectedOrder()?.orderId;
    const divisionId = this.state.selectedOrder()?.divisionId;
    const isIntegrated = this.state.selectedOrder()?.erpIntegrated;

    if (!orderId || !divisionId || !isIntegrated) {
      return;
    }

    this.loading = true;
    this.api.fetchOrderDetails(orderId, divisionId).subscribe({
      next: (value: any) => {
        this.orderData = value;
        this.onSearch('')
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.dialog.open(OperationFailedDialog,{
          data: {
            message: err.error,
          }});

      },
    });
  }

}
