import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private userInfoSource = new BehaviorSubject<object>({});
  public userInfoData = this.userInfoSource.asObservable();

  constructor(
    protected http: HttpClient) {}

  public apiUrl(): string{
    return environment.api_url;
  }

  public setUserDataToLocalStorage(tokens: Tokens, userId: string, role: any) {
    localStorage.setItem('t', JSON.stringify(tokens));
    localStorage.setItem('userId', userId);
    localStorage.setItem('roleId', role.id);
  }

  public getTokens(): Tokens {
    return JSON.parse(localStorage.getItem('t'));
  }

  public getUserId(): string {
    return localStorage.getItem('userId');
  }

  public getUserRole(): number {
    return parseInt(localStorage.getItem('roleId'), 10);
  }

  public clearStorage() {
    localStorage.clear();
  }

  public updateAccesToken(newAccesToken) {
    const tokens = JSON.parse(localStorage.getItem('t'));
    tokens.accessToken = newAccesToken;
    localStorage.setItem('t', JSON.stringify(tokens));
  }
  public setUserInfoData(userInfo) {
    userInfo.startTraining = moment(userInfo.startTraining).format('DD.MM.YYYY');
    this.userInfoSource.next(userInfo);
  }
}