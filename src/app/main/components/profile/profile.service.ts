import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { map } from 'rxjs/operators';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { TaskModel } from '../tasks/task.model';
import { CoachInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { UserCoachModel } from 'src/app/shared/models/user-coach.model';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    public http: HttpClient,
    public appService: AppService
  ) {}
  public userInfo;
  private userRoles = UserRolesEnum;
  // deprecated
  public acceptStudentTask(userId: string, task: any) {
    return this.http.put(`${this.appService.apiUrl()}/userInfo/accept-task/${userId}`, {task});
  }
  // deprecated
  public changeCurrentTask(task: TaskModel, userId: string) {
    return this.http.put(`${this.appService.apiUrl()}/userInfo/task-status/${userId}`, {task});
  }

  public getUserInfo() {
    return this.http.get(`${this.appService.apiUrl()}/userInfo`);
  }

  public getUserInfoWithParams(id: string, roleId: number) {
    return this.http.get(`${this.appService.apiUrl()}/userInfo/${roleId}/${id}`);
  }

  public getUserInfoByCoach(id: string) {
    return this.http.get(`${this.appService.apiUrl()}/userInfo/coach/${id}`);
  }

  public getUsersInfoByCourseId(courseId: string) {
    return this.http.get(`${this.appService.apiUrl()}/userInfo/course/${courseId}`);
  }

  public updateUserInfo(userInfo: any) {
    return this.http.put(`${this.appService.apiUrl()}/userInfo`, userInfo);
  }

  public getAllStudents() {
    return this.http.get(`${this.appService.apiUrl()}/userInfo/all/${this.userRoles.STUDENT}`).pipe(map((userInfo: any) => {
      return userInfo;
    }));
  }

  public getAllCoaches(roleId: number): Observable<UserCoachModel[]> {
    return this.http.get(`${this.appService.apiUrl()}/userInfo/all/${roleId}`).pipe(map((userInfo: CoachInfoInterface[]) => {
      return userInfo.filter((item) => {
        return item.role.id === this.userRoles.COACH;
      }).map(user => {
        return new UserCoachModel(user);
      });
    }));
  }
  public sendInvite(emails: string[], user: {id: string, name: string, email: string, roleId: number}): Observable<any> {
    return this.http.post(`${this.appService.apiUrl()}/users/invite`, {
      emails,
      inviter: user
    });
  }
}
