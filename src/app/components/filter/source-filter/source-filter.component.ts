import { Component, effect, Input } from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatTooltip} from "@angular/material/tooltip";
import { StateService } from '../../../services/state.service';
import { FilterObject, ORDER_FILTER, OrderSource } from '../../../shared/interface';
import { MatIcon } from '@angular/material/icon';
import { filter } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';


@Component({
  selector: 'app-source-filter',
  imports: [MatButtonToggleGroup, MatButtonToggle, MatTooltip],
  styleUrl: './source-filter.component.scss',
  template: `
    <mat-button-toggle-group
      name="favoriteColor"
      [value]="selectedValue"
      (click)="onClicked($event)"
      (change)="onToggleChange($event)"
      [hideSingleSelectionIndicator]="true"
    >
      <mat-button-toggle [matTooltip]="'Show only Website orders'" value="website">
        Website
      </mat-button-toggle>

      <mat-button-toggle [matTooltip]="'Show only Order Entry orders'" value="oe"> OE </mat-button-toggle>

      <mat-button-toggle [matTooltip]="'Show only Pierless orders'" value="pierless"> Pierless </mat-button-toggle>

      <mat-button-toggle [matTooltip]="'Show only EDI orders'" value="edi"> EDI </mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class SourceFilterComponent {
  selectedValue: OrderSource = 'none';
  lastSelectedValue: OrderSource = 'none';

  constructor(
    protected state: StateService,
    protected localStorage: LocalStorageService,
  ) {}

  @Input()
  set filter(value: FilterObject) {
    this.selectedValue = value.orderSource;
    this.lastSelectedValue = this.selectedValue
  }

  onToggleChange(event: MatButtonToggleChange) {
    this.selectedValue = event.value as OrderSource;
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
      orderSource: this.selectedValue,
    }));

    const filterState = JSON.stringify(this.state.filter());
    this.localStorage.setItem(ORDER_FILTER, filterState);
  }
}
