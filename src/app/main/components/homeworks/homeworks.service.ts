import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HomeworksModel } from './homeworks.model';

export interface HomeworkInterface {
  id: string;
  students: [{id: string, name: string}];
  title: string;
  description: string;
  example: string;
  reward: number;
  createdDate: Date;
  likes: number;
}
@Injectable({
  providedIn: 'root'
})
export class HomeworksService extends AppService {

  public createHomework(homework: HomeworkInterface): Observable<any> {
    return this.http.post(`${this.apiUrl()}/homeworks/create`, homework);
  }
  public getAllHomeworks(): Observable<HomeworkInterface[]> {
    return this.http.get(`${this.apiUrl()}/homeworks`).pipe(map(((res: HomeworkInterface[]) => {
      return res.map(item => new HomeworksModel(item));
    })));
  }
  public like(userId: string, homeworkId: string): Observable<any> {
    return this.http.put(`${this.apiUrl()}/homeworks/like`, {userId, homeworkId}).pipe(map(((res: HomeworkInterface[]) => {
      return new HomeworksModel(res)
    })));
  }

}
