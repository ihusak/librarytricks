import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    protected http: HttpClient,
    protected cookieService: CookieService
    ) {}

  public apiUrl(): string {
    return environment.api_url;
  }

  public setUserDataToLocalStorage(tokens: Tokens, userId: string, role: any) {
    this.cookieService.set('lb_refreshToken', tokens.refreshToken, 9999, '/');
    this.cookieService.set('lb_config', tokens.accessToken, 9999, '/');
  }

  public getTokens(): Tokens {
    return {
      accessToken: this.cookieService.get('lb_config'),
      refreshToken:  this.cookieService.get('lb_refreshToken')
    };
  }

  public getUserId(): string {
    return localStorage.getItem('userId');
  }

  public getUserRole(): number {
    return parseInt(localStorage.getItem('roleId'), 10);
  }

  public clearStorage() {
    this.cookieService.delete('lb_config', '/');
    this.cookieService.delete('lb_refreshToken', '/');
  }

  public updateAccesToken(newAccesToken) {
    this.cookieService.set('lb_config', newAccesToken, 9999, '/');
  }
}
