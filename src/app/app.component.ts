import { Component, HostListener } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'BaloonSite';
  constructor(private authService: AuthService) {}

  /*@HostListener('window:beforeunload', ['$event'])
  unloadHandler() {
    this.authService.logout();
  }*/
}
