import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { catchError, switchMap, filter, take, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private accessToken: string;
  private refreshToken: string;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
    ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
console.log('intercept');
      this.accessToken = this.cookieService.getAll().lb_config;
      this.refreshToken = this.cookieService.getAll().lb_refreshToken;

      if (this.accessToken) {
        req = this.addToken(req, this.accessToken);
      }
      return next.handle(req)
        .pipe(catchError((err) => {
          if (err.status === 403) {
            return this.handleExpireToken(req, next);
          } else if (err.status === 401) {
            this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.USER_SESSION_EXPIRED_LOGOUT'), '', {
              duration: 2000,
              panelClass: ['error'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
            this.router.navigate(['/']);
            this.appService.clearStorage();
          }
          return throwError(err);
        }));
    }
    private addToken(req: HttpRequest<any>, token: string) {
      const authReq = req.clone({
        // headers: req.headers.set('Authorization', `Bearer ${token}`),
        withCredentials: true
      });
      return authReq;
    }

    private handleExpireToken(request: HttpRequest<any>, next: HttpHandler) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);
        return this.authService.updateAccessToken(this.refreshToken)
        .pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.appService.updateAccesTokenCookie(token);
            return next.handle(this.addToken(request, token.accessToken));
          })
        );
      } else {
        return this.refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(jwt => next.handle(this.addToken(request, jwt)))
        );
      }
    }
}
