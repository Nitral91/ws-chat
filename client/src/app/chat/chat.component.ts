import { Component, OnInit } from '@angular/core';
import {io, Socket} from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  userName: string = '';
  message: string = '';
  messageList: {
    message: string;
    userName: string;
    myMessage: boolean
  }[] = [];
  userList: string[] = [];
  socket: Socket;

  constructor() { }

  ngOnInit(): void {
  }

  userNameUpdate(name: string): void {
    this.socket = io(`localhost:3000?userName=${name}`);
    this.userName = name;

    this.socket.emit('set-user-name', name);

    this.socket.on('user-list', (userList: string[]) => {
      this.userList = userList;
    });

    this.socket.on('message-broadcast', (data: {
      message: string,
      userName: string;
    }) => {
      if (data) {
        this.messageList.push({message: data.message, userName: data.userName, myMessage: false});
      }
    })
  }

  sendMessage(): void {
    this.socket.emit('message', this.message);
    this.messageList.push({message: this.message, userName: this.userName, myMessage: true});
    this.message = '';
  }

}
