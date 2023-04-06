import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumComponent } from './forum/forum.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthModule} from "../auth/auth.module";
import {ForumRoutingModule} from "./forum-routing.module";
import {ProfileComponent} from "../profile/profile.component";
import {AuthService} from "../auth.service";
import {AuthenticationGuard} from "../auth.guard";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "../auth.interceptor";



@NgModule({
  declarations: [
    ForumComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ForumRoutingModule
  ],

  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}],
})
export class ForumModule { }
