import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { TokenService } from '../../servizi/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private auth: AuthService,
    private authTokenService: TokenService
  ) {}

  ngOnInit(): void {}

  login() {
    if (this.email == '' || this.password == '') {
      alert('Inserisci tutti i campi');
      return;
    } else {
      this.auth.login(this.email, this.password).subscribe(
        () => {
          console.log('UID:', this.authTokenService.getAuthToken());
        },
        (error) => {
          console.error('Login error:', error);
        }
      );
      //ripulisco
      this.email = '';
      this.password = '';
    }
  }
}
