import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // we r adding class name because angular can not know that and It needs to know the class name because technically it will
  // go to the path and try to dynamically import the specific object from that file
  {path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'},
  // the effect of this will be that now the code will split at that point and everything on loadchildren path here so this
  // entire module and everything that modules uses so all the declarations of that module will be put into seperate code bundle
   // which is then downloaded and parsed on demand as soon as user visits the path but not sooner
   {path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'},
   {path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  // condition is if internet is slow and component is big about preloadStrategy It will preload the bundles as soon as possible
  // so when we r on the auth page it will already preload recipe and shopping list so that these code bundles r already
  // available when we need them.
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
