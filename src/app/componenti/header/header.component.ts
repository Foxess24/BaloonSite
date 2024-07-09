import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ServizioNavService } from '../../servizi/servizio-nav.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isPalloniActive: boolean = false;
  loggedIn: boolean = false;
  isAdmin: boolean;

  constructor(
    private navService: ServizioNavService,
    private auth: AuthService,
    private router: Router
  ) {
    this.loggedIn = false;
    this.isAdmin = false;
  }

  ngOnInit() {
    /*
      SERVE A VERIFICARE SE TRAMITE CLICK DEL BOTTONE ESPLORA 
      NEL COMPONENTE HOME DEVO AGGIORNARE IL CSS DEL LINK/BOTTONE
      'PALLONI' NELLA NAV BAR
    */
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        //verifica se la pagina corrente è 'palloni'
        this.isPalloniActive = this.navService.getIsPalloniActive();
      });

    //MI PERMETTE DI CAPIRE SE C'E' UN UTENTE LOGGATO
    this.auth.loggedIn$.subscribe((status) => {
      this.loggedIn = status;
    });

    //MI PERMETTE DI VERIFICARE SE CHI E' LOGGATO E' UN ADMIN
    this.auth.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  //SU CLICK BOTTONE LOGOUT RICHIAMO IL METODO LOGOUT DELL'AUTH SERVICE
  logout(): void {
    this.auth.logout();
  }
}
