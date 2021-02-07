import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
@Injectable({
  providedIn: 'root'
})

// A routeGuard allows us to run logic right before a route is loaded and we can deny access if certain condition not match .
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,
  private store: Store<fromApp.AppState>) { }
  canActivate(
     route: ActivatedRouteSnapshot,
     router: RouterStateSnapshot,
    ): boolean | Promise<boolean> | Observable<boolean> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      map(user => {
        return  !!user;
        // if (isAuth) {
        //   return true;
        // }
        // return this.router.createUrlTree(['/auth']);
      }),
      tap(isAuth => {
         if (!isAuth) {
           this.router.navigate(['/auth']);
         }
      })
      );
    }
}
