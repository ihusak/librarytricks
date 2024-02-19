import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject } from 'rxjs';
import {Injectable} from '@angular/core';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ServerErrorMessage {
  code: number;
  errKey: string;
  errorMessage: string;
}
@Injectable()
export class AppService {
  private domain: string;
  public userInfoSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    public http: HttpClient,
    public cookieService: CookieService
    ) {
      if (environment.production) {
        this.domain = 'lb.afreestylers.com';
      } else {
        this.domain = 'localhost';
      }
    }

  public apiUrl(): string {
    return environment.api_url;
  }

  public setUserDataToLocalStorage(tokens: Tokens, userId: string, role: any) {
    this.cookieService.set('lb_refreshToken', tokens.refreshToken, 9999, '/', this.domain);
    this.cookieService.set('lb_config', tokens.accessToken, 9999, '/', this.domain);
  }

  public setLangToStorage(lang: string) {
    this.cookieService.set('lb_lang', lang, 9999, '/', this.domain);
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
    this.cookieService.delete('lb_config', '/', this.domain);
    this.cookieService.delete('lb_refreshToken', '/', this.domain);
  }

  public updateAccesTokenCookie(tokens) {
    this.cookieService.set('lb_config', tokens.accessToken, 9999, '/', this.domain);
    this.cookieService.set('lb_refreshToken', tokens.refreshToken, 9999, '/', this.domain);
  }
}
