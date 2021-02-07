import * as ShoppingListActions from './store/shopping-list.action';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // change Ingredients to Observable because ingredients is a property which is of type ingredient
  // ingredients: Ingredient[];
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private igChangeSubscription: Subscription;
  constructor(
    // store contains javacript object key value pair type of the data that we store in the shopping list area has
    // ingredients key ditto same  as we have in shopping-list reducer and add the return type
    // private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // Now I want to use my store here and get access to the Ingredients in that store that will perform both these action
    // that we did before
    // this.ingredients = this.slService.getIngredients();
    // this.igChangeSubscription = this.slService.ingredientsChanged
    //   .subscribe(
    //     (ingredients: Ingredient[]) => {
    //       this.ingredients = ingredients;
    //     }
    //   );
  }

  onEditItem(index: number) {
    debugger;
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    // this.igChangeSubscription.unsubscribe();
  }
}
