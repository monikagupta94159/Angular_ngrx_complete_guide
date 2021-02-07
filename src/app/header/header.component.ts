import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSubs: Subscription;

  constructor(private dataStorageService: DataStorageService,
     private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>) {}

     ngOnInit() {
       this.userSubs = this.store.select('auth').pipe(map(authState => {
         return authState.user;
       })).subscribe(user => {
          console.log(user);
             this.isAuthenticated = !!user;
        });
     }
  saveRecipes() {
    this.dataStorageService.storeRecipes();
  }

  fetchRecipe() {
    this.dataStorageService.fetchRecipes().subscribe(
      res => {
        console.log(res);
      },
      error => {
       console.log(error);
      }
    );
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }
}
