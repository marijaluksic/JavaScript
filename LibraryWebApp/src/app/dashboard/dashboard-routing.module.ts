import {Route, RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProfileComponent} from "../profile/profile.component";
import {NgModule} from "@angular/core";
import {AuthenticationGuard} from "../guards/auth.guard";
import {UserGuard} from "../guards/user.guard";
import {AdminGuard} from "../guards/admin.guard";
import {ReturnsComponent} from "../admin/returns/returns.component";

const routes : Route[] = [
  {path:'',component: DashboardComponent},
  {path:'profile',component:ProfileComponent, canActivate:[UserGuard]},
  {path:'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule), canActivate:[AdminGuard]},
  {path:'returns',component:ReturnsComponent, canActivate:[AdminGuard]}
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
