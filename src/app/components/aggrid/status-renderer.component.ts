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
  styleUrls: ['./status-renderer.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatStepperModule, MatIconModule],
  template: `
    <mat-stepper
      [linear]="false"
      class="order-stepper"
      [style]="getLineStyles()"
    >
      <ng-template matStepperIcon="number" let-index="index">
        <mat-icon
          class="step-icon"
          [class.partial-border]="steps[index]?.stepStatus === 'PARTIAL'"
          [style.background-color]="getStatusColor(steps[index]?.stepStatus)"
        >
          {{ getStepIcon(index) }}
        </mat-icon>
      </ng-template>

      @for (step of steps; track step) {
        <mat-step [editable]="false">
          <ng-template matStepLabel>{{ step.label }}</ng-template>
        </mat-step>
      }
    </mat-stepper>
  `
})
export class StatusRendererComponent implements ICellRendererAngularComp {

  stepIcons: string[] = [
    'package_2',
    'webhook',
    'database',
    'pin_drop',
    'local_shipping',
  ];

  protected steps: Step[] = [];

  agInit(params: ICellRendererParams): void {
    this.steps = this.getSteps(params.data);
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  protected getStepIcon(index: number): string {
    if (this.steps[index]?.stepStatus === 'ERROR') {
      return 'warning';
    }
    return this.stepIcons[index];
  }

  protected getStatusColor(status: Step['stepStatus'] | undefined): string {
    switch (status) {
      case 'COMPLETED': return '#4caf50';
      case 'PARTIAL':   return '#9e9e9e';
      case 'OPEN':      return '#9e9e9e';
      case 'ERROR':     return '#ff0000';
      default:          return 'transparent';
    }
  }

  protected getLineColor(index: number): string {
    const current = this.steps[index]?.stepStatus;
    if (current === 'ERROR'  ) return '#ff0000';
    if (current === 'COMPLETED' || current === 'PARTIAL') return '#4caf50';
    return '#9f9f9f';
  }

  protected getLineStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    for (let i = 0; i < this.steps.length - 1; i++) {
      styles[`--line-${i}-color`] = this.getLineColor(i);
    }
    return styles;
  }

  private getSteps(order: Orders): Step[] {
    return [
      { key: 'SOURCE',      label: order.source,   stepStatus: 'COMPLETED', complete: true },
      { key: 'ERP',         label: 'Dynamics',     stepStatus: order.erpIntegrated ? 'COMPLETED' : 'OPEN', complete: false },
      { key: 'INTEGRATION', label: 'Integrated',   stepStatus: order.integrationStatus, complete: false },
      { key: 'ROUTED',      label: 'Routed',       stepStatus: order.routedAt ? 'COMPLETED' : 'OPEN', complete: false },
      { key: 'SHIPPED',     label: 'Shipped',      stepStatus: order.invoicedAt ? 'COMPLETED' : 'OPEN', complete: true },
    ];
  }
}
