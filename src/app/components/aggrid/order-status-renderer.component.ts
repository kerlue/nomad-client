import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

export type OrderStatus =
  | 'OE'
  | 'ECOM'
  | 'DYNAMICS'
  | 'INTEGRATION'
  | 'ROUTED'
  | 'SHIPPED';

const PIPELINE_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'OE',          label: 'Order Entry' },
  { key: 'ECOM',       label: 'Website' },
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
      [linear]="false"
      class="order-stepper"
    >
      <!-- Override the default number icons -->
      <ng-template matStepperIcon="number" let-index="index">
        <mat-icon>{{ stepIcons[index] }}</mat-icon>
      </ng-template>

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

  stepIcons: string[] = [
    'shopping_cart',   // Step 1
    'local_shipping',  // Step 2
    'payment',         // Step 3
    'check_circle',    // Step 4
    'check_circle',    // Step 4
  ];

  agInit(params: ICellRendererParams): void {
    this.setSteps(params.value as OrderStatus);

    console.log(params.data)
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
    }));
  }
}
