import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store-rx/app.reducer';
import * as AuthActions from './auth/store-rx/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
    this.router.navigate(['/recipes']);
  }
}
