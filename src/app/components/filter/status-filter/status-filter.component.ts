import { Component, effect, Input } from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatTooltip} from "@angular/material/tooltip";
import { StateService } from '../../../services/state.service';
import { FilterObject, ORDER_FILTER, OrderStatus } from '../../../shared/interface';
import { MatIcon } from '@angular/material/icon';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-status-filter',
  imports: [MatButtonToggleGroup, MatButtonToggle, MatTooltip, MatIcon],
  styleUrl: './status-filter.component.scss',
  template: `
    <mat-button-toggle-group
      name="favoriteColor"
      [value]="selectedValue"
      (click)="onClicked($event)"
      (change)="onToggleChange($event)"
      [hideSingleSelectionIndicator]="true"
    >
      <mat-button-toggle [matTooltip]="'Show Orders NOT in Dynamics'" value="dynamics">
        <mat-icon>webhook</mat-icon>
        Dynamics
      </mat-button-toggle>

      <mat-button-toggle [matTooltip]="'Show Orders NOT integrated'" value="integrated">
        <mat-icon>database</mat-icon>
        Integrated
      </mat-button-toggle>

      <mat-button-toggle [matTooltip]="'Show Orders NOT routed'" value="routed">
        <mat-icon>pin_drop</mat-icon>
        Routed
      </mat-button-toggle>

      <mat-button-toggle [matTooltip]="'Show Orders NOT shipped'" value="shipped">
        <mat-icon>local_shipping</mat-icon>
        Shipped
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class StatusFilterComponent {
  selectedValue: OrderStatus = 'none';
  lastSelectedValue: OrderStatus = 'none';

  constructor(protected state: StateService,
              protected localStorage: LocalStorageService) {}

  @Input()
  set filter(value: FilterObject) {
    this.selectedValue = value.orderStatus;
    this.lastSelectedValue = this.selectedValue
  }

  onToggleChange(event: MatButtonToggleChange) {
    this.selectedValue = event.value as OrderStatus;
  }

  onClicked($event: MouseEvent) {
    if (this.selectedValue == this.lastSelectedValue) {
      this.selectedValue = 'none';
      this.lastSelectedValue = 'none';
    } else {
      this.lastSelectedValue = this.selectedValue;
    }

    this.state.filter.update((filter) => ({
      ...filter,
      orderStatus: this.selectedValue,
    }));

    const filterState = JSON.stringify(this.state.filter())
    this.localStorage.setItem(ORDER_FILTER, filterState);
  }
}
