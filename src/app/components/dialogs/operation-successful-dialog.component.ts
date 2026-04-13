import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";

@Component({
  selector: 'app-operation-successful-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  template: `
    <h2 mat-dialog-title>✓ Request Successful</h2>
    <mat-dialog-content>
      The data was sent and processed successfully by the server.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="onOkayClick()">Okay</button>
    </mat-dialog-actions>
  `
})
export class OperationSuccessfulDialog {
  readonly dialogRef = inject(MatDialogRef<OperationSuccessfulDialog>);

  onOkayClick(): void {
    this.dialogRef.close();
  }
}
