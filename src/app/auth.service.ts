import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  public updateAccessToken(refreshToken: string): Observable<object> {
    return this.http.post('api/users/token', {refreshToken});
  }

  public logout(token: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {token}
    };
    return this.http.delete('api/users/logout', options).pipe(
      catchError(err => {
        console.log('ERROR LOGOUT');
        return throwError(err);
      })
    );
  }
}