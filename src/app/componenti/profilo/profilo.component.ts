import { Component, OnInit } from '@angular/core';
import { ProfiloService } from '../../servizi/profilo.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css',
})
export class ProfiloComponent implements OnInit {
  datiUtente: any = {};

  constructor(
    private profiloService: ProfiloService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = localStorage.getItem('authToken');
    if (id) {
      this.profiloService.getDatiUtente(id).subscribe((dati) => {
        this.datiUtente = dati;
      });
    }
  }

  eliminaAccount(): void {
    const conferma = confirm('Sei sicuro di voler eliminare il tuo account?');
    if (conferma) {
      const token = localStorage.getItem('authToken');
      if (token != null) {
        this.authService.eliminaAccount();
      }
    }
  }
}
