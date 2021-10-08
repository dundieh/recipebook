import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    email: string
    expiresIn: string;
    idToken: string;
    kind: string;
    localId: string;
    refreshToken: string;
    registered?: boolean;
}

const handleAuth = (expiresIn: number, email: string, localId: string, idToken: string) => {
    const expirationDate = new Date(new Date().getTime() + (+expiresIn * 1000));
    const user = new User(email, localId, idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.SignupLogin({
        email: email,
        userID: localId,
        token: idToken,
        expirationDate: expirationDate
    });
};

const handleError = (errorRes: any) => {
    let errorMsg = 'Unknown Error Occured';
    if(!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.SignupLoginFail(errorMsg));
    }
    switch(errorRes.error.error.message) {
        case 'EMAIL_EXISTS': errorMsg = 'This Email Already Exists';
            break;
        case 'EMAIL_NOT_FOUND': errorMsg = 'User Not Found';
            break;
        case 'INVALID_PASSWORD': errorMsg = 'Invalid Password';
            break;
        case 'USER_DISABLED': errorMsg = 'User Is Disabled';
    }
    return of(new AuthActions.SignupLoginFail(errorMsg));
};

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            const url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + environment.firebaseAPIKey;
            return this.http.post<AuthResponseData>(url, {
                email: signupAction.payload.email,
                password: signupAction.payload.password,
                returnSecureToken: true
            }).pipe(
                tap((res) => this.authService.setLogoutTimer(+res.expiresIn * 1000)),
                map((resData) => {
                    return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                }),
                catchError((errorRes) => {
                    return handleError(errorRes);
                })
            )
        }),
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            const url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + environment.firebaseAPIKey;
            return this.http.post<AuthResponseData>(url, {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            }).pipe(
                tap((res) => this.authService.setLogoutTimer(+res.expiresIn * 1000)),
                map((resData) => {
                    return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                }),
                catchError((errorRes) => {
                    return handleError(errorRes);
                })
            )
        }),
    );

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_LOGIN),
        tap(() => {
            this.router.navigate(['/recipes']);
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string;
                id: string;
                _token: string; 
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));

            if(!userData) {
                return;
            }

            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
            if(loadedUser.token) {
                this.authService.setLogoutTimer(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
                return new AuthActions.SignupLogin({
                    email: loadedUser.email,
                    userID: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate)
                });
            }
        })
    );

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/']);
        })
    );

    constructor(private http: HttpClient, private actions$: Actions, private router: Router, private authService: AuthService) {}
}