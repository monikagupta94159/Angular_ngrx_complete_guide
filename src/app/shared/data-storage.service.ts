import { AuthService } from './../auth/auth.service';
import { Ingredient } from "./ingredient.model";
import { RecipeService } from "./../recipes/recipe.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Recipe } from "../recipes/recipe.model";
import { map, tap, take, exhaustMap } from "rxjs/operators";
Injectable({ providedIn: "root" });

export class DataStorageService {
  constructor(private http: HttpClient,
     private recipeService: RecipeService,
     private authService: AuthService) {}
  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .put("https://ng-recipe-book-30950.firebaseio.com/put.json", recipes)
      .subscribe(data => {
        console.log(data);
      });
  }

  fetchRecipes() {
      return this.http
      .get<Recipe[]>('https://ng-recipe-book-30950.firebaseio.com/put.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }), tap(recipes => {
          this.recipeService.setRecipes(recipes);
    }));
  }

  // commented to rebind how to return two observable at a time.....
  // fetchRecipes() {
  //   return this.authService.user.pipe(take(1),
  //    exhaustMap(user => {
  //     return this.http
  //     .get<Recipe[]>('https://ng-recipe-book-30950.firebaseio.com/put.json', {
  //       params: new HttpParams().set('auth', user.token)
  //     });
  //   }), map(recipes => {
  //     return recipes.map(recipe => {
  //       return {
  //         ...recipe,
  //         ingredients: recipe.ingredients ? recipe.ingredients : []
  //       };
  //     });
  //   }), tap(recipes => {
  //     this.recipeService.setRecipes(recipes);
  //   }));
  // }
}
