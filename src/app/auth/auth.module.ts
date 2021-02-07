import { SharedModule } from './../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
   AuthComponent
  ],
  exports: [
   AuthComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(
      [
        // make sure empty path for lazy loading
        { path: '', component: AuthComponent}
      ]
    )
  ]
})
export class AuthModule {}
