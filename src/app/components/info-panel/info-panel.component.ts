import {Component, Input, ViewChild, ElementRef, HostListener, Output, EventEmitter} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import { Orders } from '../../shared/interface';
import { StateService } from '../../services/state.service';
import { OrderTreeDiagram } from '../info-tree-diagram/order-tree-diagram';
import { InfoTab } from '../info-tab/info-tab';

@Component({
  selector: 'info-panel',
  imports: [MatIcon, MatIconButton, MatTabsModule, OrderTreeDiagram, InfoTab],
  styleUrl: './info-panel.component.scss',
  template: `
    <!-- Dark overlay -->
    <div
      class="popover-overlay"
      [class.popover-overlay-visible]="isOpen"
      (click)="close()"
      aria-hidden="true"
    ></div>

    <div class="popover-host" #popoverHost>
      <!-- Popover panel -->
      <div
        class="popover-panel"
        [class.popover-visible]="isOpen"
        role="dialog"
        aria-label="Column Editor"
      >
        <div class="popover-header">
          <span class="popover-title">
             {{ this._selectedOrder?.orderId }}
            - {{ this._selectedOrder?.customerName }}
          </span>
          <button mat-icon-button (click)="close()" aria-label="Close">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="popover-body">
          @if (isOpen) {
            <app-info-tab></app-info-tab>
          }
        </div>
      </div>
    </div>
  `,
})
export class InfoPanelComponent {
  @ViewChild('popoverHost') popoverHost!: ElementRef;

  isOpen = false;
  protected _selectedOrder!: Orders | null;

  @Input()
  set selectedOrder(value: Orders | null) {
    this._selectedOrder = value;
    this.isOpen = value !== null;
  }

  constructor(protected state: StateService) {}


  close(): void {
    this.isOpen = false;
    this.state.selectedOrder.set(null);
  }
}
