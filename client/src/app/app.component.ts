import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('auth-token');
    if (token) {
      this.auth.setToken(token);
    }
  }
}
