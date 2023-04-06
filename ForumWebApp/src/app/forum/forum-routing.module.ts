import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {ForumComponent} from "./forum/forum.component";
import {ProfileComponent} from "../profile/profile.component";
import {AuthModule} from "../auth/auth.module";
import {ForumModule} from "./forum.module";


const routes : Route[] = [
  {path:'',component: ForumComponent},
  {path:'profile',component:ProfileComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
