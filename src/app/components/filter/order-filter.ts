import { Component, effect, EventEmitter, Output } from '@angular/core';
import { SearchInput } from '../search-input/search-input';
import { StateService } from '../../services/state.service';
import { StatusFilterComponent } from './status-filter/status-filter.component';
import { SourceFilterComponent } from './source-filter/source-filter.component';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { OperationFailedDialog } from '../dialogs/operation-failed-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OperationSuccessfulDialog } from '../dialogs/operation-successful-dialog.component';
import { ConfirmRequestComponent } from '../dialogs/confirm-request';

@Component({
  selector: 'app-order-filter',
  imports: [SearchInput, StatusFilterComponent, SourceFilterComponent, MatButton, MatTooltip, MatIcon],
  styleUrl: './order-filter.scss',
  template: `
    <div class="filter-container">
      <div class="filter-left">

        <app-search-input
          placeholder="Filter..."
          [value]="this.state.globalFilterOrderId() ?? ''"
          [highlight]="this.state.globalFilterOrderId() != null"
          [debounce]="400"
          [width]="'200'"
          (valueChange)="onSearch($event)"
          (cleared)="onCleared()"
        />

        @if(this.state.globalFilterOrderId()){
          <button class="action-btn" mat-stroked-button (click)="clearGlobalFilter()">
            <mat-icon>clear</mat-icon>
            Clear Filter
          </button>
        }

        <app-source-filter [filter] = "this.state.filter()"> </app-source-filter>

        <app-status-filter [filter] = "this.state.filter()"> </app-status-filter>
      </div>

      <div class="filter-right">
        <button [disabled] ="this.hasFailedOrders" class="action-btn" mat-stroked-button  matTooltip="Trigger failed integrations"
                (click)="onReTriggerIntClick()">
          <mat-icon>refresh</mat-icon>
          Trigger Integration
        </button>

        <button [disabled] ="this.hasFailedOrders" class="action-btn" mat-stroked-button
                (click)="onExportCsv.emit()">
          <mat-icon>download</mat-icon>
          Export CSV
        </button>
      </div>
    </div>
  `,
})
export class OrderFilter {
  hasFailedOrders: boolean = false;
  @Output() onExportCsv = new EventEmitter<void>();

  constructor(protected state: StateService,
              protected api: ApiService,
              protected dialog: MatDialog) {

    effect(() => {
      this.hasFailedOrders = !state.orders().some(
        order => order.orderNeedsAttention && order.integrationStatus != 'COMPLETED'
      );
    });
  }

  onSearch(value: string) {
    this.state.filter.update((filter) => ({
      ...filter,
      queryString: value,
    }));
  }

  onCleared() {
  }

  onReTriggerIntClick() {
    let orders = this.state.orders().filter(
      order => order.orderNeedsAttention && order.integrationStatus != 'COMPLETED'
    );

    const orderIds = orders.map(order => order.orderId).join(', ');

    this.dialog.open(ConfirmRequestComponent, {
      data: {
        header: 'Re-trigger Integration',
        message: `Re-trigger integration for the following orders? ${orderIds}`,
        disableCancel: false,
        onConfirm: () => {
          this.api.triggerIntegration(orders).subscribe({
            next: (value: any) => {
              this.dialog.open(OperationSuccessfulDialog);
            },
            error: (err) => {
              this.dialog.open(OperationFailedDialog);
            },
          });
        }
      }
    });
  }

  clearGlobalFilter() {
    this.state.globalFilterOrderId.set(null);
    this.state.resetAfterGlobalFilter()
  }


}
