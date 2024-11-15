import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
/**
 * Intercept http request to preven user to doing some stuff
 */
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoader();
    if (req.url.indexOf('notify') > 0) {
      this.onEnd();
    }
    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.onEnd();
      }
    },
      (err: any) => {
        this.onEnd();
    }));
  }
  /**
   * End request
   */
  private onEnd(): void {
    this.hideLoader();
  }
  /**
   * Show loader when requestion to server
   */
  private showLoader(): void {
    this.loaderService.show();
  }
  /**
   * Hide preloader when request done
   */
  private hideLoader(): void {
    this.loaderService.hide();
  }
}
