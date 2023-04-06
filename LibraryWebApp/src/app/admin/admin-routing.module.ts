import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {AdminComponent} from "./admin/admin.component";

const routes : Route[] = [
  {path:'',component: AdminComponent}

];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
