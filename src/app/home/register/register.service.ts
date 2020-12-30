import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { UserRole } from '../interface/userRole.interface';
import { AppService } from 'src/app/app.service';
import { userFormInterface } from './register.component';

@Injectable()
export class RegisterService extends AppService {
  isLoggedIn: boolean;

  registerUser(userForm: userFormInterface): Observable<any> {
    return this.http.post(`${this.apiUrl()}/users/create`, {
      email: userForm.email,
      userPassword: userForm.password,
      userName: userForm.name,
      userRole: userForm.type
    });
  }
  public getRoles(): Observable<UserRole[]> {
    return this.http.get(`${this.apiUrl()}/roles`).pipe(map((response: any) => {
      return response.map(role => ({
          id: role.id,
          name: role.name,
          status: role.status
      }))
    }));
  }
}