import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

export type OrderStatus =
  | 'OE'
  | 'DYNAMICS'
  | 'INTEGRATION'
  | 'ROUTED'
  | 'SHIPPED';

const PIPELINE_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'OE',          label: 'OE' },
  { key: 'DYNAMICS',    label: 'Dynamics' },
  { key: 'INTEGRATION', label: 'Integrated' },
  { key: 'ROUTED',      label: 'Routed' },
  { key: 'SHIPPED',     label: 'Shipped' },
];

@Component({
  selector: 'app-order-status-renderer',
  styleUrls: ['./order-status-renderer.component.scss'],
  standalone: true,
  imports: [CommonModule, MatStepperModule, MatIconModule],
  template: `
    <mat-stepper
      [selectedIndex]="selectedIndex"
      [linear]="false"
      class="order-stepper"
    >
      @for (step of steps; track step) {
        <mat-step
          [completed]="step.complete"
          [editable]="false"
        >
          <ng-template matStepLabel>
            {{ step.label }}
          </ng-template>
        </mat-step>
      }
    </mat-stepper>
  `
})
export class OrderStatusRendererComponent implements ICellRendererAngularComp {
  steps: { key: OrderStatus; label: string; complete: boolean }[] = [];
  selectedIndex = 0;

  agInit(params: ICellRendererParams): void {
    this.setSteps(params.value as OrderStatus);
  }

  refresh(params: ICellRendererParams): boolean {
    this.setSteps(params.value as OrderStatus);
    return true;
  }

  private setSteps(currentStatus: OrderStatus): void {
    const currentIndex = PIPELINE_STEPS.findIndex(s => s.key === currentStatus);
    this.selectedIndex = currentIndex >= 0 ? currentIndex : 0;
    this.steps = PIPELINE_STEPS.map((step, i) => ({
      ...step,
      complete: i <= currentIndex,
    }));
  }
}
