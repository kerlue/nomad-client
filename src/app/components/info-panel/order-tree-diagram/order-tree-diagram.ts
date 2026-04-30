import {
  NgDiagramComponent,
  NgDiagramConfig,
  NgDiagramEdgeTemplateMap,
  initializeModel,
  provideNgDiagram, ModelAdapter
} from 'ng-diagram';
import { BrokenEdgeComponent } from './broken-edge';
import { Orders } from '../../../shared/interface';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  runInInjectionContext,
  EnvironmentInjector
} from '@angular/core';
import { SuccessEdgeComponent } from './success-edge';

@Component({
  imports: [NgDiagramComponent],
  selector: 'app-order-tree-diagram',
  providers: [provideNgDiagram()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-diagram
      [model]="model"
      [config]="config"
      [edgeTemplateMap]="edgeTemplateMap"
    />
  `,
  styles: `
    :host {
      display: flex;
      height: 650px;
    }

    :host {
      --ngd-port-background-color: transparent;
      --ngd-port-background-color-hover: transparent;
      --ngd-port-border-color: transparent;
    }
  `,
})
export class OrderTreeDiagram {
  config: NgDiagramConfig = {
    nodeDraggingEnabled: false,
    viewportPanningEnabled: false,
    hideWatermark: true,
    zoom: { step: 0 },
  };

  edgeTemplateMap = new NgDiagramEdgeTemplateMap([
    ['broken', BrokenEdgeComponent],
    ['success', SuccessEdgeComponent],
  ]);

  model!: ModelAdapter;

  constructor(private cdr: ChangeDetectorRef,
              private injector: EnvironmentInjector) {}

  @Input()
  set selectedOrder(order: Orders | null) {
    if (!order) return;

    runInInjectionContext(this.injector, () => {
      this.model = initializeModel({
        nodes: [
          { id: '1', draggable: false, resizable: false, rotatable: false, position: { x: 5,   y: 150 }, data: { label: order.source } },
          { id: '2', draggable: false, resizable: false, rotatable: false, position: { x: 300, y: 150 }, data: { label: 'Dynamics'} },
          { id: '3', draggable: false, resizable: false, rotatable: false, position: { x: 700, y: 50  }, data: { label: 'Intra' } },
          { id: '4', draggable: false, resizable: false, rotatable: false, position: { x: 700, y: 150 }, data: { label: 'HJump' } },
          { id: '5', draggable: false, resizable: false, rotatable: false, position: { x: 700, y: 250 }, data: { label: 'Driver' } },

          { id: '6', draggable: false, resizable: false, rotatable: false, position: { x: 900, y: 50  }, data: { label: 'Wave' } },
        ],
        edges: [
          { id: '1', targetArrowhead: 'ng-diagram-arrow', source: '1', target: '2', type: 'broken', data: {} },
          { id: '2', targetArrowhead: 'ng-diagram-arrow', source: '2', target: '3', data: {} },
          { id: '3', targetArrowhead: 'ng-diagram-arrow', source: '2', target: '4', type: 'success', data: {} },
          { id: '4', targetArrowhead: 'ng-diagram-arrow', source: '2', target: '5', data: {} },
          { id: '5', targetArrowhead: 'ng-diagram-arrow', source: '3', target: '6', data: {} },
        ],
      });
    });

    this.cdr.detectChanges();
  }
}
