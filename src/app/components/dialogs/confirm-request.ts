import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {THREE} from "@angular/cdk/keycodes";


@Component({
  selector: 'app-retry-failed-request',
  standalone: true,
  imports: [MatDialogModule, MatButton],
  template: `
    <h2 mat-dialog-title>{{this.data.header}}</h2>
    <mat-dialog-content>
      {{this.data.message}}
    </mat-dialog-content>
    <mat-dialog-actions align="end">

      @if(!data.disableCancel) {
        <button mat-button (click)="dialogRef.close()">Cancel</button>
      }
      <button mat-button color="primary" cdkFocusInitial (click)="this.onConfirm()">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmRequestComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:
              {
                disableCancel: boolean,
                message: string,
                header: string,
                onConfirm: () => void
              },
              protected dialogRef: MatDialogRef<ConfirmRequestComponent>) {  }

  onConfirm() {
    this.data.onConfirm()
    this.dialogRef.close()
  }
}
