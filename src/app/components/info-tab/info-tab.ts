import { Component } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { OrderTreeDiagram } from '../info-tree-diagram/order-tree-diagram';
import { MatIcon } from '@angular/material/icon';
import { StateService } from '../../services/state.service';
import { InfoOrderDetails } from '../info-order-details/info-order-details';
import { InfoTimeline } from '../info-timeline/info-timeline';

@Component({
  selector: 'app-info-tab',
  imports: [
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    OrderTreeDiagram,
    InfoOrderDetails,
    MatTabContent,
    InfoTimeline,
  ],
  styleUrl: './info-tab.scss',
  template: `
    <mat-tab-group
      [(selectedIndex)]="activeTab"
      animationDuration="200ms"
      mat-stretch-tabs="false"
      mat-align-tabs="start"
    >
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon class="tab-icon">account_tree</mat-icon>
          Overview
        </ng-template>
        <ng-template matTabContent>
          <app-info-tree-diagram [selectedOrder]="state.selectedOrder()"></app-info-tree-diagram>
        </ng-template>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon class="tab-icon">schedule</mat-icon>
          Timeline
        </ng-template>
        <ng-template matTabContent>
          <app-info-timeline [selectedOrder]="state.selectedOrder()"></app-info-timeline>
        </ng-template>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon class="tab-icon">receipt_long</mat-icon>
          Logs
        </ng-template>
        <ng-template matTabContent>
          <p>todo: Fetch logs from t_api_logs.</p>
        </ng-template>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon class="tab-icon">info</mat-icon>
          Order Details
        </ng-template>
        <ng-template matTabContent>
          <app-info-order-details [selectedOrder]="state.selectedOrder()"></app-info-order-details>
        </ng-template>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class InfoTab {
  constructor(protected state: StateService) {}

  activeTab = 0;
}
