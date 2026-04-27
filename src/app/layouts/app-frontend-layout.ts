import { Component } from '@angular/core';
import { Aggrid } from '../components/aggrid/aggrid';
import { GridStatus } from '../shared/interface';
import { Header } from '../components/header/header';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-app-frontend-layout',
  imports: [Aggrid, Header],
  styleUrl: './app-frontend-layout.scss',
  template: `
    <div class="layout">
      <!-- Top Navigation -->
      <app-header></app-header>

      <!-- Status Bar -->
      <div class="status">
        <span>Status: Connected</span>
      </div>

      <!-- Main Content -->
      <main class="content">
        <app-aggrid [orders]="this.state.orders()" [status]= 'GridStatus.Pending'></app-aggrid>
        <!--<app-aggrid [status]= 'GridStatus.Completed'></app-aggrid> -->
        <app-aggrid [status]= 'GridStatus.ActionRequired'></app-aggrid>
      </main>

    </div>
  `
})
export class AppFrontendLayout {
  protected readonly GridStatus = GridStatus;

  constructor(protected state: StateService) {
  }
}
