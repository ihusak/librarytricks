import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
    ) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        tap(((event: HttpResponse<any>) => {
          if (this.router.url.indexOf('error') > 0 && event.ok) {
            this.router.navigate(['main/dashboard']);
          }
          return event;
        }),
        (err) => {
          if (!err.status || err.status >= 500) {
            if (req.url.indexOf('notify') < 0) {
              this.router.navigate(['/error']);
            }
          }
        })
    )}
}
