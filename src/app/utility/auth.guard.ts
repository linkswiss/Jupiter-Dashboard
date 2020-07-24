import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable()
export class AuthGuard implements CanActivateChild {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivateChild() {
    return this.userService.isAuthenticatedOrRefresh()
               .pipe(
                 tap(authenticated => {
                   if (!authenticated) {
                     this.router.navigate(['auth/login']);
                   }
                 }),
               );

    // return this.userService.isAuthenticated().subscribe(authenticated => {
    //   if (authenticated) {
    //     return true;
    //   } else {
    //     this.router.navigate(['auth/login']);
    //   }
    // });
    // if (this.userService.isAuthenticated()) {
    //   return true;
    // } else {
    //   this.router.navigate(['auth/login']);
    // }

  }
}
