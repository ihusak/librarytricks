import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { catchError, switchMap, filter, take, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private accesToken: string;
  private refreshToken: string;

  constructor(private appService: AppService, private authService: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      this.accesToken = this.appService.getTokens().accessToken;
      this.refreshToken = this.appService.getTokens().refreshToken;

      if(this.accesToken) {
        req = this.addToken(req, this.accesToken);
      }
      return next.handle(req)
      .pipe(catchError((err) => {
        if (err.status === 403) {
          console.log('REfrashing token');
          return this.handleExpireToken(req, next);
        } else {
          return throwError(err);
        }
      }));
    }
    private addToken(req: HttpRequest<any>, token: string) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
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
            this.appService.updateAccesToken(token.accessToken);
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
