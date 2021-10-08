import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from '../shared/database.service';
import * as fromApp from '../store-rx/app.reducer';
import * as AuthActions from '../auth/store-rx/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth: boolean = false;
  private userSub: Subscription;

  constructor(private databaseService: DatabaseService, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userSub = this.store.select('auth')
    .pipe(map((authState) => authState.user))
    .subscribe((user) => {
      this.isAuth = !!user;
    });
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  onSaveData() {
    this.databaseService.storeRecipes();
  }

  onFetchData() {
    this.databaseService.fetchRecipes().subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
