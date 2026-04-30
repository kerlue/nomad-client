import { Component, input } from '@angular/core';
import {
  NgDiagramBaseEdgeComponent,
  NgDiagramBaseEdgeLabelComponent,
  type Edge,
  type NgDiagramEdgeTemplate,
} from 'ng-diagram';

@Component({
  selector: 'app-success-edge',
  imports: [NgDiagramBaseEdgeComponent, NgDiagramBaseEdgeLabelComponent],
  template: `
    <ng-diagram-base-edge
      [edge]="edge()"
      stroke="#e53935"
      [strokeWidth]="2"
      strokeDasharray="6 4"
    >
      <ng-diagram-base-edge-label id="success-marker" [positionOnEdge]="0.5">
        <div class="success-x">✕</div>
      </ng-diagram-base-edge-label>
    </ng-diagram-base-edge>
  `,
  styles: `
    .success-x {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #e53935;
      color: #e53935;
      font-weight: 700;
      font-size: 14px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      user-select: none;
    }
  `,
})
export class SuccessEdgeComponent implements NgDiagramEdgeTemplate {
  edge = input.required<Edge>();
}
