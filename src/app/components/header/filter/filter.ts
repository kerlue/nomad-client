import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import {MatIcon} from "@angular/material/icon";

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
        <input matInput [matDatepicker]="picker" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>{{ label }}</mat-label>

        <mat-select
          [value]="getSelectedValue()"
          (selectionChange)="onSelect($event.value)"
          [multiple]="multiSelect"
        >
          @for (value of _values; track value) {
            <mat-option [value]="value">{{ value }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
})
export class Filter {
  picker: any;

  @Output() valueSelected = new EventEmitter<string>();
  @Output() multiValuesSelected = new EventEmitter<string[]>();
  @Input() label!: string;
  @Input() multiSelect: boolean = false;
  protected _values: string[] = [];
  protected _defaultValue!: string;

  constructor() {}

  @Input()
  set defaultValue(value: string) {
    this._defaultValue = value;
  }

  @Input()
  set values(values: string[]) {
    this._values = values;
  }

  onSelect(selectedValue: string | string[]) {
    if (Array.isArray(selectedValue)) {
      this.multiValuesSelected.emit(selectedValue);
    } else {
      this.valueSelected.emit(selectedValue);
    }
  }

  getSelectedValue() {
    return this._values[this._values.findIndex((val) => val == this._defaultValue) ?? 0];
  }

  searchAllOrders() {

  }
}
