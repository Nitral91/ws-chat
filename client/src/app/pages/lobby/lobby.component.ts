import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomsService} from "../../shared/services/rooms/rooms.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {NewRoomModalComponent} from "../../components/new-room-modal/new-room-modal.component";
import {Room} from "../../shared/interfaces/room.interface";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {

  rooms: Room[];

  private readonly destroy$ = new Subject();
  constructor(
    private roomsService: RoomsService,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchAllRooms();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  fetchAllRooms(): void {
    this.roomsService.getRooms()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        this.rooms = res;
      })
  }

  onCreateRoom(): void {
    const dialog = this._matDialog.open(NewRoomModalComponent);

    dialog.afterClosed()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        if (!res.cancelled) {
          this.roomsService.createRoom(res)
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe(res => {
              this._snackBar.open(`Room ${ res.title } has been created`, 'Close')
              this.fetchAllRooms();
            },
              error => {
                this._snackBar.open(error.error.message, 'Close');
              });
        } else {
          this._snackBar.open(res.cancelled, 'Close')
        }
      });
  }

}
