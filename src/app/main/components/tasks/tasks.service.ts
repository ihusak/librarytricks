import { Injectable } from '@angular/core';
import { TaskModel } from './task.model';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { CourseInterface } from 'src/app/shared/interface/course.interface';
import {Observable} from 'rxjs';
import {TaskStatusInterface} from '../../../shared/interface/task-status.interface';
import {HttpClient} from '@angular/common/http';

interface CourseCreateInterface {
  coachId: string;
  text: string;
  video: string;
  forAll: boolean;
  name: string;
  price: number;
}

@Injectable()
export class TaskService {
  constructor(
    public http: HttpClient,
    public appService: AppService
  ) {}
    public getTaskById(id: string): Observable<any> {
        return this.http.get(`${this.appService.apiUrl()}/task/${id}`).pipe(map((task: any) => {
          return new TaskModel(task);
        }));
    }
    public getAllTasks(): Observable<any> {
      return this.http.get(`${this.appService.apiUrl()}/task/list`).pipe(map((tasks: any) => {
        return tasks.map(task => new TaskModel(task));
      }));
    }

    public getTasksByCourse(courseId: string): Observable<any> {
      return this.http.get(`${this.appService.apiUrl()}/task/course/${courseId}/list`).pipe(map((tasks: any) => {
        return tasks.map(task => new TaskModel(task));
      }));
    }

    public getAllCourses(): Observable<any> {
      return this.http.get(`${this.appService.apiUrl()}/courses`);
    }

  public getCoachCourses(coachId: string): Observable<any> {
    return this.http.get(`${this.appService.apiUrl()}/courses/coach/${coachId}`);
  }

    public createCourse(values: CourseCreateInterface): Observable<any> {
      return this.http.post(`${this.appService.apiUrl()}/courses/create-course`, {
        coachId: values.coachId,
        description: {
          text: values.text,
          video: values.video
        },
        forAll: values.forAll,
        name: values.name,
        price: values.price,
      });
    }
    // deprecated
    public getStatusTasks(coachId: string, courseId: string, status: string): Observable<any> {
      return this.http.post(`${this.appService.apiUrl()}/task/status/coach/${coachId}/course/${courseId}`, {status});
    }

    public changeTaskStatus(taskStatus: TaskStatusInterface): Observable<any> {
      return this.http.post(`${this.appService.apiUrl()}/task/status/change`, {taskStatus});
    }

    public getTaskStatusesByCoach(coachId: string): Observable<any> {
      return this.http.get(`${this.appService.apiUrl()}/task/statuses/${coachId}`);
    }

    public createTask(task: TaskModel): Observable<any> {
      return this.http.post(`${this.appService.apiUrl()}/task/create`, task);
    }

    public updateTask(taskId: string, task: TaskModel): Observable<any> {
      return this.http.put(`${this.appService.apiUrl()}/task/update/${taskId}`, task);
    }

    public deleteTask(taskId: string): Observable<any> {
      return this.http.delete(`${this.appService.apiUrl()}/task/delete/${taskId}`);
    }

    public updateCourse(courseId: string, course: CourseCreateInterface): Observable<any> {
      return this.http.put(`${this.appService.apiUrl()}/courses/update/${courseId}`, {course});
    }
}
