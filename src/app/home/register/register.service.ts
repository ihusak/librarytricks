import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { UserRole } from '../interface/userRole.interface';
import { AppService } from 'src/app/app.service';
import { UserFormInterface } from './register.component';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RegisterService {
  constructor(
    public http: HttpClient,
    public appService: AppService
  ) {}
  registerUser(userForm: UserFormInterface, registerToken?: string): Observable<any> {
    return this.http.post(`${this.appService.apiUrl()}/users/create`, {
      email: userForm.email,
      userPassword: userForm.password,
      userName: userForm.name,
      userRole: userForm.type,
      invited: userForm.invited,
      registerToken
    });
  }
  public getRoles(): Observable<UserRole[]> {
    return this.http.get(`${this.appService.apiUrl()}/roles`).pipe(map((response: any) => {
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
