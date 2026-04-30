import { Component } from '@angular/core';
import { NgDiagramComponent, initializeModel, provideNgDiagram } from 'ng-diagram';

@Component({
  imports: [NgDiagramComponent],
  selector: 'app-order-tree-diagram',
  providers: [provideNgDiagram()],
  template: ` <ng-diagram [model]="model" /> `,
  styles: `
    :host {
      display: flex;
      height: 300px;
    }
  `,
})
export class OrderTreeDiagram {
  model = initializeModel({
    nodes: [
      { id: '1', position: { x: 100, y: 150 }, data: { label: 'Node 1' } },
      { id: '2', position: { x: 400, y: 150 }, data: { label: 'Node 2' } },
    ],
    edges: [
      {
        id: '1',
        source: '1',
        sourcePort: 'port-right',
        targetPort: 'port-left',
        target: '2',
        data: {},
      },
    ],
  });
}

