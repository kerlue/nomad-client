import {Component, Input, ViewChild, ElementRef, HostListener, Output, EventEmitter} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import { Orders } from '../../shared/interface';
import { StateService } from '../../services/state.service';
import { OrderTreeDiagram } from './order-tree-diagram/order-tree-diagram';

@Component({
  selector: 'info-panel',
  imports: [MatIcon, MatIconButton, OrderTreeDiagram],
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
          <span class="popover-title">Column Editor</span>
          <button mat-icon-button (click)="close()" aria-label="Close">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="popover-body">
          <!-- Column editor content goes here -->
          <app-order-tree-diagram></app-order-tree-diagram>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class InfoPanelComponent {
  @ViewChild('popoverHost') popoverHost!: ElementRef;

  isOpen = false;
  @Input() protected _selectedOrder!: Orders | null;

  @Input()
  set selectedOrder(value: Orders | null) {
    this._selectedOrder = value;
    this.isOpen = value !== null;
  }

  constructor(protected state: StateService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && this.popoverHost && !this.popoverHost.nativeElement.contains(event.target)) {
      this.close();
      this.state.selectedOrder.set(null);
    }
  }

  close(): void {
    this.isOpen = false;
    this.state.selectedOrder.set(null);
  }
}
