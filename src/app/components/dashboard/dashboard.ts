import { Component, Input } from '@angular/core';
import { StatCard } from './stat-card/stat-card';
import { Stats } from '../../shared/interface';

@Component({
  selector: 'app-dashboard',
  imports: [StatCard],
  styleUrl: './dashboard.scss',
  template: `
    <div class="dashboard">
      <div class="card-grid">
        @for (item of stats; track item.title; let i = $index) {
          <app-stat-card [stat]="item" [style.animation-delay]="i * 55 + 'ms'" />
        }
      </div>
    </div>
  `,
})
export class Dashboard {
  @Input() stats: Stats[] = [];
}
