import {
  NgDiagramComponent,
  NgDiagramConfig,
  NgDiagramEdgeTemplateMap,
  initializeModel,
  provideNgDiagram, ModelAdapter
} from 'ng-diagram';
import { BrokenEdgeComponent } from './edges/broken-edge';
import { Orders } from '../../shared/interface';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  runInInjectionContext,
  EnvironmentInjector
} from '@angular/core';
import { SuccessEdgeComponent } from './edges/success-edge';

@Component({
  imports: [NgDiagramComponent],
  selector: 'app-info-tree-diagram',
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
      height: 550px;

      --ngd-port-background-color: transparent;
      --ngd-port-background-color-hover: transparent;
      --ngd-port-border-color: transparent;
    }
  `,
})
export class OrderTreeDiagram {

  model!: ModelAdapter;

  config: NgDiagramConfig = {
    nodeDraggingEnabled: false,
    viewportPanningEnabled: false,
    hideWatermark: true,
    zoom: { step: 0 },
    linking: { validateConnection: () => false },
  };

  edgeTemplateMap = new NgDiagramEdgeTemplateMap([
    ['broken', BrokenEdgeComponent],
    ['success', SuccessEdgeComponent],
  ]);


  constructor(private cdr: ChangeDetectorRef,
              private injector: EnvironmentInjector) {}


  @Input()
  set selectedOrder(order: Orders | null) {
    if (!order) return;
    const offset = { x: 20, y: 0 };

    runInInjectionContext(this.injector, () => {
      this.model = initializeModel({
        nodes: [
          { id: 'source',   draggable: false, resizable: false, rotatable: false, position: { x: offset.x + 5,   y: offset.y + 250 }, data: { label: order.source } },
          { id: 'dynamics', draggable: false, resizable: false, rotatable: false, position: { x: offset.x + 250, y: offset.y + 250 }, data: { label: 'Dynamics' } },
          { id: 'intranet', draggable: false, resizable: false, rotatable: false, position: { x: offset.x + 500, y: offset.y + 250 }, data: { label: 'IntranetDB' } },
          { id: 'wave',     draggable: false, resizable: false, rotatable: false, position: { x: offset.x + 750, y: offset.y + 250 }, data: { label: 'WaveDB' } },
          { id: 'highJump',  draggable: false, resizable: false, rotatable: false, position: { x: offset.x + 380, y: offset.y + 100 }, data: { label: 'HighJumpDB' } },
          { id: 'driverApp', draggable: false, resizable: false, rotatable: false, position: { x: offset.x + 380, y: offset.y + 400 }, data: { label: 'DriverAppDB' } },
        ],

        edges: [
          { id: 'to_dynamics', type: this.edgeType(order.erpIntegrated, order),        targetArrowhead: 'ng-diagram-arrow', source: 'source',   target: 'dynamics',  data: {} },
          { id: 'to_intra',    type: this.edgeType(order.intraDbIntegrateAt, order),   targetArrowhead: 'ng-diagram-arrow', source: 'dynamics', target: 'intranet',  data: {} },
          { id: 'to_hj',       type: this.edgeType(order.hJumpDbIntegratedAt, order),  targetArrowhead: 'ng-diagram-arrow', source: 'dynamics', target: 'highJump',  data: {} },
          { id: 'to_driver',   type: this.edgeType(order.driverDbIntegratedAt, order), targetArrowhead: 'ng-diagram-arrow', source: 'dynamics', target: 'driverApp', data: {} },
          { id: 'to_wave',     type: this.edgeType(order.waveDbIntegratedAt, order),   targetArrowhead: 'ng-diagram-arrow', source: 'intranet', target: 'wave',      data: {} },
        ],
      });
    });

    this.cdr.detectChanges();
  }

  private edgeType(integratedAt: string | boolean | null, order: Orders) {
      return integratedAt ? 'success' : order.orderNeedsAttention ? 'broken' : '';
  }
}
