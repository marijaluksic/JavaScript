import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "../register/register.component";
import {Route, RouterModule} from "@angular/router";
import {ForumRoutingModule} from "../forum/forum-routing.module";



@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule

  ]
})
export class AuthModule { }
