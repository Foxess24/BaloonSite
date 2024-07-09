import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SERVER_API } from '../../api.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfiloService {
  constructor(private http: HttpClient) {}

  getDatiUtente(userId: string): Observable<any> {
    return this.http.get<any>(`${SERVER_API.urlGetUtente}/${userId}`).pipe(
      map((data) => {
        return {
          admin: data.admin,
          cognome: data.cognome,
          email: data.email,
          nome: data.nome,
          username: data.username,
        };
      })
    );
  }
}
