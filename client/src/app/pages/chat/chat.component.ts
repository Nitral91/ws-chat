import { Component, OnDestroy, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mergeMap, Subject, takeUntil } from 'rxjs';
import { MessagesService } from '../../shared/services/messages/messages.service';
import { MessageInterface } from '../../shared/interfaces/message.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  userLogin: string;
  message = '';
  channelId: string;
  messageList: MessageInterface[] = [];
  userList: string[];
  socket: Socket;

  private readonly destroy$ = new Subject();

  constructor(
    private messagesService: MessagesService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.channelId = params['id'];
    });
  }

  ngOnInit(): void {
    this.userLogin = localStorage.getItem('login') || '';

    this.messagesService
      .getMessagesForRoom(this.channelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.messageList = res.map(message => {
          return {
            message: message.message,
            userName: message.userName,
            date: message.date,
            myMessage: this.userLogin === message.userName,
          };
        });
      });

    this.socket = io(
      `http://localhost:3000?channelId=${this.channelId}&userLogin=${this.userLogin}`
    );
    this.socket.emit('join', this.channelId);

    this.socket.on('user-list', userList => {
      this.userList = userList;
    });

    this.socket.emit('user-list', this.channelId);

    this.socket.on(
      'message-broadcast',
      (data: { message: string; userName: string }) => {
        if (data) {
          this.messageList.push({
            message: data.message,
            userName: data.userName,
            date: new Date(),
            myMessage: false,
          });
        }
      }
    );

    this.socket.on('error', res => {
      this._snackBar.open(res.message, 'Close');
    });
  }

  ngOnDestroy(): void {
    this.socket.emit('leave', this.channelId);
    this.socket.disconnect();

    this.destroy$.next(true);
    this.destroy$.complete();
  }

  sendMessage(): void {
    this.socket.emit('message', {
      message: {
        message: this.message,
        userName: this.userLogin,
      },
      channelId: this.channelId,
    });
    this.messageList.push({
      message: this.message,
      userName: this.userLogin,
      myMessage: true,
      date: new Date(),
    });
    this.message = '';
  }
}
