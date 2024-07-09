import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private authTokenKey = 'authToken';

  constructor() {}

  // Salva il token nel localStorage
  setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  // Recupera il token dal localStorage
  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  // Rimuove il token dal localStorage
  removeAuthToken(): void {
    localStorage.removeItem(this.authTokenKey);
  }
}
