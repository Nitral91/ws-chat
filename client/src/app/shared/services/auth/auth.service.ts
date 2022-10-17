import { Injectable } from '@angular/core';
import {User} from "../../interfaces/user.interface";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null;

  constructor(
    private http: HttpClient
  ) {
  }

  login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string}>('http://localhost:3000/api/auth/login', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token);
            this.setToken(token)
          }
        )
      )
  }

  registration(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/api/auth/register', user);
  }

  setToken(token: string | null): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null);
  }
}
