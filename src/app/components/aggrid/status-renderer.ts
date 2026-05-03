import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { IntegrationStatus, Orders } from '../../shared/interface';

interface Step {
  label: string;
  complete: boolean;
  key: 'SOURCE' | 'ERP' | 'INTEGRATION' | 'ROUTED' | 'SHIPPED';
  stepStatus: IntegrationStatus;
}

@Component({
  selector: 'app-order-status-renderer',
  styleUrls: ['./status-renderer.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatStepperModule, MatIconModule],
  template: `
    <mat-stepper [linear]="false" class="order-stepper" [style]="getLineStyles()">
      <ng-template matStepperIcon="number" let-index="index">
        <mat-icon
          class="step-icon"
          [class.partial-border]="steps[index]?.stepStatus === 'PARTIAL'"
          [style.background-color]="getStatusColor(steps[index])"
        >
          {{ getStepIcon(index, steps) }}
        </mat-icon>
      </ng-template>

      @for (step of steps; track step.key) {
        <mat-step [editable]="false">
          <ng-template matStepLabel>{{ step.label }}</ng-template>
        </mat-step>
      }
    </mat-stepper>
  `,
})
export class StatusRenderer implements ICellRendererAngularComp {

  protected steps: Step[] = [];

  agInit(params: ICellRendererParams): void {
    this.steps = this.getSteps(params.data);
  }

  refresh(params: ICellRendererParams): boolean {
    this.steps = this.getSteps(params.data);
    return true;
  }

  protected getStepIcon(index: number, status: Step[]): string {
    const stepIcons: string[] = ['package_2', 'webhook', 'database', 'pin_drop', 'local_shipping'];
    let step = status[index]
    return step.stepStatus == 'ERROR' ? 'cancel' : stepIcons[index];
  }

  protected getStatusColor(step: Step | undefined): string {
    const status = step?.stepStatus
    switch (status) {
      case 'COMPLETED':
        return '#4caf50';
      case 'PARTIAL':
        return '#9e9e9e';
      case 'PENDING':
        return '#9e9e9e';
      case 'ERROR':
        return '#ff0000';
      default:
        return 'transparent';
    }
  }

  protected getLineStyles(): Record<string, string> {
    //See style for lines
    const styles: Record<string, string> = {};
    for (let i = 0; i < this.steps.length - 1; i++) {
      styles[`--line-${i}-color`] = this.getStatusColor(this.steps[i]);
    }
    return styles;
  }

  private getSteps(order: Orders): Step[] {
    const pendingOrError = (): IntegrationStatus =>
      order.orderNeedsAttention ? 'ERROR' : 'PENDING';

    return [
      { key: 'SOURCE', label: order.source, stepStatus: 'COMPLETED', complete: true },
      {
        key: 'ERP',
        label: 'Dynamics',
        stepStatus: order.erpIntegrated ? 'COMPLETED' : pendingOrError(),
        complete: false,
      },
      {
        key: 'INTEGRATION',
        label: 'Integrated',
        stepStatus:
          order.integrationStatus === 'PENDING' ? pendingOrError() : order.integrationStatus,
        complete: false,
      },
      {
        key: 'ROUTED',
        label: 'Routed',
        stepStatus: order.routedAt ? 'COMPLETED' : pendingOrError(),
        complete: false,
      },
      {
        key: 'SHIPPED',
        label: 'Shipped',
        stepStatus: order.invoicedAt ? 'COMPLETED' : pendingOrError(),
        complete: true,
      },
    ];
  }
}
