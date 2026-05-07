// json-viewer-dialog/json-viewer-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

export interface JsonViewerDialogData {
  label: string;
  json: any;
  raw: string;
}

@Component({
  selector: 'app-json-viewer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, NgxJsonViewerModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>{{ data.label }}</h2>
      <div class="header-actions">
        <button class="copy-btn" (click)="copyToClipboard()">
          {{ copied ? '✓ Copied' : '⎘ Copy' }}
        </button>
        <button class="close-btn" (click)="close()">✕</button>
      </div>
    </div>

    <mat-dialog-content class="dialog-content">
      @if (isObject) {
        <ngx-json-viewer
          [json]="data.json"
          [expanded]="false"
        />
      } @else {
        <pre class="plain-text">{{ data.raw }}</pre>
      }
    </mat-dialog-content>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e5e7eb;
      margin-right: 20px;
    }

    h2[mat-dialog-title] {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .copy-btn {
      font-size: 12px;
      padding: 4px 12px;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }

    .copy-btn:hover { background: #e5e7eb; }

    .close-btn {
      font-size: 14px;
      padding: 4px 10px;
      background: transparent;
      color: #6b7280;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.15s;
    }

    .close-btn:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .dialog-content {
      padding: 16px 20px;
      overflow-y: auto;
    }

    .plain-text {
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 13px;
      color: #374151;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
    }

    ::ng-deep ngx-json-viewer {
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 13px;
    }
  `]
})
export class JsonViewerDialogComponent {
  copied = false;
  isObject: boolean;

  private copiedTimeout: any;

  constructor(
    public dialogRef: MatDialogRef<JsonViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JsonViewerDialogData
  ) {
    this.isObject = typeof data.json === 'object' && data.json !== null;
  }

  close(): void {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    const text = this.isObject
      ? JSON.stringify(this.data.json, null, 2)
      : this.data.raw;

    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      this.copiedTimeout = setTimeout(() => (this.copied = false), 2000);
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.copiedTimeout);
  }
}
