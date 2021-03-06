import { NgModule } from "@angular/core";
import { RecipeService } from "./recipes/recipe.service";
import { DataStorageService } from "./shared/data-storage.service";
import { RecipesResolverService } from "./recipes/recipes-resolver.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";

@NgModule({
  providers: [
           RecipeService,
           DataStorageService,
           RecipesResolverService,
             {
              provide: HTTP_INTERCEPTORS,
              useClass: AuthInterceptorService,
              multi: true
             }
  ]
})
export class CoreModule {}
