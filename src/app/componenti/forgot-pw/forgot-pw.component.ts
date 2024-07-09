import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-forgot-pw',
  templateUrl: './forgot-pw.component.html',
  styleUrl: './forgot-pw.component.css',
})
export class ForgotPwComponent implements OnInit {
  //
  email: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    //
  }

  forgotPassword() {
    this.auth.forgotPassword(this.email);
    this.email = '';
  }
}
