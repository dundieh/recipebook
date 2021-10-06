import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { AuthGuard } from "../auth/auth.guard";
import { RecipesComponent } from "./recipes.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesResolverService } from "./recipes.resolver.service";
import { DropdownDirective } from "../shared/dropdown.directive";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        RecipesComponent,
        RecipeDetailComponent,
        RecipeListComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
    imports: [
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard],
                children: [
                    { path: '', component: RecipeStartComponent },
                    { path: 'new', component: RecipeEditComponent },
                    { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
                    { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] }
                ]
            }
        ]),
        SharedModule
    ]
})
export class RecipesModule {}