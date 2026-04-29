import { Component } from '@angular/core';
import { Aggrid } from '../components/aggrid/aggrid';
import { GridStatus } from '../shared/interface';
import { Header } from '../components/header/header';
import { StateService } from '../services/state.service';
import { Status } from '../components/status/status';

@Component({
  selector: 'app-app-frontend-layout',
  imports: [Aggrid, Header, Status],
  styleUrl: './app-frontend-layout.scss',
  template: `
    <div class="layout">
      <!-- Top Navigation -->
      <app-header></app-header>

      <!-- Status Bar -->
      <div class="status">
        <app-status></app-status>
      </div>

      <!-- Main Content -->
      <main class="content">
        <app-aggrid [orders]="this.state.orders()" [status]="GridStatus.Pending"></app-aggrid>
        <!--<app-aggrid [status]= 'GridStatus.Completed'></app-aggrid> -->
        <!--<app-aggrid [status]= 'GridStatus.ActionRequired'></app-aggrid>-->
      </main>
    </div>
  `,
})
export class AppFrontendLayout {
  protected readonly GridStatus = GridStatus;

  constructor(protected state: StateService) {}
}
