import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { DatabaseService } from "../shared/database.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private databaseService: DatabaseService, private recipeService: RecipeService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipeService.getRecipes();
        if(recipes.length === 0) {
            return this.databaseService.fetchRecipes();
        } else {
            return recipes;
        }
    }
}
