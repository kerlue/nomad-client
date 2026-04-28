import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export type OrderStatus =
  | 'OE'
  | 'DYNAMICS'
  | 'INTEGRATION'
  | 'ROUTED'
  | 'SHIPPED';

const PIPELINE_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'OE', label: 'OE' },
  { key: 'DYNAMICS', label: 'Dynamics' },
  { key: 'INTEGRATION', label: 'Integration' },
  { key: 'ROUTED', label: 'Routed' },
  { key: 'SHIPPED', label: 'Shipped' },
];

@Component({
  selector: 'app-order-status-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pipeline-wrapper">
      <ng-container *ngFor="let step of steps; let i = index; let last = last">
        <div class="step" [class.complete]="step.complete" [class.active]="step.active">
          <div class="step-icon">
            <ng-container *ngIf="step.complete; else pending">
              <svg class="check" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="#22c55e"/>
                <path d="M4.5 8.2L6.8 10.5L11.5 5.5" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </ng-container>
            <ng-template #pending>
              <svg class="circle-pending" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7.5" stroke="#d1d5db" stroke-width="1"/>
                <circle cx="8" cy="8" r="3" fill="#d1d5db"/>
              </svg>
            </ng-template>
          </div>
          <span class="step-label" [class.label-complete]="step.complete">{{ step.label }}</span>
        </div>

        <div *ngIf="!last" class="connector" [class.connector-complete]="step.complete"></div>
      </ng-container>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .pipeline-wrapper {
      display: flex;
      align-items: center;
      gap: 0;
      padding: 0 4px;
      height: 100%;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
    }

    .step-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
    }

    .check,
    .circle-pending {
      width: 16px;
      height: 16px;
    }

    .step-label {
      font-size: 9px;
      font-family: 'DM Mono', 'Roboto Mono', 'Courier New', monospace;
      font-weight: 500;
      color: #9ca3af;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      white-space: nowrap;
      line-height: 1;
    }

    .step-label.label-complete {
      color: #16a34a;
      font-weight: 600;
    }

    .connector {
      width: 16px;
      height: 2px;
      background: #e5e7eb;
      flex-shrink: 0;
      margin-bottom: 12px;
      border-radius: 1px;
      transition: background 0.2s ease;
    }

    .connector-complete {
      background: #22c55e;
    }
  `],
})

export class OrderStatusRendererComponent implements ICellRendererAngularComp {
  steps: { key: OrderStatus; label: string; complete: boolean; active: boolean }[] = [];

  agInit(params: ICellRendererParams): void {
    this.setSteps(params.value as OrderStatus);
  }

  refresh(params: ICellRendererParams): boolean {
    this.setSteps(params.value as OrderStatus);
    return true;
  }

  private setSteps(currentStatus: OrderStatus): void {
    const currentIndex = PIPELINE_STEPS.findIndex(s => s.key === currentStatus);
    this.steps = PIPELINE_STEPS.map((step, i) => ({
      ...step,
      complete: i <= currentIndex,
      active: i === currentIndex,
    }));
  }
}
