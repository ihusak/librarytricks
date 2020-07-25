import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLogin } from '../interface/user.login.interface';

@Injectable()
export class ConfirmService {
  constructor(
    private http: HttpClient) {}

  confirmRegister(token: string): Observable<any> {
    return this.http.get(`api/users/confirm/${token}`);
  }

  confirmCoach(token: string): Observable<any> {
    return this.http.get(`api/userInfo/confirm/coach/${token}`);
  }
}