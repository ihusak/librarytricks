import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { UserRole } from '../interface/userRole.interface';

@Injectable()
export class RegisterService {
  isLoggedIn: boolean;

  constructor(
    private http: HttpClient) {}

  registerUser(email: string, userPassword: string, userName: string, userRole: UserRole): Observable<any> {
    return this.http.post('api/users', {
      email,
      userPassword,
      userName,
      userRole
    });
  }
  public getRoles(): Observable<UserRole[]> {
    return this.http.get('api/roles').pipe(map((response: any) => {
      return response.map(role => ({
          id: role.id,
          title: role.title,
          status: role.status
      }))
    }));
  }
}