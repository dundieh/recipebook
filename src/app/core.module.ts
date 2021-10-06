import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./auth/auth.guard";
import { AuthInterceptorService } from "./auth/auth.interceptor.service";
import { AuthService } from "./auth/auth.service";
import { RecipeService } from "./recipes/recipe.service";
import { RecipesResolverService } from "./recipes/recipes.resolver.service";
import { DatabaseService } from "./shared/database.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";

@NgModule({
    providers: [
        RecipeService,
        ShoppingListService,
        RecipesResolverService,
        DatabaseService,
        AuthService,
        AuthGuard,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        },
      ],
})
export class CoreModule {}