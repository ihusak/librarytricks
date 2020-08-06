import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskModel } from './task.model';
import { map } from 'rxjs/operators';

@Injectable()
export class TaskService {
    constructor(private http: HttpClient) {}

    public getTaskById(id: string) {
        return this.http.get(`api/task/${id}`).pipe(map((task: any) => {
          return new TaskModel(task);
        }));
    }
    public getAllTasks() {
      return this.http.get(`api/task/all`).pipe(map((tasks: any) => {
        return tasks.map(task => new TaskModel(task));
      }));
    }

    public getAllGroups() {
      return this.http.get(`api/groups`);
    }

    public getStatusTasks(coachId: string, groupId: number, status: string) {
      return this.http.post(`api/task/status/coach/${coachId}/group/${groupId}`, {status});
    }

    public createTask(task: TaskModel) {
      return this.http.post(`api/task/create-task`, task);
    }

    public updateTask(taskId: string, task: TaskModel) {
      return this.http.put(`api/task/update-task/${taskId}`, task);
    }

    public deleteTask(taskId: string) {
      return this.http.delete(`api/task/delete-task/${taskId}`);
    }
}