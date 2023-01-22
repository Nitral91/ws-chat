import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private http: HttpClient) {}

  getMessagesForRoom(roomId: string): Observable<MessageInterface[]> {
    return this.http.post<MessageInterface[]>(
      'http://localhost:3000/api/messages/all',
      {
        params: {
          roomId: roomId,
        },
      }
    );
  }
}
