import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {LoginComponent} from "./auth/login/login.component";
import {AuthModule} from "./auth/auth.module";
import {AuthenticationGuard} from "./auth.guard";
import {RegisterComponent} from "./register/register.component";


const routes : Route[] = [
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'',loadChildren: () => import('./forum/forum.module').then(m => m.ForumModule), canActivate:[AuthenticationGuard]}
];
// ovo tsconfig : esnext
@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash:true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
