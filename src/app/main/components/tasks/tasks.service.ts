import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskModel } from './task.model';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

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

    public getTasksByGroup(groupId: string) {
      return this.http.get(`${this.apiUrl()}/task/group/${groupId}/list`).pipe(map((tasks: any) => {
        return tasks.map(task => new TaskModel(task));
      }));
    }

    public getAllGroups() {
      return this.http.get(`${this.apiUrl()}/groups`);
    }

    public getStatusTasks(coachId: string, groupId: number, status: string) {
      return this.http.post(`${this.apiUrl()}/task/status/coach/${coachId}/group/${groupId}`, {status});
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
