import { Component, input } from '@angular/core';
import {
  NgDiagramComponent,
  NgDiagramConfig,
  NgDiagramEdgeTemplateMap,
  initializeModel,
  provideNgDiagram,
} from 'ng-diagram';
import { BrokenEdgeComponent } from './broken-edge';


@Component({
  imports: [NgDiagramComponent],
  selector: 'app-order-tree-diagram',
  providers: [provideNgDiagram()],
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
  ]);

  model = initializeModel({
    nodes: [
      { id: '1', draggable: false, resizable: false, rotatable: false, position: { x: 100, y: 150 }, data: { label: 'ECOM' } },
      { id: '2', draggable: false, resizable: false, rotatable: false, position: { x: 400, y: 150 }, data: { label: 'Dynamics' } },
      { id: '3', draggable: false, resizable: false, rotatable: false, position: { x: 700, y: 50 },  data: { label: 'Intra' } },
      { id: '4', draggable: false, resizable: false, rotatable: false, position: { x: 700, y: 150 }, data: { label: 'HJump' } },
      { id: '5', draggable: false, resizable: false, rotatable: false, position: { x: 700, y: 250 }, data: { label: 'Driver' } },
    ],
    edges: [
      {
        id: '1',
        source: '1',
        target: '2',
        type: 'broken',
        data: {},
      },
      { id: '2', source: '2', target: '3', data: {} },
      { id: '3', source: '2', target: '4', data: {} },
      { id: '4', source: '2', target: '5', data: {} },
    ],
  });
}
