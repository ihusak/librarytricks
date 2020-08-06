import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { map } from 'rxjs/operators';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { TaskModel } from '../tasks/task.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    public userInfo;
    private userRoles = UserRolesEnum;

    constructor(private http: HttpClient, protected appService: AppService) {}

    public acceptUserTask(userId: string, task: any) {
      return this.http.put(`api/userInfo/accept-task/${userId}`, {task});
    }

    public changeCurrentTask(task: TaskModel, userId: string) {
      return this.http.put(`api/userInfo/task-status/${userId}`, {task});
    }

    public getUserInfo(id: string) {
      return this.http.get(`api/userInfo/${id}`);
    }

    public getUserInfoByCoach(id: string) {
      return this.http.get(`api/userInfo/coach/${id}`);
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

    public getAllGroups() {
      return this.http.get(`api/groups`);
    }
}