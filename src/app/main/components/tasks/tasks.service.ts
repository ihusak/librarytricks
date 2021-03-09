import { Injectable } from '@angular/core';
import { TaskModel } from './task.model';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { CourseInterface } from 'src/app/shared/interface/course.interface';

interface CourseCreateInterface {
  coachId: string;
  text: string;
  video: string;
  forAll: boolean;
  name: string;
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

    public createCourse(values: CourseCreateInterface) {
      return this.http.post(`${this.apiUrl()}/courses/create-course`, {
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
