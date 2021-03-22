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

@Injectable({
  providedIn: 'root'
})
export class HomeworksService extends AppService {

  public createHomework(homework: HomeworkInterface): Observable<any> {
    return this.http.post(`${this.apiUrl()}/homeworks/create`, homework);
  }

}
