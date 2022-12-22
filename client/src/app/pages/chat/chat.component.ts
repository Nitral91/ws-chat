import {Component, OnDestroy, OnInit} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {ActivatedRoute, Params} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  userLogin: string;
  message: string = '';
  channelId: string;
  messageList: {
    message: string;
    userName: string;
    myMessage: boolean
  }[] = [];
  userList: string[];
  socket: Socket;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.userLogin = localStorage.getItem('login') || '';

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.channelId = params['id'];
      });

    this.socket = io(`http://localhost:3000?channelId=${this.channelId}&userLogin=${this.userLogin}`);
    this.socket.emit('join', this.channelId);

    this.socket.on('user-list', userList => {
      console.log('userList: ', userList);
      this.userList = userList;
    });

    this.socket.emit('user-list', this.channelId);

    this.socket.on('message-broadcast', (data: {
      message: string,
      userName: string;
    }) => {
      if (data) {
        this.messageList.push({
          message: data.message,
          userName: data.userName,
          myMessage: false
        });
      }
    })

    this.socket.on('error', res => {
      this._snackBar.open(res.message, 'Close');
    })
  }

  ngOnDestroy(): void {
    this.socket.emit('leave', this.channelId);
    this.socket.disconnect();
  }

  sendMessage(): void {

    this.socket.emit('message', {
      message: {
        message: this.message,
        userName: this.userLogin
      },
      channelId: this.channelId
    });
    this.messageList.push({
      message: this.message,
      userName: this.userLogin,
      myMessage: true
    });
    this.message = '';
  }

}
