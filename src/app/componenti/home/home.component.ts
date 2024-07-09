import { Component, Renderer2, OnInit } from '@angular/core';
import { ServizioNavService } from '../../servizi/servizio-nav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private navservice: ServizioNavService) {}

  ngOnInit(): void {
    /* */
  }

  passaAPalloni() {
    // Va a 'palloni' quando il bottone viene premuto
    this.navservice.goToPalloni();
    // Setta che la pagina palloni è visualizzata
    this.navservice.setIsPalloniActive(true);
  }
}
