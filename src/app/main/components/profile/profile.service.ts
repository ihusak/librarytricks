import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { map } from 'rxjs/operators';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    public userInfo;
    private userRoles = UserRolesEnum;

    constructor(private http: HttpClient, protected appService: AppService) {}

    public getUserInfo(id: string) {
      return this.http.get(`api/userInfo/${id}`);
    }

    public updateUserInfo(id: string, userInfo: any) {
      return this.http.put(`api/userInfo/${id}`, userInfo);
    }

    public getAllStudents() {
      return this.http.get(`api/userInfo/all`).pipe(map((userInfo: any) => {
        return userInfo.filter((item) => {
          return item.role.id === this.userRoles.STUDENT;
        }).map(user => {
          return {
            name: user.userName,
            id: user.id
          }
        })
      }));
    }

    public getAllCoachs() {
      return this.http.get(`api/userInfo/all`).pipe(map((userInfo: any) => {
        return userInfo.filter((item) => {
          return item.role.id === this.userRoles.COACH;
        }).map(user => {
          return {
            name: user.userName,
            id: user.id
          }
        })
      }));
    }
}