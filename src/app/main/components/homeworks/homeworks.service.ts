import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HomeworksModel } from './homeworks.model';
import { HttpHeaders } from '@angular/common/http';

export interface HomeworkInterface {
  id: string;
  students: [{id: string, name: string}];
  title: string;
  description: string;
  example: string;
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
  public deleteHomework(homeworkId: string): Observable<object> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {homeworkId}
    };
    return this.http.delete(`${this.apiUrl()}/homeworks/delete`, options).pipe(map(((res: HomeworkInterface[]) => {
      return res;
    })));
  }
  public getHomeworkById(homeworkId: string): Observable<HomeworksModel> {
    return this.http.get(`${this.apiUrl()}/homeworks/${homeworkId}`).pipe(map(((res: HomeworkInterface) => {
      return new HomeworksModel(res);
    })));
  }
  public getAllHomeworks(): Observable<HomeworkInterface[]> {
    return this.http.get(`${this.apiUrl()}/homeworks`).pipe(map(((res: HomeworkInterface[]) => {
      return res.map(item => new HomeworksModel(item));
    })));
  }
  public like(userId: string, homeworkId: string): Observable<any> {
    return this.http.put(`${this.apiUrl()}/homeworks/like`, {userId, homeworkId}).pipe(map(((res: HomeworkInterface[]) => {
      return new HomeworksModel(res);
    })));
  }
  public updateHomework(homeworkId: string, homework: HomeworksModel): Observable<object> {
    return this.http.put(`${this.apiUrl()}/homeworks/update/${homeworkId}`, homework).pipe(map(((res: HomeworkInterface[]) => {
      return res;
    })));
  }

}
