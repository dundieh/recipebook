import { EventEmitter, Output } from "@angular/core";
import { Recipe } from "./recipe.model";

export class RecipeService {
    private recipes: Recipe[] = [
        new Recipe(
            'Red Sauce Pasta',
            'italian meal', 'https://www.wikihow.com/images/a/aa/Prepare-Spicy-Macaroni-with-Tomato-Sauce-Step-5.jpg'
        )
    ];
    recipeSelected = new EventEmitter<Recipe>();

    getRecipes() {
        return this.recipes.slice();
    }
}