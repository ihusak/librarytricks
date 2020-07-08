import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AppService {
  private loginUserSource = new BehaviorSubject<object>({});
  private userInfoSource = new BehaviorSubject<object>({});
  public userLoginData = this.loginUserSource.asObservable();
  public userInfoData = this.userInfoSource.asObservable();

  public setUserData(tokens: Tokens, userId: string) {
    localStorage.setItem('t', JSON.stringify(tokens));
    localStorage.setItem('userId', userId);
  }

  public getTokens(): Tokens {
    return JSON.parse(localStorage.getItem('t'));
  }

  public getUserId(): string {
    return localStorage.getItem('userId');
  }

  public logout() {
    localStorage.clear();
  }

  public updateAccesToken(newAccesToken) {
    const tokens = JSON.parse(localStorage.getItem('t'));
    tokens.accessToken = newAccesToken;
    localStorage.setItem('t', JSON.stringify(tokens));
  }

  public setUserLoginData(user) {
    this.loginUserSource.next(user);
  }
  public setUserInfoData(userInfo) {
    this.userInfoSource.next(userInfo);
  }
}