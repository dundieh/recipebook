import { Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    private recipes: Recipe[] = [
        new Recipe(
            'Red Sauce Pasta',
            'Italian Meal',
            'https://www.wikihow.com/images/a/aa/Prepare-Spicy-Macaroni-with-Tomato-Sauce-Step-5.jpg',
            [
                new Ingredient('red sauce', 1),
                new Ingredient('pasta', 3)
            ]
        ),
        new Recipe(
            'Beef Burger',
            'American Fast Food',
            'https://www.thespruceeats.com/thmb/POpuxXZ8hoq56_m7KUPcy41clvo=/2668x2001/smart/filters:no_upscale()/indian-style-burger-1957599-hero-01-266103a4bb4e4ee7b5feb4da2d2e99da.jpg',
            [
                new Ingredient('Beef Meat', 2),
                new Ingredient('Cheese', 2),
                new Ingredient('Bread', 4)
            ]
        )
    ];

    constructor(private shoppingListService: ShoppingListService) {}

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }
}