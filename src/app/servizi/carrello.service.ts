import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SERVER_API } from '../../api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarrelloService {
  /*array dove mantengo i palloni che sono stati aggiunti al carrello
  con le rispettive proprietà --> su tutte la quantità e prezzo totale*/
  carrello: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  //RITORNO TUTTI I PRODOTTI NEL CARRELLO
  getCarrello(): any[] {
    return this.carrello;
  }

  //AGGIUNTA PRODOTTO A CARRELLO
  aggiungiAlCarrello(pallone: any): void {
    //gestisco l'eventualità che il prodotto sia già presente nel carrello
    const indice = this.carrello.findIndex((p) => p.id === pallone.id);

    //se il prodotto è già nel carrello
    if (indice !== -1) {
      //aggiorno quantità selezionata da acquistare
      this.carrello[indice].quantita += pallone.quantita;
      //aggiorno quantità disponibile
      this.carrello[indice].quantitaOld -= pallone.quantita;
      //aggiorno prezzo totale del prodotto in questione
      this.carrello[indice].prezzoTotale += pallone.quantita * pallone.prezzo;
    } else {
      //altrimenti aggiungo il prodotto al carrello con tutte le sue proprietà
      const palloneAdd = {
        id: pallone.id,
        nome: pallone.nome,
        codice: pallone.codice,
        urlImg: pallone.url,
        prezzo: pallone.prezzo,
        quantita: pallone.quantita,
        quantitaOld: pallone.quantitaOld,
        prezzoTotale: pallone.prezzo * pallone.quantita,
      };
      //aggiungo il nuovo prodotto al carrello
      this.carrello.push(palloneAdd);
    }
  }

  //RIMOZIONE DI UN PRODOTTO DAL CARRELLO
  rimuoviDalCarrello(idProdotto: string): void {
    //filtro tramite id e poi rimuovo l'elemento
    this.carrello = this.carrello.filter((item) => item.id !== idProdotto);
  }

  //CALCOLO TOTALE COMPLESSIVO ORDINE
  calcolaTotaleOrdine(): number {
    //calcolo il totale dell'ordine sommando i prezzi totali di tutti i prodotti nel carrello
    return this.carrello.reduce((totale, prodotto) => {
      return totale + prodotto.prezzoTotale;
    }, 0);
  }

  //INVIO ORDINE A DB
  inviaDatiAlServer(datiTransazione: any): Observable<any> {
    return this.http.post<any>(SERVER_API.urlPostOrdine, datiTransazione);
  }

  //PAGAMENTO EFFETTUATO CON SUCCESSO E PULIZIA CARRELLO DOPO
  pagamentoRiuscito(): void {
    /*
      questo mi permette di ripulire il carrello e allo stesso tempo
      far si che le quantita dei prodotti acquistati vengano diminuite 
      del numero che è stato acquistato (x ogni prodotto)
    */
    this.carrello = [];

    //mi porta alla schermata di pagamento effettuato con successo
    this.router.navigate(['/pagamentoEffettuatoConSuccesso']);
  }

  //PAGAMENTO RIFIUTATO
  pagamentoFallito(): void {
    //mi porta alla schermata di pagamento effettuato con successo
    this.router.navigate(['/pagamentoRifiutato']);
  }
}
