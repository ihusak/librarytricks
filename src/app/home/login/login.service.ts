import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLogin } from '../interface/user.login.interface';

@Injectable()
export class LoginService {
  constructor(
    private http: HttpClient) {}

  loginUser(email: string, userPassword: string): Observable<any> {
    return this.http.post('api/users/login', {
      email,
      userPassword
    });
  }
}