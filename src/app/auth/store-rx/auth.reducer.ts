import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user: User,
    authError: string,
    loading: boolean
}

export const initState: State = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state = initState, action: AuthActions.AuthActions) {
    switch(action.type) {
        case AuthActions.SIGNUP_START:
        case AuthActions.LOGIN_START:
            return {
                ...state,
                loading: true,
                authError: null
            };

        case AuthActions.SIGNUP_LOGIN:
            const user = new User(action.payload.email, action.payload.userID, action.payload.token, action.payload.expirationDate);
            return {
                ...state,
                authError: null,
                user: user,
                loading: false
            };

        case AuthActions.SIGNUP_LOGIN_FAIL:
            return {
                ...state,
                authError: action.payload,
                user: null,
                loading: false
            };

        case AuthActions.LOGOUT: 
            return {
                ...state,
                user: null
            };

        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            };

        default: return state;
    }
}