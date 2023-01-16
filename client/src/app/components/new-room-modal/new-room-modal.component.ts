import { Component } from '@angular/core';
import type { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-room-modal',
  templateUrl: './new-room-modal.component.html',
  styleUrls: ['./new-room-modal.component.scss'],
})
export class NewRoomModalComponent {
  roomTitle: string;

  constructor(public dialogRef: MatDialogRef<NewRoomModalComponent>) {}

  onNoClose(): void {
    this.dialogRef.close({
      cancelled: 'Room creating has been cancelled',
    });
  }
}
