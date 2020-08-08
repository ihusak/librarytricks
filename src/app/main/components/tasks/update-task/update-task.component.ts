import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TaskModel } from '../task.model';
import { TaskService } from '../tasks.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss']
})
export class UpdateTaskComponent implements OnInit, AfterViewInit {
  public tasksList: TaskModel[];
  public taskForm: FormGroup;
  public initForm: boolean = false;
  public groupsList;
  private taskId: string;
  private nextTask: string;
  private currentTask: TaskModel;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location) {
      activateRoute.params.subscribe(params => this.taskId = params.id);
     }

  ngOnInit() {
    this.getCurrentTasks(this.taskId);
  }
  ngAfterViewInit() {

  }

  public uptadeTask() {
    const updatedTask = new TaskModel(this.taskForm.value);
    if (!this.tasksList.length) {
      updatedTask.allow = true;
    }
    if (this.taskForm.valid) {
      this.taskService.updateTask(this.taskId, updatedTask).subscribe(result => {
        this.snackBar.open('Задание успешно обновленно', '', {
          duration: 2000,
          panelClass: ['success']
        });
        this.location.back();
      });
    } else {
      this.snackBar.open('Все поля должны быть заполнены', '', {
        duration: 2000,
        panelClass: ['error']
      });
    }
  }

  private getCurrentTasks(id: string) {
    this.taskService.getTaskById(id).subscribe((task: TaskModel) => {
      this.nextTask = task.nextTask.id;
      this.currentTask = task;
      this.taskForm = this.formBuilder.group({
        title: [task.title, [Validators.required]],
        description: [task.description, [Validators.required]],
        example: [task.example, [Validators.required]],
        reward: [task.reward, [Validators.required]],
        nextTask: [task.nextTask.id, [Validators.required]],
        group: [task.group, [Validators.required]],
        allow: [task.allow],
        _id: [task.id],
      });
      this.nextTask = task.nextTask.id;
      this.getAllTasks(task.group.id);
      this.getGroups();
      this.initForm = true;
    });
  }

  private getAllTasks(groupId?: string) {
    this.taskService.getAllTasks().subscribe((tasks: TaskModel[]) => {
      this.tasksList = tasks.filter((task: any) => task.group.id === groupId && this.currentTask.id !== task.id);
      if (!this.tasksList.length) {
        this.taskForm.removeControl('nextTask');
      } else {
        this.taskForm.setControl('nextTask', new FormControl('', Validators.required));
      }
    });
  }

  private getGroups() {
    this.taskService.getAllGroups().subscribe(allGroups => {
      this.groupsList = allGroups;
    })
  }

  public changeGroup(group) {
    const groupId: string = group.id;
    this.getAllTasks(groupId);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  compareNextTask(o1: any, o2: any): boolean {
    return o1 === o2;
  }
}
