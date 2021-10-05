import { HttpClient, HttpParams } from "@angular/common/http";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class DatabaseService {
    constructor(private recipeService: RecipeService, private http: HttpClient, private authService: AuthService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://recipe-book-1021-default-rtdb.firebaseio.com/recipes.json', recipes)
        .subscribe((res) => {
            console.log(res);
        });
    }

    fetchRecipes() {
        return this.authService.user.pipe(
            take(1),
            exhaustMap((user) => {
            return this.http.get<Recipe[]>('https://recipe-book-1021-default-rtdb.firebaseio.com/recipes.json',
                {
                    params: new HttpParams().set('auth', user.token)
                }
            );
            }),
            map((recipesArray) => {
                return recipesArray.map((recipe) => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                })
            }),
            tap((recipes) => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}