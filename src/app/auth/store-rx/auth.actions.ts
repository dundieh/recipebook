import { Action } from "@ngrx/store";

export const SIGNUP_START = '[Auth] Signup Start';
export const LOGIN_START = '[Auth] Login Start';
export const SIGNUP_LOGIN = '[Auth] Signup Login';
export const SIGNUP_LOGIN_FAIL = '[Auth] Signup Login Fail';
export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR ='[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class SignupStart {
    readonly type = SIGNUP_START;

    constructor(public payload: {email: string, password: string}) {}
}

export class LoginStart {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string, password: string}) {}
}

export class SignupLogin implements Action {
    readonly type = SIGNUP_LOGIN;

    constructor(public payload: {email: string, userID: string, token: string, expirationDate: Date}) {}
}

export class SignupLoginFail implements Action {
    readonly type = SIGNUP_LOGIN_FAIL;

    constructor(public payload: string) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActions = LoginStart | SignupLogin | SignupStart | SignupLoginFail | Logout | ClearError | AutoLogin;