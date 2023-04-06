import {NgModule} from "@angular/core";
import {ProfileComponent} from "../profile/profile.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "../auth.interceptor";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import { TitleFilterPipe } from './title-filter.pipe';
import { AuthorFilterPipe } from './author-filter.pipe';
import {UserGuard} from "../guards/user.guard";
import {AdminGuard} from "../guards/admin.guard";
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { NameFilterPipe } from './name-filter.pipe';
import {AdminModule} from "../admin/admin.module";

@NgModule({
    declarations: [
        DashboardComponent,
        ProfileComponent,
        TitleFilterPipe,
        AuthorFilterPipe,
        DashboardDetailComponent,
        NameFilterPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule
    ],

    providers: [UserGuard, AdminGuard, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  exports: [
    NameFilterPipe,
    TitleFilterPipe,
    AuthorFilterPipe
  ]
})
export class DashboardModule { }
