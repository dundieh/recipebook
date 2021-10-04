import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];
    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Red Sauce Pasta',
    //         'Italian Meal - Bellisimo',
    //         'https://www.wikihow.com/images/a/aa/Prepare-Spicy-Macaroni-with-Tomato-Sauce-Step-5.jpg',
    //         [
    //             new Ingredient('red sauce', 1),
    //             new Ingredient('pasta', 3)
    //         ]
    //     ),
    //     new Recipe(
    //         'Beef Burger',
    //         'American Fast Food - just awesome!',
    //         'https://www.thespruceeats.com/thmb/POpuxXZ8hoq56_m7KUPcy41clvo=/2668x2001/smart/filters:no_upscale()/indian-style-burger-1957599-hero-01-266103a4bb4e4ee7b5feb4da2d2e99da.jpg',
    //         [
    //             new Ingredient('Beef Meat', 2),
    //             new Ingredient('Cheese', 2),
    //             new Ingredient('Bread', 4)
    //         ]
    //     )
    // ];

    constructor(private shoppingListService: ShoppingListService) {}

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }
}