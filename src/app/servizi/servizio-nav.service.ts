import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ServizioNavService {
  private isPalloniActive: boolean = false;

  constructor(private router: Router) {}

  //metodi per cambio pagina su palloni dopo click
  //bottone 'esplora'e cambio css del link 'palloni' su header
  setIsPalloniActive(active: boolean): void {
    this.isPalloniActive = active;
  }

  goToPalloni(): void {
    this.router.navigate(['/palloni']);
  }

  getIsPalloniActive(): boolean {
    return this.isPalloniActive;
  }
  //
}
