import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as  AuthActions from './auth.action';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { dispatch } from 'rxjs/internal/observable/pairs';
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

// @Injectable is required not to provide this in root but it needs to provide
// so that things can be injected into AuthEffects
@Injectable()
export class AuthEffects {
  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
          }
        ).pipe(map(resData => {
          const expirationDate = new Date(new Date().getTime() + resData.expiresIn);
          return new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate
          });
        }), catchError(errorRes => {
          let errorMessage = 'an unknown error occured !';
    if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.LoginFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
         case 'EMAIL_EXISTS':
            errorMessage = 'email already exist !';
            break;
         case 'EMAIL_NOT_FOUND':
            errorMessage = 'this email does not exist';
            break;
         case 'INVALID_PASSWORD':
            errorMessage = 'this password is not correct !';
            break;
    }
          // of() is a utility to create new observable
          return of(new AuthActions.LoginFail(errorMessage));
        })
     );
    })
  );

  @Effect()
  // ofType simply allows you to define a filter for which type of effect you
  // want to continue in this observable pipe u r creating
  // switchMap allows us to create a new observable by taking another observable
  // data
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(map(resData => {
          const expirationDate = new Date(new Date().getTime() + resData.expiresIn);
          return new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate
          });
        }), catchError(errorRes => {
          let errorMessage = 'an unknown error occured !';
    if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.LoginFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
         case 'EMAIL_EXISTS':
            errorMessage = 'email already exist !';
            break;
         case 'EMAIL_NOT_FOUND':
            errorMessage = 'this email does not exist';
            break;
         case 'INVALID_PASSWORD':
            errorMessage = 'this password is not correct !';
            break;
    }
          // of() is a utility to create new observable
          return of(new AuthActions.LoginFail(errorMessage));
        })
     );
    })
  );

  @Effect({dispatch: false})
  loginSuccess = this.actions$.pipe(ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    }));


  constructor(
    // actions is an observable
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) { }
}
