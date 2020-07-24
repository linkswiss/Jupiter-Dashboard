import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { JwtInterceptor } from '@auth0/angular-jwt';
import { UserService } from '../services/user/user.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private jwtInterceptor: JwtInterceptor) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.jwtInterceptor.isWhitelistedDomain(req) && !this.jwtInterceptor.isBlacklistedRoute(req)) {
      return next.handle(req).pipe(
        catchError((err) => {
          const errorResponse = err as HttpErrorResponse;
          if (errorResponse.status === 401) {
            return this.userService.isAuthenticatedOrRefresh().pipe(mergeMap(() => {
              return this.jwtInterceptor.intercept(req, next);
            }));
          }
          return throwError(err);
        }));
    } else {
      return next.handle(req);
    }


    // if (this.jwtInterceptor.isWhitelistedDomain(req) && !this.jwtInterceptor.isBlacklistedRoute(req)) {
    //
    //   Observable.create(obs => {
    //     this.userService.isAuthenticatedOrRefresh().subscribe(authenticated => {
    //       if (authenticated) {
    //         let nextPiped = next.handle(req).pipe(
    //           catchError((err) => {
    //             const errorResponse = err as HttpErrorResponse;
    //             if (errorResponse.status === 401) {
    //               console.error('Error on call after isAuthenticatedOrRefresh');
    //             }
    //             return throwError(err);
    //           }));
    //
    //         obs.next(nextPiped);
    //
    //         // return next.handle(req).pipe(
    //         //   catchError((err) => {
    //         //     const errorResponse = err as HttpErrorResponse;
    //         //     if (errorResponse.status === 401) {
    //         //       console.error('Error on call after isAuthenticatedOrRefresh');
    //         //     }
    //         //     return throwError(err);
    //         //   }));
    //       } else {
    //         obs.error('Error on refresh token');
    //         // return throwError('Error on refresh token');
    //       }
    //     });
    //
    //   });
    //
    //
    //   // return next.handle(req).pipe(
    //   //   catchError((err) => {
    //   //     const errorResponse = err as HttpErrorResponse;
    //   //     if (errorResponse.status === 401 && errorResponse.error.message === 'Expired JWT Token') {
    //   //       return this.authorizationService.refresh().pipe(mergeMap(() => {
    //   //         return this.jwtInterceptor.intercept(req, next);
    //   //       }));
    //   //     }
    //   //     return throwError(err);
    //   //   }));
    //   //
    //   //
    //   // this.userService.isAuthenticatedOrRefresh();
    //   //
    //   //
    //   // return next.handle(req).pipe(
    //   //   catchError((err) => {
    //   //     const errorResponse = err as HttpErrorResponse;
    //   //     if (errorResponse.status === 401 && errorResponse.error.message === 'Expired JWT Token') {
    //   //       return this.authorizationService.refresh().pipe(mergeMap(() => {
    //   //         return this.jwtInterceptor.intercept(req, next);
    //   //       }));
    //   //     }
    //   //     return throwError(err);
    //   //   }));
    // } else {
    //   return next.handle(req);
    // }
  }

}
