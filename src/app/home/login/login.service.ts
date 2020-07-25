import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginServiceModule } from './login.service.module';

@Injectable({
  providedIn: LoginServiceModule
})
export class LoginService {
  public userId: string;
  constructor(
    private http: HttpClient) {}

  loginUser(email: string, userPassword: string): Observable<any> {
    return this.http.post('api/users/login', {
      email,
      userPassword
    });
  }
}