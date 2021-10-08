import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../store-rx/app.reducer';
import * as AuthActions from './store-rx/auth.actions';

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
    private tokenExpirationTimer: any;

    constructor(private store: Store<fromApp.AppState>) {}
    
    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration
        );
    }

    clearLogoutTimer() {
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}