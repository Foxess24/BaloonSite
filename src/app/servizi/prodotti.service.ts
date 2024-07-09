import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API } from '../../api.config';

@Injectable({
  providedIn: 'root',
})
export class ProdottiService {
  constructor(private http: HttpClient) {}

  //POST PRODOTTO
  aggiungiProdotto(datiProdotto: any, img: File): Observable<any> {
    const formData = new FormData();
    formData.append('nome', datiProdotto.nome);
    formData.append('codice', datiProdotto.codice);
    formData.append('quantita', datiProdotto.quantita);
    formData.append('prezzo', datiProdotto.prezzo);
    formData.append('descrizione', datiProdotto.descrizione);
    formData.append('immagine', img);
    return this.http.post<any>(`${SERVER_API.urlPostProdotto}`, formData);
  }

  //GET PRODOTTI
  getProdotti(): Observable<any[]> {
    return this.http.get<any[]>(SERVER_API.urlGetProdotti);
  }

  //GET PRODOTTO TRAMITE ID --> PER VISUALIZZAZIONE SU COMPONENT DETTAGLI-PRODOTTO
  getPalloneById(id: string): Observable<any> {
    return this.http.get(`${SERVER_API.urlGetProdotto}/${id}`);
  }
  //

  //DELETE PRODOTTO
  rimuoviProdotto(id: string): Promise<void> {
    return this.http
      .delete<void>(`${SERVER_API.urlDeleteProdotto}/${id}`)
      .toPromise();
  }

  //UPDATE QUANTITA DISPONIBILE PRODOTTO
  updateQuantitaProdADD(id: any, newQuantita: number) {
    // Effettua la chiamata PUT all'API per aggiornare la quantità del prodotto
    return this.http
      .put<void>(`${SERVER_API.urlPutQuantitaAdd}/${id}`, { newQuantita })
      .toPromise();
  }

  //UPDATE QUANTITA DISPONIBILE PRODOTTO
  updateQuantitaProdREMOVE(
    id: string,
    quantitaSel: number,
    quantitaOld: number
  ) {
    const body = { quantitaSel, quantitaOld };
    return this.http
      .put<void>(`${SERVER_API.urlPutQuantitaRemove}/${id}`, body)
      .toPromise();
  }
}
