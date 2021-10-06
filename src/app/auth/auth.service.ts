import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
    email: string
    expiresIn: string;
    idToken: string;
    kind: string;
    localId: string;
    refreshToken: string;
    registered?: boolean;
}

@Injectable()
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    private handleError(errorRes: HttpErrorResponse) {
        let errorMsg = 'Unknown Error Occured';
        if(!errorRes.error || !errorRes.error.error) {
            return throwError(errorMsg);
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
        return throwError(errorMsg);
    }

    private handleAuth(email: string, userID: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + (+expiresIn * 1000));
        const user = new User(email, userID, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    signup(Email: string, Password: string) {
        const url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCve4GU31UhLzBO2RCgFguTimUGP8F4VZQ';
        return this.http.post<AuthResponseData>(url, {
            email: Email,
            password: Password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap((responseData) => {
                this.handleAuth(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
            })
        );
    }

    login(Email: string, Password: string) {
        const url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCve4GU31UhLzBO2RCgFguTimUGP8F4VZQ';
        return this.http.post<AuthResponseData>(url, {
            email: Email,
            password: Password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap((responseData) => {
                this.handleAuth(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
            })
        );
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/signup']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
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
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => this.logout, expirationDuration);
    }
}