import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core.module';
// import { RecipesModule } from './recipes/recipes.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { AlertComponent } from './shared/alert/alert.component';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
// It is important to include shared module here otherwise it won't work if u have any of
// the declaration here which r there in shared module
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { EffectsModule } from '@ngrx/effects';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    // Now RecipesModule is a module which we r trying to load lazyly we must not import RecipesModuleanymore otherwise we r
    // importing both will egarly and lazily at the same time and that will cause an error.
    // RecipesModule,
    // AuthModule,
    // ShoppingListModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    // we r telling ngrx where to find our reducer, ngrx will take reducer into
    // an account and setup an application store.
    // Now u have global store so write it diffrently
    // StoreModule.forRoot({ shoppingList: shoppingListReducer, auth:
    // authReducer })
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
  ],
  // ###****providing the service name in providers has the same effect as @injectable
  // providers: [
  //   // all providers added to coremodule which acting as a shared module for the services of the whole application.
  //          ],
  bootstrap: [AppComponent],
  // when u want to create a component manually alert component we r trying to our on component factory with the alert component
  // and now here angulat does not automatically reachout to the declaration array u instead delibrately need to inform angular
  // this case the alert component willl need to be created at some place now to tell angular do below steps
  entryComponents: [AlertComponent]
})
export class AppModule { }
