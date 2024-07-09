import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdottiService } from '../../servizi/prodotti.service';
import { CarrelloService } from '../../servizi/carrello.service';

@Component({
  selector: 'app-dettagli-prodotto',
  templateUrl: './dettagli-prodotto.component.html',
  styleUrl: './dettagli-prodotto.component.css',
})
export class DettagliProdottoComponent {
  pallone: any;
  //quantita selezionata dall'utente
  quantita: number = 1;
  //quantita max disponibile del prodotto
  quantitaMax: number = 1;
  //x controllo HTML
  disponibile: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prodottiService: ProdottiService,
    private carrelloService: CarrelloService
  ) {}

  //OnInit --> RECUPERA ID PALLONE E LO PRENDE DAL DB
  ngOnInit(): void {
    //carica il prodotto con l'id dalla route
    const palloneId = this.route.snapshot.params['id'];
    //carica il prodotto tramite prodottiService
    this.pallone = this.loadPallone(palloneId);
  }

  //CARICA LA VIEW CON IL PALLONE CHE HA L'ID PASSATO
  loadPallone(palloneId: string): void {
    //chiama il servizio che permette di prendere i dati relativi all'ID passato
    this.prodottiService.getPalloneById(palloneId).subscribe((data: any) => {
      //salva i dati in pallone
      this.pallone = data;
      //salva la quantità Max disponibile
      this.quantitaMax = data.quantita;

      //x controllo bottoni su HTML
      if (this.quantitaMax == 0) {
        this.disponibile = false;
      } else {
        this.disponibile = true;
      }
    });
  }

  //BACK ALLA PAGINA 'PALLONI'
  tornaIndietro(): void {
    this.router.navigate(['/palloni']);
  }

  //AGGIUNTA DI UN PRODOTTO AL CARRELLO
  aggiungiAlCarrello(): void {
    //aggiorno la quantità disponibile nel DB
    const newQuantita = this.quantitaMax - this.quantita;
    if (newQuantita >= 0) {
      //crea un oggetto con le informazioni del prodotto in questione
      const palloneDaAggiungere = {
        id: this.pallone.id,
        nome: this.pallone.nome,
        codice: this.pallone.codice,
        prezzo: this.pallone.prezzo,
        quantita: this.quantita,
        quantitaOld: this.quantitaMax - this.quantita,
        url: this.pallone.url,
      };

      //invia il prodotto al servizio CarrelloService
      this.carrelloService.aggiungiAlCarrello(palloneDaAggiungere);

      //aggiorno quantita disponibile nel DB
      this.prodottiService.updateQuantitaProdADD(this.pallone.id, newQuantita);
    } else {
      //quantita disponibile insufficente
      console.log('Quantità disponibile insufficiente');
    }

    //torno a palloni x visionare altri prodotti
    this.tornaIndietro();
  }
}
