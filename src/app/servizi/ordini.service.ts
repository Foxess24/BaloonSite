import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API } from '../../api.config';

@Injectable({
  providedIn: 'root',
})
export class OrdiniService {
  constructor(private http: HttpClient) {}

  //GET ORDINI
  getOrdini(): Observable<any[]> {
    return this.http.get<any[]>(SERVER_API.urlGetOrdini);
  }

  //PUT ORDINE COME EVASO
  ordineEvaso(id: string): Promise<void> {
    return this.http
      .put<void>(`${SERVER_API.urlPutOrdine}/${id}`, {})
      .toPromise();
  }

  //DELETE ORDINE DA DB
  async eliminaOrdine(id: string): Promise<void> {
    try {
      await this.http.delete(`${SERVER_API.urlDeleteOrdine}/${id}`).toPromise();
    } catch (error) {
      console.error('Errore DELETE ordine:', error);
      throw error;
    }
  }
}
