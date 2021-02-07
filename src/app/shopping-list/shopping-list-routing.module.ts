import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { ShoppingListComponent } from './shopping-list.component';

const route: Routes = [
  // make sure empty the path
  // { path: 'shopping-list', component: ShoppingListComponent }
  { path: '', component: ShoppingListComponent }

];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule {}
