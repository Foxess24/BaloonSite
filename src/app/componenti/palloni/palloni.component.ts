import { Component, OnInit } from '@angular/core';
import { ProdottiService } from '../../servizi/prodotti.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-palloni',
  templateUrl: './palloni.component.html',
  styleUrl: './palloni.component.css',
})
export class PalloniComponent implements OnInit {
  //palloni presi dal DB
  palloni: any[] = [];

  constructor(
    private prodottiService: ProdottiService,
    private router: Router
  ) {}

  //OnInit
  ngOnInit(): void {
    //sull'inizializzazione faccio la GET dei palloni
    this.getPalloni();
  }

  //GET PRODOTTI DA DB --> X VIEW SU SCHERMO
  getPalloni(): void {
    this.prodottiService.getProdotti().subscribe((data) => {
      this.palloni = data;
    });
  }

  //GoTo DETTAGLI DEL PRODOTTO
  apriDettagli(pallone: any): void {
    this.router.navigate(['/dettagli-pallone', pallone.id]);
  }
}
