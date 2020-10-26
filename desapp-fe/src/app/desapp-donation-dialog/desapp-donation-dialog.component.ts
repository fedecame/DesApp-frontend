import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../desapp-project-detail/desapp-project-detail.component';

@Component({
  selector: 'app-desapp-donation-dialog',
  templateUrl: './desapp-donation-dialog.component.html',
  styleUrls: ['./desapp-donation-dialog.component.scss'],
})
export class DesappDonationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DesappDonationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
