import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { map } from 'rxjs/operators';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { TaskModel } from '../tasks/task.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends AppService {

    public userInfo;
    private userRoles = UserRolesEnum;

    public acceptUserTask(userId: string, task: any) {
      return this.http.put(`${this.apiUrl()}/userInfo/accept-task/${userId}`, {task});
    }

    public changeCurrentTask(task: TaskModel, userId: string) {
      return this.http.put(`${this.apiUrl()}/userInfo/task-status/${userId}`, {task});
    }

    public getUserInfo(id: string, roleId: number) {
      return this.http.get(`${this.apiUrl()}/userInfo`);
    }

    public getUserInfoByCoach(id: string) {
      return this.http.get(`${this.apiUrl()}/userInfo/coach/${id}`);
    }

    public updateUserInfo(id: string, userInfo: any, roleId: number) {
      return this.http.put(`${this.apiUrl()}/userInfo/${id}/${roleId}`, userInfo);
    }

    public getAllStudents(roleId: number) {
      return this.http.get(`${this.apiUrl()}/userInfo/all/${roleId}`).pipe(map((userInfo: any) => {
        return userInfo;
      }));
    }

    public getAllCoaches(roleId: number) {
      return this.http.get(`${this.apiUrl()}/userInfo/all/${roleId}`).pipe(map((userInfo: any) => {
        return userInfo.filter((item) => {
          return item.role.id === this.userRoles.COACH;
        }).map(user => {
          return {
            name: user.userName,
            id: user.id
          };
        });
      }));
    }

    public getAllGroups() {
      return this.http.get(`${this.apiUrl()}/groups`);
    }
}
