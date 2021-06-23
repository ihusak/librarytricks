import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerIntercaptor implements HttpInterceptor {

  constructor(
    private router: Router
    ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        tap((event => {
          return event;
        }),
        (err) => {
          if (!err.status || err.status >= 500) {
            if (req.url.indexOf('notify') < 0) {
              this.router.navigate(['/error']);
            }
          }
        })
    )};
}
