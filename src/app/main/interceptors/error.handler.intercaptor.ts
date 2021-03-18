import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { catchError, switchMap, filter, take, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerIntercaptor implements HttpInterceptor {

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
    ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        tap((event => {}),
        (err) => {})
    )};
}
