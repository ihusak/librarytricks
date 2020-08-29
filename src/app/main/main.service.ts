import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfoInterface } from '../shared/interface/user-info.interface';
import { AppService } from '../app.service';

@Injectable()
export class MainService extends AppService {
  public userInfo: UserInfoInterface;
    // getUser(id: string) {
    //     return this.http.get(`api/users/${id}`);
    // }
    public getUserInfo(id: string, roleId: number) {
      return this.http.get(`${this.apiUrl()}/userInfo/${id}/${roleId}`);
    }
    public requestCoachPermission(id: string, phone: string) {
      return this.http.post(`${this.apiUrl()}/userInfo/request/coach/${id}`, {
        phone
      });
    }
}