import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  email: string = '';
  password: string = '';
  nome: string = '';
  cognome: string = '';
  username: string = '';

  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    //
  }

  registrazione() {
    if (
      this.email == '' ||
      this.password == '' ||
      this.nome == '' ||
      this.cognome == '' ||
      this.username == ''
    ) {
      alert('Inserisci tutti i campi');
      return;
    } else {
      //chiamo metodo registrazione di Auth Service
      this.auth.registrazione(
        this.email,
        this.password,
        this.nome,
        this.cognome,
        this.username
      );

      //ripulisco
      this.email = '';
      this.password = '';
      this.nome = '';
      this.cognome = '';
      this.username = '';
    }
  }
}
