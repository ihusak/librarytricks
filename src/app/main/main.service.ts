import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfoInterface } from '../shared/interface/user-info.interface';

@Injectable()
export class MainService {
  public userInfo: UserInfoInterface;
    constructor(private http: HttpClient) {}
    // getUser(id: string) {
    //     return this.http.get(`api/users/${id}`);
    // }
    public getUserInfo(id: string) {
      return this.http.get(`api/userInfo/${id}`);
    }
    public requestCoachPermission(id: string, phone: string) {
      return this.http.post(`api/userInfo/request/coach/${id}`, {
        phone
      });
    }
}