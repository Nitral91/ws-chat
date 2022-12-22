import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-new-room-modal',
  templateUrl: './new-room-modal.component.html',
  styleUrls: ['./new-room-modal.component.scss']
})
export class NewRoomModalComponent implements OnInit {

  roomTitle: string;

  constructor(
    public dialogRef: MatDialogRef<NewRoomModalComponent>,
  ) { }

  ngOnInit(): void {
  }

  onNoClose(): void {
    this.dialogRef.close({
      cancelled: 'Room creating has been cancelled'
    });
  }

}
