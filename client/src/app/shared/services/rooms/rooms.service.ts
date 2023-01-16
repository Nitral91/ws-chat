import { Injectable } from '@angular/core';
import type { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Room } from '../../interfaces/room.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>('http://localhost:3000/api/rooms');
  }

  createRoom(title: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/room', {
      title,
    });
  }
}
