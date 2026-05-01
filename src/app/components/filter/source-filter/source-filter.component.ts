import { Component, effect, Input } from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatTooltip} from "@angular/material/tooltip";
import { StateService } from '../../../services/state.service';
import { FilterObject, OrderSource } from '../../../shared/interface';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-source-filter',
  imports: [MatButtonToggleGroup, MatButtonToggle],
  styleUrl: './source-filter.component.scss',
  template: `
    <mat-button-toggle-group
      name="favoriteColor"
      [value]="selectedValue"
      (click)="onClicked($event)"
      (change)="onToggleChange($event)"
      [hideSingleSelectionIndicator]="true"
    >
      <mat-button-toggle value="website">
        Website
      </mat-button-toggle>

      <mat-button-toggle value="oe">
        OE
      </mat-button-toggle>

      <mat-button-toggle value="pierless">
        Pierless
      </mat-button-toggle>

      <mat-button-toggle value="edi">
        EDI
      </mat-button-toggle>

    </mat-button-toggle-group>
  `,
})
export class SourceFilterComponent {
  selectedValue: OrderSource = 'none';
  lastSelectedValue: OrderSource = 'none';

  constructor(protected state: StateService) {}


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
  }
}
