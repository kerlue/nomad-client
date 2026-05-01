import { Component, Input } from '@angular/core';
import { DashboardStat, StatItem } from '../../../shared/interface';

@Component({
  selector: 'app-stat-card',
  imports: [],
  styleUrl: './stat-card.scss',
  template: `
    <article class="card" [style.--accent]="stat.accentColor">
      <!-- ── Header ─────────────────────────────── -->
      <header class="card-header">
        <img [src]="stat.headerIcon" />
        <span class="card-title">{{ stat.title }}</span>
      </header>

      <!-- ── Stat rows ───────────────────────────── -->
      <div class="stat-grid">
        @for (item of stat.stats; track item.label) {
          <div class="stat-meta">
            <span class="row-label" [class.error]="hasError(item, stat)">{{ item.label }}</span>
            <span class="row-value">{{ item.value }}</span>
          </div>
        }
      </div>
    </article>
  `,
})
export class StatCard {
  @Input({ required: true }) stat!: DashboardStat;

  trendIcon(trend?: string): string {
    if (trend === 'up') return 'trending_up';
    if (trend === 'down') return 'trending_down';
    return 'remove';
  }

  hasError(item: StatItem, stat: DashboardStat) {

    //Last sync checker
    const isLastSynced = stat.title === "Last Synced";
    const lastSec = Number(String(item.value).replace(/[^0-9.-]/g, ""));
    const isStale = lastSec > 2 * 60;
    if (isLastSynced && isStale) return true;

    //Average integration time
    const isAvgIntSynced = stat.title === "Avg. Integration Time";
    const AvgLastSec = Number(String(item.value).replace(/[^0-9.-]/g, ""));
    const isAvgStale = AvgLastSec > 2 * 60;
    if (isAvgIntSynced && isAvgStale) return true;


    //Check if label has error
    return item.label.toLowerCase().includes('error');
  }
}
