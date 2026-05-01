import { Component } from '@angular/core';
import { SearchInput } from '../search-input/search-input';
import { StateService } from '../../services/state.service';
import { StatusFilterComponent } from './status-filter/status-filter.component';
import { SourceFilterComponent } from './source-filter/source-filter.component';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-filter',
  imports: [SearchInput, StatusFilterComponent, SourceFilterComponent, MatButton, MatTooltip, MatIcon],
  styleUrl: './filter.scss',
  template: `
    <div class="filter-container">
      <div class="filter-left">
        <app-search-input
          placeholder="Search..."
          [debounce]="400"
          [width]="'200'"
          (valueChange)="onSearch($event)"
          (cleared)="onCleared()"
        />

        <app-source-filter> </app-source-filter>

        <app-status-filter> </app-status-filter>
      </div>

      <div class="filter-right">
        <button mat-stroked-button  matTooltip="Re-trigger integration" (click)="onClick()">
          <mat-icon>refresh</mat-icon>
          Re-trigger Integration
        </button>
      </div>
    </div>
  `,
})
export class Filter {
  constructor(protected state: StateService) {}

  onSearch(value: string) {
    this.state.filter.update((filter) => ({
      ...filter,
      queryString: value,
    }));
  }

  onCleared() {
    console.log('Search cleared');
  }

  onClick() {

  }
}
