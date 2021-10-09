import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store-rx/app.reducer';

@Injectable()
export class RecipesEffects {
    @Effect()
    fetchRecipes = this.actions$
    .pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http
            .get<Recipe[]>('https://recipe-book-1021-default-rtdb.io.com/recipes.json')
        }),
        map((recipesArray) => {
            return recipesArray.map((recipe) => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            })
        }),
        map((recipes) => new RecipesActions.SetRecipes(recipes)),
    );

    @Effect({ dispatch: false })
    storeRecipes = this.actions$
    .pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
            return this.http.put('https://recipe-book-1021-default-rtdb.firebaseio.com/recipes.json', recipesState.recipes);
        })
    );

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}