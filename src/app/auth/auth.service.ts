import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface AuthResponseData {
    email: string
    expiresIn: string;
    idToken: string;
    kind: string;
    localId: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}

    signup(Email: string, Password: string) {
        const url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCve4GU31UhLzBO2RCgFguTimUGP8F4VZQ';
        return this.http.post<AuthResponseData>(url, {
            email: Email,
            password: Password,
            returnSecureToken: true
        });
    }
}