import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { UserRole } from '../interface/userRole.interface';
import { AppService } from 'src/app/app.service';
import { UserFormInterface } from './register.component';

@Injectable()
export class RegisterService extends AppService {

  registerUser(userForm: UserFormInterface): Observable<any> {
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
      }));
    }),
    catchError((err) => {
      return throwError(err);
    }));
  }
}
