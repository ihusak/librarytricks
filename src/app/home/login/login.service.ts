import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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