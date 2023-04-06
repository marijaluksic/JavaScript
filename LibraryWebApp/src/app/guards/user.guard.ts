import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";


@Injectable()
export class UserGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log(this.authService.getUser() && this.authService.getUser()?.level == 1);

    if (this.authService.isAuthenticated()  && this.authService.getUser()?.level == 1)
      return true;

    this.router.navigate(['/']);
    return false;
  }
}
