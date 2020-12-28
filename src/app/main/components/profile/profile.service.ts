import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { map } from 'rxjs/operators';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { TaskModel } from '../tasks/task.model';
import { CoachInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { UserCoachModel } from 'src/app/shared/models/user-coach.model';
import { Observable } from 'rxjs';

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

  public getUserInfo() {
    return this.http.get(`${this.apiUrl()}/userInfo`);
  }

  public getUserInfoWithParams(id: string, roleId: number) {
    return this.http.get(`${this.apiUrl()}/userInfo/${roleId}/${id}`);
  }

  public getUserInfoByCoach(id: string) {
    return this.http.get(`${this.apiUrl()}/userInfo/coach/${id}`);
  }

  public getUsersInfoByGroupId(id: string) {
    return this.http.get(`${this.apiUrl()}/userInfo/group/${id}`);
  }

  public updateUserInfo(userInfo: any) {
    return this.http.put(`${this.apiUrl()}/userInfo`, userInfo);
  }

  public getAllStudents() {
    return this.http.get(`${this.apiUrl()}/userInfo/all/${this.userRoles.STUDENT}`).pipe(map((userInfo: any) => {
      return userInfo;
    }));
  }

  public getAllCoaches(roleId: number): Observable<UserCoachModel[]> {
    return this.http.get(`${this.apiUrl()}/userInfo/all/${roleId}`).pipe(map((userInfo: CoachInfoInterface[]) => {
      return userInfo.filter((item) => {
        return item.role.id === this.userRoles.COACH;
      }).map(user => {
        return new UserCoachModel(user);
      });
    }));
  }

  public getAllGroups() {
    return this.http.get(`${this.apiUrl()}/groups`);
  }
}
