import { Component } from '@angular/core';
import { Filter } from './filter/filter';
import { StateService } from '../../services/state.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { HeaderStateService } from './header-state.service';

@Component({
  selector: 'app-header',
  imports: [Filter, MatProgressBar],
  styleUrl: './header.scss',
  template: `
    <div class="header">
      <div class="header__brand">
        <img class="header__logo" src="/favicon.ico" alt="logo" />
        <span class="header__app-name">NOMAD</span>
      </div>
      <app-filter
        [shippingDate]="this.state.shippingDate()"
        [selectedWarehouse]="this.state.selectedWarehouse()"
        [warehouses]="this.state.warehouseDropdownList()"
      >
      </app-filter>

      <div class="buffer-bar-container">
        <mat-progress-bar
          class="buffer-bar"
          [class.visible]="this.header.showBuffering()"
          mode="buffer"
        />
      </div>
    </div>
  `,
})
export class Header {
  constructor(protected header: HeaderStateService,
              protected state: StateService) {}
}
