import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-info-warning-banner',
  imports: [MatIcon],
  styleUrl: './info-warning-banner.scss',
  template: `
    @if (message()) {
      <div class="attention-banner">
        <mat-icon class="warning-icon">warning</mat-icon>
        <p class="warning-text">{{ message() }}</p>
      </div>
    }
  `,
})
export class InfoWarningBanner {
  message = input<string | null | undefined>();
}
