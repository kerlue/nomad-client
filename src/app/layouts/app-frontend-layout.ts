import { Component } from '@angular/core';
import { Aggrid } from '../components/aggrid/aggrid';
import { Header } from '../components/header/header';
import { StateService } from '../services/state.service';
import { Status } from '../components/status/status';
import { InfoPanelComponent } from '../components/info-panel/info-panel.component';

@Component({
  selector: 'app-app-frontend-layout',
  imports: [Aggrid, Header, Status, InfoPanelComponent],
  styleUrl: './app-frontend-layout.scss',
  template: `
    <div class="layout">
      <!-- Side Nav-->
      <info-panel [selectedOrder]="this.state.selectedOrder()">
      </info-panel>

      <!-- Top Navigation -->
      <app-header></app-header>

      <!-- Status Bar -->
      <div class="status">
        <app-status></app-status>
      </div>

      <!-- Main Content -->
      <main class="content">
        <app-aggrid [orders]="this.state.orders()"
                    (onRowSelected) = "onRowSelected($event)"></app-aggrid>
      </main>
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
