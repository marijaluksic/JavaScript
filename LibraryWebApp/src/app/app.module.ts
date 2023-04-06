import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth.service";
import {AuthenticationGuard} from "./guards/auth.guard";
import {  BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent} from "./auth/login/login.component";
import {RouterModule} from "@angular/router";
import {AuthModule} from "./auth/auth.module";
import {AuthInterceptor} from "./auth.interceptor";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    AuthModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService, AuthenticationGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
