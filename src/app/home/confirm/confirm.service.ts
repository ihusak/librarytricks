import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject, Observable, pipe } from 'rxjs';
import { AppService } from 'src/app/app.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class ConfirmService extends AppService {
  constructor(
    public http: HttpClient,
    public cookieService: CookieService
  ) {
    super(http, cookieService);
  }
  confirmRegister(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl()}/users/confirm/${token}`);
  }

  confirmCoach(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl()}/userInfo/confirm/coach/${token}`);
  }
}
