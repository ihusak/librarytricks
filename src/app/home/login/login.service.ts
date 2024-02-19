import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginServiceModule } from './login.service.module';
import { AppService } from 'src/app/app.service';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

export enum LoginErrorMessage {
  WRONG_PASSWORD = 'Wrong user password'
}

@Injectable({
  providedIn: LoginServiceModule
})
export class LoginService extends AppService {
  constructor(
    public http: HttpClient,
    public cookieService: CookieService
  ) {
    super(http, cookieService);
  }
  public userId: string;
  public loginUser(email: string, userPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl()}/users/login`, {
      email,
      userPassword
    });
  }
}
