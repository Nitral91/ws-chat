import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-room-modal',
  templateUrl: './new-room-modal.component.html',
  styleUrls: ['./new-room-modal.component.scss'],
})
export class NewRoomModalComponent {
  roomTitle: string;

  dropdownOptions = [{ name: 'Private' }, { name: 'Public' }];

  constructor(public dialogRef: MatDialogRef<NewRoomModalComponent>) {}

  onNoClose(): void {
    this.dialogRef.close({
      cancelled: 'Room creating has been cancelled',
    });
  }

  onDropdownChange(value: any): void {
    console.log('value: ', value);
  }
}
