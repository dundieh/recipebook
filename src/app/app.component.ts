import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store-rx/app.reducer';
import * as AuthActions from './auth/store-rx/auth.actions';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>, @Inject(PLATFORM_ID) private platformId) {}

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new AuthActions.AutoLogin());
    }
  }
}
