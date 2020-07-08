import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    public userInfo;

    constructor(private http: HttpClient, protected appService: AppService) {}

    public createUserInfo(id: string) {
      let userLoginData;
      this.appService.userLoginData.subscribe((user: any) => {
        userLoginData = user;
      });
      return this.http.post('api/userInfo', {id, email: userLoginData.email, userName: userLoginData.userName});
    }

    public getUserInfo(id: string) {
      return this.http.get(`api/userInfo/${id}`);
    }

    public updateUserInfo(id: string, userInfo: any) {
      return this.http.put(`api/userInfo/${id}`, userInfo);
    }
}