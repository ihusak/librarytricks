import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentInfoInterface, ParentInfoInterface, CoachInfoInterface, AdminInfoInterface } from '../shared/interface/user-info.interface';
import { AppService } from '../app.service';

@Injectable()
export class MainService extends AppService {
  public userInfo: StudentInfoInterface | ParentInfoInterface | CoachInfoInterface | AdminInfoInterface;

  public requestCoachPermission(id: string, phone: string) {
    return this.http.post(`${this.apiUrl()}/userInfo/request/coach/${id}`, {
      phone
    });
  }
}
