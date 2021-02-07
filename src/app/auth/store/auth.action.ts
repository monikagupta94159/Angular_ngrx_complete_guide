import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_FAIL = '[Auth] Login fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const SIGNUP = '[Auth] Signup';
export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';

export class Login implements Action {
  readonly type = LOGIN;
  constructor(
    public payload: {
      email: string,
      userId: string,
      token: string,
      expirationDate: Date
    }
  ) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
  constructor() { }
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: {
    email: string,
    password: string
  }) {}
}
export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;
  constructor(public payload: string) {}
}
export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload:  {
    email: string,
    password: string
  }) {}
}
export type AuthActions = Login | Logout | LoginStart | LoginFail | SignupStart;
