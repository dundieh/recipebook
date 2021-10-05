import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
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

    constructor(private http: HttpClient) {}

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
}