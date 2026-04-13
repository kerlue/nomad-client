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
    <h2 mat-dialog-title>Server Error</h2>
    <mat-dialog-content>
      {{content}}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (data && data.disableReload){
        <button mat-button color="primary" (click)="close()">Okay</button>
      } @else {
        <button mat-button color="primary" (click)="reloadPage()">Reload Page</button>
      }
    </mat-dialog-actions>
  `
})
export class ServerNotReachableDialogComponent {
  protected content: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: {disableReload: boolean, message: string},
              private dialogRef: MatDialogRef<ServerNotReachableDialogComponent>,) {
    if(data && data.message){
      this.content = data.message;
    }
    else{
      this.content = "Request to the server was not successful. Please try again.";
    }

  }

  reloadPage() {
    location.reload();
  }

  close(){
    this.dialogRef.close();
  }
}
