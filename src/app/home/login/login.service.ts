import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginServiceModule } from './login.service.module';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: LoginServiceModule
})
export class LoginService extends AppService {
  public userId: string;


  loginUser(email: string, userPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl()}/users/login`, {
      email,
      userPassword
    });
  }
}