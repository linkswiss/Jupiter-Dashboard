import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { share, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppConfigService } from '../app-config/app-config.service';
import {ERole, User, UserAuthRQ} from "../dashboard-api/dashboard-api-client";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: User = null;

  constructor(private appConfigService: AppConfigService, private httpClient: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {
    this.currentUser = this.getCurrentUser();
  }

  isRole(role: ERole): boolean {
    let tokenDecoded = this.jwtHelper.decodeToken();
    if (tokenDecoded && this.currentUser) {
      // Check role on both Token and on CurrentUser (Avoid manual change on user storage)
      return tokenDecoded.role === role && this.currentUser.Role === role;
    } else {
      return false;
    }

    // console.log(this.jwtHelper.isTokenExpired());
    // console.log(this.jwtHelper.getTokenExpirationDate());
    // console.log(this.jwtHelper.decodeToken());

  }

  isAuthenticatedOrRefresh(): Observable<boolean> {
    return new Observable(obs => {
      if (this.currentUser) {
        if (!this.jwtHelper.isTokenExpired()) {
          obs.next(true);
        } else {
          this.refreshToken().subscribe(user => {
              this.saveCurrentUser(user);
              obs.next(true);
            },
            error => {
              this.deleteCurrentUser();
              this.router.navigate(['auth/login']);
              obs.next(false);
            });
        }
      } else {
        obs.next(false);
      }
    });

    // if (this.currentUser && this.jwtHelper.isTokenExpired()) {
    //   this.refreshToken().subscribe(user => {
    //       this.saveCurrentUser(user);
    //     },
    //     error => {
    //       this.deleteCurrentUser();
    //     });
    // }
    // // TODO check also JWT??
    // return this.currentUser !== undefined && this.currentUser != null;
  }

  login(userAuthRQ: UserAuthRQ): Observable<User> {
    return new Observable(obs => {
      this.httpClient.post<User>(this.appConfigService.config.dashboardApi.methods.user.authenticate, userAuthRQ)
      // .pipe(share())
          .subscribe(user => {
              this.saveCurrentUser(user);
              obs.next(user);
            },
            error => {
              obs.error(error);
            });
    });
  }

  logout(): Observable<boolean> {
    return new Observable(obs => {

      this.httpClient.get(this.appConfigService.config.dashboardApi.methods.user.logout)
          .subscribe(user => {
              this.deleteCurrentUser();
              obs.next(true);
            },
            error => {
              this.deleteCurrentUser();
              console.log(error);
              obs.next(true);
            });
    });
  }

  refreshToken(): Observable<User> {
    return new Observable(obs => {
      this.httpClient.post<User>(this.appConfigService.config.dashboardApi.methods.user.refreshToken, this.currentUser)
      // .pipe(share())
          .subscribe(user => {
              this.saveCurrentUser(user);
              obs.next(user);
            },
            error => {
            // TODO redirect to auth/login
              obs.error(error);
            });
    });
  }

  private deleteCurrentUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  private saveCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  private getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  getJupiterDashboardApiJwtToken(): string {
    return this.currentUser ? this.currentUser.Token : null;
  }

  getJupiterApiJwtToken(): string {
    return this.currentUser ? this.currentUser.ApiToken : null;
  }
}
