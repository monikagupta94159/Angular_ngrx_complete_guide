import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.action';
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {
 // user = new BehaviorSubject<User>(null);
 tokenExpirationTimer;
  constructor(private http: HttpClient,
    private router: Router,
  private store: Store<fromApp.AppState>) { }

  signUp(email: string, password: string) {
    return this.http
     .post<AuthResponseData>
     ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn );
    }));
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.autoLogout(expiresIn * 1000);
    // this.user.next(user);
    this.store.dispatch(new AuthActions.Login({ email: email, userId: userId, token: token, expirationDate: expirationDate }));
        localStorage.setItem('userData', JSON.stringify(user));
}

autoLogin() {
  const userData: {
    email: string,
    id: string,
    _token: string,
    _tokenExpirationDate: Date
  } = JSON.parse(localStorage.getItem('userData'));

  if (!userData) {
     return;
  }
console.log('expireDate', userData._tokenExpirationDate);
  const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
  if (loadedUser.token) {
    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
    // this.user.next(loadedUser);
    this.store.dispatch(new AuthActions.Login({
      email: userData.email,
      userId: userData.id,
      token: userData._token,
      expirationDate: new Date(userData._tokenExpirationDate)
    }));
  }
}

  signIn(email: string, password: string) {
    return this.http
    .post<AuthResponseData>
    ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(
        resData.email, resData.localId, resData.idToken, +resData.expiresIn
      );
    }));
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'an unknown error occured !';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
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
   return throwError(errorMessage);
  }

  logout() {
     // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
     this.router.navigate(['/auth']);
     localStorage.removeItem('userData');
     if (this.tokenExpirationTimer) {
       clearTimeout(this.tokenExpirationTimer);
     }
     this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
   this.tokenExpirationTimer =  setTimeout(() => {
       this.logout();
    } , expirationDuration);
  }
}
