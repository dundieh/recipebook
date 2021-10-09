import * as formSLA from '../shopping-list/store-rx/shopping-list.reducer';
import * as fromAuth from '../auth/store-rx/auth.reducer';
import * as fromRecipes from '../recipes/store-rx/recipes.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    shoppingList: formSLA.State;
    auth: fromAuth.State;
    recipes: fromRecipes.State
}

export const appReducers: ActionReducerMap<AppState> = {
    shoppingList: formSLA.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipes.recipesReducer
};
