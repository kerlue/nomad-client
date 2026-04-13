import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-server-not-reachable-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  template: `
    <h2 mat-dialog-title>Operation failed</h2>
    <mat-dialog-content>
      {{content}}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="close()">Okay</button>
    </mat-dialog-actions>
  `
})
export class OperationFailedDialog {
  protected content: string = "Operation failed, please try again";

  constructor(@Inject(MAT_DIALOG_DATA) public data: {disableReload: boolean, message: string}, private dialogRef: MatDialogRef<OperationFailedDialog>,) {
    if(data && data.message){
      this.content = data.message;
    }
  }

  close(){
    this.dialogRef.close();
  }
}
