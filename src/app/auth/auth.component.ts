import * as AuthActions  from './store/auth.action';
import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  isError: string = null;
  closeSub: Subscription;
  // get access to the directive we use in the template
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  constructor(private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.isError = authState.authError;
      if (this.isError) {
        this.showErrorAlert(this.isError);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm ) {
    this.isLoading = true;
   console.log('data', form);
   const email = form.value.email;
   const password = form.value.password;
   let authObs: Observable<AuthResponseData>;
   if (this.isLoginMode) {
    // authObs =  this.authService.signIn(email, password);
     this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }));
   } else {
    authObs = this.authService.signUp(email, password);
   }

    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.isError = authState.authError;
      if (this.isError) {
        this.showErrorAlert(this.isError);
      }
    });
  //  authObs.subscribe(res => {
  //   console.log(res);
  //   this.isLoading = false;
  //   this.router.navigate(['/recipes']);
  // }, errorMessage => {
  //   console.log(errorMessage);
  //   this.isError = errorMessage;
  //   this.showErrorAlert(errorMessage);
  //   this.isLoading = false;
  // });
   form.reset();
  }

  onHandleError() {
    this.isError = null;
}

private showErrorAlert(message: string) {
  // below apporach will not work for angular it's a way in javascript
    // const alertCmp = new AlertComponent()
 // to get Alertcomponent in angular it requires componentFactoryResolver
  const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
  const hostViewContainerRef = this.alertHost.viewContainerRef;
  // to clear anything that might have been rendered there before
  hostViewContainerRef.clear();
  // now we can use our component factory to create a new alert component in that hostViewContainerRef
  const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
  componentRef.instance.message = message;
 this.closeSub =  componentRef.instance.close.subscribe(() => {
     this.closeSub.unsubscribe();
     hostViewContainerRef.clear();
  });
}

ngOnDestroy() {
  if (this.closeSub) {
    this.closeSub.unsubscribe();
  }
 }
}
