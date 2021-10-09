import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';

export interface State {
    recipes: Recipe[];
}

const initState: State = {
    recipes: null
}

export function recipesReducer(state = initState, action: RecipesActions.RecipesActions) {
    switch(action.type) {
        case RecipesActions.SET_RECIPES: return {
            ...state,
            recipes: [...action.payload],
        };

        case RecipesActions.ADD_RECIPE: return {
            ...state,
            recipes: [...state.recipes, action.payload]
        };

        case RecipesActions.UPDATE_RECIPPE: 
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            };
            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe;

            return {
                ...state,
                recipes: updatedRecipes
            };

        case RecipesActions.DELETE_RECIPE: 
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => index !== action.payload)
            };
            
        default: return state;
    }
}