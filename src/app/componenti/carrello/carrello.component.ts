import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CarrelloService } from '../../servizi/carrello.service';
import { ProdottiService } from '../../servizi/prodotti.service';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrl: './carrello.component.css',
})
export class CarrelloComponent implements OnInit {
  //mi serve per mantenere il carrello
  carrello: any[] = [];
  //totale costo ordine
  totale: number = 0;
  //x verificare se carrello è vuoto
  carrelloVuoto: boolean = true;

  //RIFERIMENTO A DIV PER PAYPAL
  @ViewChild('pagamentoRefPayPal', { static: true })
  pagamentoRefPayPal!: ElementRef;

  //COSTRUTTORE
  constructor(
    private carrelloService: CarrelloService,
    private prodottiService: ProdottiService,
    private ngZone: NgZone
  ) {}

  //OnInit --> CARICA I DATI DEL CARRELLO DAL SERVIZIO
  ngOnInit(): void {
    //richiesta carrello al carrello service x view
    this.carrello = this.carrelloService.getCarrello();
    //calcolo tramite carrello service totale ordine
    this.totale = this.carrelloService.calcolaTotaleOrdine();

    //verifico se carrello vuoto
    this.carrelloVuoto = this.carrello.length === 0;

    //se carrello non vuoto mostra PayPal
    if (!this.carrelloVuoto && this.pagamentoRefPayPal) {
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            // Logica per creare un ordine su server
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    //set valuta pagamento
                    currency_code: 'EUR',
                    //set importo ordine
                    value: this.totale.toString(),
                  },
                },
              ],
            });
          },
          //pagamento approvato
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              this.ngZone.run(() => {
                this.invioDati(details, this.carrello);
                console.log('Transazione eseguita');
              });
            });
          },
          //errore nel pagamento
          onError: (err: any) => {
            this.ngZone.run(() => {
              console.log('Errore durante il pagamento:', err);
              //ripulisco carrello dopo fallimento
              this.carrelloService.pagamentoFallito();
            });
          },
        })
        .render(this.pagamentoRefPayPal.nativeElement);
    } else {
    }
  }

  //CREO I DATI DELL'ORDINE DA INVIARE AL DB TRAMITE IL SERVIZIO CARRELLO-SERVICE
  private invioDati(details: any, carrello: any[]): void {
    //creo dati ordine
    const datiProdotto = carrello.map((item) => ({
      id: item.id,
      quantita: item.quantita,
      prezzo: item.prezzo,
    }));

    //creo indirizzo di spedizione
    const indirizzo = {
      indirizzo: details.purchase_units[0].shipping.address.address_line_1,
      provincia: details.purchase_units[0].shipping.address.admin_area_1,
      codPostale: details.purchase_units[0].shipping.address.postal_code,
      citta: details.purchase_units[0].shipping.address.admin_area_2,
      nazione: details.purchase_units[0].shipping.address.country_code,
    };

    //dati da inviare a DB --> COMPLETI
    const datiOrdine = {
      id: details.id,
      nome: details.payer.name.given_name,
      cognome: details.payer.name.surname,
      email: details.payer.email_address,
      dataRicezione: details.create_time,
      indirizzo: indirizzo,
      prodotti: datiProdotto,
      prezzo: this.totale,
      evaso: false,
    };

    this.carrelloService.inviaDatiAlServer(datiOrdine).subscribe(
      (data) => {
        console.log(data);
        this.carrelloService.pagamentoRiuscito();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /*
    MI SERVE PER FARSI CHE IL CARELLO VENGA SVUOTATO E RIMANDATE
    LE QUANTITA AL DB PER RENDERLE NUOVAMENTE DISPONIBILI, QUANDO
    L'APP VIENE REFRESHATA OPPURE CHIUSA
  */
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    // Gestisce l'evento beforeunload e chiama la funzione di aggiornamento
    this.aggiornaQuantitaNelDatabase();
  }
  //

  //METODO DI AGGIORNAMENTO QUANTITA (SU DITRUZIONE)
  private aggiornaQuantitaNelDatabase(): void {
    //per ogni prodotto nel carrello:
    this.carrello.forEach((prodotto) => {
      //uso il servizio per aggiornare la quantità nel DB
      this.prodottiService.updateQuantitaProdREMOVE(
        prodotto.id,
        prodotto.quantita,
        prodotto.quantitaOld
      );
    });
  }

  //RIMOZIONE PRODOTTO DA CARRELLO
  rimuoviDalCarrello(idPallone: string): void {
    //trovo indice del prodotto
    const index = this.carrello.findIndex(
      (pallone) => pallone.id === idPallone
    );

    //UPDATE quantita disponibile nel DB di quel prodotto
    this.prodottiService.updateQuantitaProdREMOVE(
      idPallone,
      this.carrello[index].quantita,
      this.carrello[index].quantitaOld
    );

    //implementa la logica per rimuovere il prodotto dal carrello
    this.carrelloService.rimuoviDalCarrello(idPallone);
    //aggiorno Totale Ordine Complessivo
    this.totale = this.carrelloService.calcolaTotaleOrdine();
    //aggiorna la visualizzazione del carrello dopo la rimozione
    this.carrello = this.carrelloService.getCarrello();
    //verifico se carrello vuoto
    this.carrelloVuoto = this.carrello.length === 0;
  }
}
