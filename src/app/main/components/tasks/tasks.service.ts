import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskModel } from './task.model';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

interface createCourseInterface {
  courseName: string;
  coachId: string;
  forAll: boolean;
  price: number;
}

@Injectable()
export class TaskService extends AppService {

    public getTaskById(id: string) {
        return this.http.get(`${this.apiUrl()}/task/${id}`).pipe(map((task: any) => {
          return new TaskModel(task);
        }));
    }
    public getAllTasks() {
      return this.http.get(`${this.apiUrl()}/task/list`).pipe(map((tasks: any) => {
        return tasks.map(task => new TaskModel(task));
      }));
    }

    public getTasksByCourse(courseId: string) {
      return this.http.get(`${this.apiUrl()}/task/course/${courseId}/list`).pipe(map((tasks: any) => {
        return tasks.map(task => new TaskModel(task));
      }));
    }

    public getAllCourses() {
      return this.http.get(`${this.apiUrl()}/courses`);
    }

    public createCourse(values: createCourseInterface) {
      return this.http.post(`${this.apiUrl()}/courses/create-course`, {
        courseName: values.courseName,
        coachId: values.coachId,
        forAll: values.forAll,
        price: values.price
      });
    }

    public getStatusTasks(coachId: string, courseId: string, status: string) {
      return this.http.post(`${this.apiUrl()}/task/status/coach/${coachId}/course/${courseId}`, {status});
    }

    public createTask(task: TaskModel) {
      return this.http.post(`${this.apiUrl()}/task/create`, task);
    }

    public updateTask(taskId: string, task: TaskModel) {
      return this.http.put(`${this.apiUrl()}/task/update/${taskId}`, task);
    }

    public deleteTask(taskId: string) {
      return this.http.delete(`${this.apiUrl()}/task/delete/${taskId}`);
    }
}
