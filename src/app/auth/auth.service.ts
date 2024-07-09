import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { SERVER_API } from '../../api.config';
import { TokenService } from '../servizi/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //mi permettono di tenere traccia dello stato di LogIn e Admin
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  private isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdmin.asObservable();

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    private authTokenService: TokenService
  ) {
    this.checkAdmin();
  }

  checkAdmin(): void {
    const authToken = this.authTokenService.getAuthToken();

    if (authToken) {
      this.http
        .get<boolean>(`${SERVER_API.urlAdmin}/${authToken}`)
        .subscribe((isAdmin) => {
          this.isAdmin.next(isAdmin);
          this.loggedIn.next(true);
        });
    }
  }

  checkGuard(): Observable<boolean> {
    const id = this.authTokenService.getAuthToken();

    if (id) {
      return this.http.get<boolean>(`${SERVER_API.urlAdmin}/${id}`).pipe(
        map((isAdmin: boolean) => {
          if (isAdmin) {
            this.isAdmin.next(isAdmin);
            this.loggedIn.next(true);
          } else {
            this.isAdmin.next(false);
            this.loggedIn.next(true);
          }
          return isAdmin;
        })
      );
    }
    return of(false);
  }

  // LOGIN
  login(email: string, password: string): Observable<any> {
    const loginData = {
      email: email,
      password: password,
    };

    return this.http.post<any>(SERVER_API.urlLoginUtente, loginData).pipe(
      tap((response) => {
        // salva una parte del Token
        this.authTokenService.setAuthToken(response.localId);
        this.checkAdmin();
        this.loggedIn.next(true);
        this.router.navigate(['/home']);
      }),
      catchError((error) => {
        alert('Credenziali Errate --> Riprova');
        return throwError(error);
      })
    );
  }

  //REGISTRAZIONE
  registrazione(
    email: string,
    password: string,
    nome: string,
    cognome: string,
    username: string
  ) {
    const body = {
      email: email,
      password: password,
      nome: nome,
      cognome: cognome,
      username: username,
      admin1: false,
    };
    this.http.post<any>(SERVER_API.urlCreateUtente, body).subscribe(
      () => {
        alert('Registrazione effettuata --> vai a LogIn');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log('Errore registrazione: ', error);
        alert('Errore durante la registrazione.');
      }
    );
  }

  //ELIMINAZIONE ACCOUNT
  async eliminaAccount(): Promise<void> {
    try {
      const user = this.authTokenService.getAuthToken();
      if (user !== null) {
        this.http
          .delete(`${SERVER_API.urlDeleteUtente}/${user}`)
          .pipe(
            catchError((error) => {
              console.error('Errore:', error);
              return throwError(error); // Rilancia l'errore
            })
          )
          .subscribe(() => {
            this.authTokenService.removeAuthToken();
            //passo nello stato di non loggato
            this.loggedIn.next(false);
            this.isAdmin.next(false);
            this.router.navigate(['/home']);
          });
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'account:", error);
    }
  }

  //RECUPERO PASSWORD DIMENTICATA TRAMITE MAIL
  async forgotPassword(email: string) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      alert('Email inviata. Controlla casella di posta.');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Errore invio mail:', error);
      alert('Errore durante reset password, RITENTA.');
    }
  }

  /*async forgotPassword(email: string) {
    try {
      await this.http
        .post<any>(SERVER_API.urlForgotPassword, { email })
        .toPromise();
      alert('Email inviata. Controlla casella di posta.');
      this.router.navigate(['/login']);
      return; // Aggiunto return qui
    } catch (error) {
      console.error('Errore invio mail:', error);
      alert('Errore durante reset password, RITENTA.');
      return throwError(error);
    }
  }*/

  //LOGOUT
  logout() {
    this.authTokenService.removeAuthToken();
    this.isAdmin.next(false);
    this.loggedIn.next(false);
  }
}
