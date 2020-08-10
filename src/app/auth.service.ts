import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AppService {

  public updateAccessToken(refreshToken: string): Observable<object> {
    return this.http.post(`${this.apiUrl()}/users/token`, {refreshToken});
  }

  public logout(token: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {token}
    };
    return this.http.delete(`${this.apiUrl()}/users/logout`, options).pipe(
      catchError(err => {
        console.log('ERROR LOGOUT');
        return throwError(err);
      })
    );
  }
}