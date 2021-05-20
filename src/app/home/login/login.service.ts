import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginServiceModule } from './login.service.module';
import { AppService } from 'src/app/app.service';

export enum LoginErrorMessage {
  WRONG_PASSWORD = 'Wrong user password'
}

@Injectable({
  providedIn: LoginServiceModule
})
export class LoginService extends AppService {
  public userId: string;
  public loginUser(email: string, userPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl()}/users/login`, {
      email,
      userPassword
    });
  }
}
