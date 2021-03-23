import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface HomeworkInterface {
  students: [{id: string, name: string}];
  title: string;
  description: string;
  example: string;
  reward: number;
  createdDate: Date;
}

class HomeworksModel {
  students: [{id: string, name: string}];
  title: string;
  description: string;
  example: string;
  reward: number;
  createdDate: Date;
  constructor(obj) {
    this.students = obj.students.map(st => ({id: st.id, name: st.name}));
    this.title = obj.title;
    this.description = obj.description;
    this.example = obj.example;
    this.reward = obj.reward;
    this.createdDate = obj.createdDate;
  }
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

}
