import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentInfoInterface, ParentInfoInterface, CoachInfoInterface, AdminInfoInterface } from '../shared/interface/user-info.interface';
import { AppService } from '../app.service';
import { interval, Observable, of } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { NotifyModel } from '../shared/models/notify.model';
import { NotifyInterface } from '../shared/interface/notify.interface';

@Injectable()
export class MainService {
  constructor(
    public http: HttpClient,
    public appService: AppService
  ) {}
  public userInfo: StudentInfoInterface | ParentInfoInterface | CoachInfoInterface | AdminInfoInterface;

  public requestCoachPermission(id: string, phone: string) {
    return this.http.post(`${this.appService.apiUrl()}/userInfo/request/coach/${id}`, {
      phone
    });
  }
  public getDefaultNotification(): Observable<any> {
    return this.http.get(`${this.appService.apiUrl()}/notify/default`).pipe(map(res => res));
  }
  public getNotification(): Observable<any> {
    return this.http.get(`${this.appService.apiUrl()}/notify/pending`).pipe(map(res => res));
  }
  public setNotification(notify: NotifyInterface): Observable<any> {
    return this.http.post(`${this.appService.apiUrl()}/notify/post`, {notify});
  }
  public readNotification(userId: string, notifyId: string): Observable<any> {
    return this.http.put(`${this.appService.apiUrl()}/notify/read`, {userId, notifyId});
  }
}
