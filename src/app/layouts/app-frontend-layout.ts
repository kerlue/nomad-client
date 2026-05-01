import { Component } from '@angular/core';
import { Aggrid } from '../components/aggrid/aggrid';
import { Header } from '../components/header/header';
import { StateService } from '../services/state.service';
import { Status } from '../components/status/status';
import { InfoPanelComponent } from '../components/info-panel/info-panel.component';
import { Filter } from '../components/filter/filter';


@Component({
  selector: 'app-app-frontend-layout',
  imports: [Aggrid, Header, Status, InfoPanelComponent, Filter],
  styleUrl: './app-frontend-layout.scss',
  template: `
    <div class="layout">
      <!-- Side Nav-->
      <info-panel [selectedOrder]="this.state.selectedOrder()"></info-panel>
      <!-- Top Navigation -->
      <app-header></app-header>
      <!-- Status Bar -->
      <app-status></app-status>
      <!-- Status Bar -->
      <app-filter></app-filter>
      <!-- Main Content -->
      <app-aggrid [orders]="this.state.orders()"
                  [filter]="this.state.filter()"
                  (onRowSelected) = "onRowSelected($event)"></app-aggrid>
    </div>
  `,
})
export class AppFrontendLayout {
  protected showInfoPanel: number = 0;
  constructor(protected state: StateService) {}

  onRowSelected(event: any) {
    this.showInfoPanel++;
  }

}
