import { Component } from '@angular/core';
import { Aggrid } from '../components/aggrid/aggrid';
import { Header } from '../components/header/header';
import { StateService } from '../services/state.service';
import { InfoPanelComponent } from '../components/info-panel/info-panel.component';
import { OrderFilter } from '../components/filter/order-filter';
import { Dashboard } from '../components/dashboard/dashboard';


@Component({
  selector: 'app-app-frontend-layout',
  imports: [Aggrid, Header, InfoPanelComponent, OrderFilter, Dashboard],
  styleUrl: './app-frontend-layout.scss',
  template: `
    <div class="layout">
      <!-- Side Nav-->
      <info-panel [selectedOrder]="this.state.selectedOrder()"></info-panel>
      <!-- Top Navigation -->
      <app-header></app-header>
      <!-- Status Bar -->
      <app-dashboard></app-dashboard>
      <!-- Status Bar -->
      <app-order-filter (onExportCsv)="onExportCsv = onExportCsv + 1"></app-order-filter>
      <!-- Main Content -->
      <app-aggrid
        [orders]="this.state.orders()"
        [filter]="this.state.filter()"
        [onExportCsv]="onExportCsv"
        (onRowSelected)="onRowSelected($event)"
      ></app-aggrid>
    </div>
  `,
})
export class AppFrontendLayout {
  protected showInfoPanel: number = 0;
  protected onExportCsv: number = 0;
  constructor(protected state: StateService) {}

  onRowSelected(event: any) {
    this.showInfoPanel++;
  }
}
