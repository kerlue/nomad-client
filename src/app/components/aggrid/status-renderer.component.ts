import { Component } from '@angular/core';
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
  imports: [CommonModule, MatStepperModule, MatIconModule],
  template: `
    <mat-stepper
      [linear]="false"
      class="order-stepper"
    >
      <!-- Override the default number icons -->
      <ng-template matStepperIcon="number" let-index="index">
        <mat-icon
          class="step-icon"
          [style.background-color]="getStatusColor(steps[index]?.stepStatus)"
        >
          {{ getStepIcon(index) }}
        </mat-icon>
      </ng-template>

      @for (step of steps; track step) {
        <mat-step [editable]="false">
          <ng-template matStepLabel>
            {{ step.label }}
          </ng-template>
        </mat-step>
      }
    </mat-stepper>
  `
})
export class StatusRendererComponent implements ICellRendererAngularComp {

  stepIcons: string[] = [
    'package_2',              // SOURCE
    'webhook',                // ERP
    'database',            // INTEGRATION
    'pin_drop',           // ROUTED
    'local_shipping',     // SHIPPED
  ];

  protected steps: Step[] = [];

  agInit(params: ICellRendererParams): void {
    this.steps = this.getSteps(params.data);

    console.log(params.data);
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
      case 'COMPLETED':
        return '#4caf50';   // green
      case 'PARTIAL':
        return '#ff9800';   // orange/amber
      case 'OPEN':
        return '#9e9e9e';   // grey
      case 'ERROR':
        return '#ff0000';   // red
      default:
        return 'transparent';
    }
  }

  private getSteps(order: Orders): Step[] {
    const steps: Step[] = [];

    steps.push({
      key: 'SOURCE',
      label: order.source,
      stepStatus: 'COMPLETED',
      complete: true,
    });

    steps.push({
      key: 'ERP',
      label: 'Dynamics',
      stepStatus:order.erpIntegrated ? 'COMPLETED' : 'OPEN',
      complete: false,
    });

    steps.push({
      key: 'INTEGRATION',
      label: 'Integrated',
      stepStatus: order.integrationStatus,
      complete: false,
    });

    steps.push({
      key: 'ROUTED',
      label: 'Routed',
      stepStatus: 'OPEN',
      complete: false,
    });

    steps.push({
      key: 'SHIPPED',
      label: 'Shipped',
      stepStatus: 'OPEN',
      complete: true,
    });

    return steps;
  }
}
