import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ForgotPasswordService {
  constructor(
    public http: HttpClient,
    public appService: AppService
  ) {}
  private token: string;

  get remindToken(): string {
    return this.token;
  }

  set remindToken(value: string) {
    this.token = value;
  }

  public recoveryPassword(password: string, token: string): Observable<any> {
    return this.http.post(`${this.appService.apiUrl()}/recovery`, {password, token}).pipe(map((response) => {
      return response;
    }));
  }
  public remind(email: string): Observable<any> {
    return this.http.post(`${this.appService.apiUrl()}/recovery/remind`, {email}).pipe(map((response) => {
      return response;
    }));
  }
  public resendCode(token: string): Observable<any> {
    return this.http.post(`${this.appService.apiUrl()}/recovery/resend`, {token}).pipe(map((response) => {
      return response;
    }));
  }
  public confirmResetPassword(token: string, code: number): Observable<any> {
    return this.http.post(`${this.appService.apiUrl()}/recovery/confirm`, {token, code}).pipe(map((response) => {
      return response;
    }));
  }
}
