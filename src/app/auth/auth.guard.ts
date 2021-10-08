import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import * as fromApp from '../store-rx/app.reducer';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private store: Store<fromApp.AppState>) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        routerState: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            take(1),
            map((authState) => authState.user),
            map((user) => {
                const isAuth = !!user;
                if(isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/signup']);
            })
        );
    }
}