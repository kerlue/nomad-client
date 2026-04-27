import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import {MatIcon} from "@angular/material/icon";
import { StateService } from '../../../services/state.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  styleUrl: './filter.scss',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatIcon,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <div class="container">
      <button (click)="searchAllOrders()" mat-stroked-button>
        <mat-icon>search</mat-icon>
        Search Orders
      </button>

      <mat-form-field appearance="outline">
        <mat-label>Shipping Date</mat-label>
        <input
          matInput
          [(ngModel)]="shippingDate"
          [matDatepicker]="picker"
          (dateChange)="onDateChangedEvent('change', $event)"
        />

        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Warehouse</mat-label>
        <mat-select
          [value]="getSelectedValue()"
          (selectionChange)="onSelect($event.value)"
          [multiple]="'false'"
        >
          @for (value of warehouses; track value) {
            <mat-option [value]="value">{{ value }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
})
export class Filter {
  @Output() valueSelected = new EventEmitter<string>();
  @Output() multiValuesSelected = new EventEmitter<string[]>();
  @Input() label!: string;
  @Input() warehouses!: string[];
  @Input() selectedWarehouse!: string;
  @Input() shippingDate!: Date;

  constructor(protected state: StateService) {}

  onSelect(selectedValue: string) {
    this.state.selectedWarehouse.set(selectedValue);
  }

  getSelectedValue() {
    return this.warehouses[this.warehouses.findIndex((val) => val == this.selectedWarehouse) ?? 0];
  }

  searchAllOrders() {}

  onDateChangedEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.state.shippingDate.set(event.value ?? new Date(1900, 0, 1));
  }
}
