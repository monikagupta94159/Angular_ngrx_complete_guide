import { take, exhaustMap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService,
  private store: Store<fromApp.AppState>) { }
  // to add token to each url that we are calling
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // take means we want to use the logged user data for 1 time
    // exhaustMap used to execute to observables one by one first is auth observable
    // and another observable we are returning as modified request
    return this.store.select('auth').pipe(take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
        return next.handle(modifiedReq);
      }));
  }
 }
