import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class adminGuard implements CanActivate {
  isAdmin: boolean | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.checkGuard().pipe(
      tap((isAdmin) => {
        if (!isAdmin) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
