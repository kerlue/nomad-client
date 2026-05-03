import { Component, Input } from '@angular/core';
import { Stats, StatItem } from '../../../shared/interface';

@Component({
  selector: 'app-stat-card',
  imports: [],
  styleUrl: './stat-card.scss',
  template: `
    <article class="card">
      <header class="card-header">
        <img [src]="getImage(stat.position)" />
        <span class="card-title">{{ stat.title }}</span>
      </header>

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
  @Input({ required: true }) stat!: Stats;

  hasError(item: StatItem, stat: Stats) {

    //Last sync checker
    const isLastSynced = stat.title === "Query Latency";
    const lastSec = Number(String(item.value).replace(/[^0-9.-]/g, ""));
    const isStale = lastSec > 12.0 // if more than 15sec warn

    if (isLastSynced && isStale) return true;

    //Average integration time
    const isAvgIntSynced = stat.title === "Avg. Integration Time";
    const avgLastSec = Number(String(item.value).replace(/[^0-9.-]/g, ""));
    const isAvgStale = avgLastSec > 2 * 60; //2minutes

    if (isAvgIntSynced && isAvgStale) return true;

    //Check if label has error
    return item.label.toLowerCase().includes('error');
  }

  getImage(position: number) {
    if(position == 0){
      return "trending_up.svg"
    }
    else if(position == 1){
      return "info.svg"
    }
    else if(position == 2){
      return "timelapse.svg"
    }
    else if(position == 3){
      return "database_search.svg"
    }


    return ""
  }
}
