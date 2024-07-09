import { Component, OnInit } from '@angular/core';
import { ProdottiService } from '../../servizi/prodotti.service';
import { OrdiniService } from '../../servizi/ordini.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  //var utilizzate per view con *ngIf di parti HTML del componente:
  //AggiuntaProdotto -- RimozioneProdotto -- ListaOrdini
  showViewAggiungiProd = true;
  showViewRimuoviProd = false;
  showViewOrdini = false;

  //campi x prodotto da caricare su DB
  imgSelezionata: File | null = null;
  nomeProd: string = '';
  codiceProd: string = '';
  descrizioneProd: string = '';
  prezzoProd: string = '0';
  quantitaProd: number = 10;

  //array che contiene i prodotti da GET su DB
  palloni: any[] = [];

  //array che contiene gli ordini da GET su DB
  ordini: any[] = [];

  isAdmin: boolean | undefined;

  //COSTRUTTORE
  constructor(
    private servizioProdotti: ProdottiService,
    private servizioOrdini: OrdiniService,
    private auth: AuthService
  ) {}

  //OnInit
  ngOnInit(): void {
    //su init componente chiede i prodotti al DB
    this.caricaProdotti();
    this.caricaOrdini();

    //mi sottoscrivo per captare i valori dell'oservable isAdmin$
    this.auth.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  //METODI X GESTIRE L'HTML DA VISUALIZZARE
  goToAggiungiProdotto() {
    if (this.showViewAggiungiProd) {
    } else {
      this.showViewAggiungiProd = !this.showViewAggiungiProd;
      this.showViewRimuoviProd = false;
      this.showViewOrdini = false;
    }
  }

  goToRimuoviProdotto() {
    if (this.showViewRimuoviProd) {
    } else {
      this.showViewRimuoviProd = !this.showViewRimuoviProd;
      this.showViewAggiungiProd = false;
      this.showViewOrdini = false;
    }
  }

  goToListaOrdini() {
    if (this.showViewOrdini) {
    } else {
      this.showViewOrdini = !this.showViewOrdini;
      this.showViewAggiungiProd = false;
      this.showViewRimuoviProd = false;
    }
  }
  //

  /* SEZIONE AGGUNGI PRODOTTO */
  //TRAMITE EVENT (CHANGE) CATTURA L'IMMAGINE SELEZIONATA
  onImgSelezionata(event: any) {
    this.imgSelezionata = event.target.files[0];
  }

  //AGGIUNTA PRODOTTO a Storage
  aggiungiProdotto() {
    //se immagine non selezionata
    if (!this.imgSelezionata) {
      console.error('Seleziona immagine');
      return;
    }

    //prendo il prezzo inserito, cast a float
    let prezzo = parseFloat(this.prezzoProd.replace(',', '.'));

    //se prezzo non è un numero
    if (isNaN(prezzo)) {
      console.error('Inserisci un prezzo valido');
      return;
    }

    const datiProdotto = {
      nome: this.nomeProd,
      codice: this.codiceProd,
      quantita: this.quantitaProd,
      prezzo: prezzo,
      descrizione: this.descrizioneProd,
    };

    this.servizioProdotti
      .aggiungiProdotto(datiProdotto, this.imgSelezionata)
      .subscribe(
        () => {
          console.log('Prodotto aggiunto con successo:');
        },
        (error) => {
          console.error("Errore durante l'aggiunta del prodotto:", error);
        }
      );
  }
  /**/

  /* SEZIONE RIMUOVI PRODOTTO */
  //ELIMINAZIONE DI UN PRODOTTO
  rimuoviProdotto(id: string): void {
    this.servizioProdotti.rimuoviProdotto(id).then(() => {
      //Aggiorno lista dei prodotti dopo la rimozione
      this.caricaProdotti();
    });
  }

  //CARICAMENTO PRODOTTI
  caricaProdotti(): void {
    this.servizioProdotti.getProdotti().subscribe((data) => {
      this.palloni = data;
    });
  }
  /**/

  /* SEZIONE ORIDNI */
  //CARICAMENTO ORDINI
  caricaOrdini(): void {
    this.servizioOrdini.getOrdini().subscribe((ordini) => {
      this.ordini = ordini;
    });
  }

  //CHANGE STATO DI UN ORDINE IN 'EVASO
  contrassegnaEvaso(idOrdine: string): void {
    this.servizioOrdini
      .ordineEvaso(idOrdine)
      .then(() => {
        console.log(`Ordine ${idOrdine} evaso con successo.`);
        // GET ordini dopo PUT come evaso
        this.caricaOrdini();
      })
      .catch((err) => {
        console.log('Errore durante PUT come evaso:', err);
      });
  }

  //ELIMINAZIONE ORDINE DA DB
  eliminaOrdine(idOrdine: string): void {
    this.servizioOrdini
      .eliminaOrdine(idOrdine)
      .then(() => {
        // GET ordini dopo DELETE
        this.caricaOrdini();
      })
      .catch((err) => {
        console.log('Errore:', err);
      });
  }
  /**/
}
