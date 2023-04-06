import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdminRoutingModule} from "./admin-routing.module";
import { ReturnsComponent } from './returns/returns.component';
import {DashboardModule} from "../dashboard/dashboard.module";


@NgModule({
  declarations: [
    AdminComponent,
    ReturnsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    DashboardModule
  ]
})
export class AdminModule { }
