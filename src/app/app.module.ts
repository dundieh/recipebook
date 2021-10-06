import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/signup', pathMatch: 'full' },
      {
        path: 'signup',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
      },
      {
        path: 'shopping-list',
        loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
      }
    ]),
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
