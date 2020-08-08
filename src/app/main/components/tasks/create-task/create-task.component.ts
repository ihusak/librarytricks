import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TaskService } from '../tasks.service';
import { TaskModel } from '../task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public initForm: boolean = false;
  public groupsList;
  public tasksList;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private location: Location) { }

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      example: ['', [Validators.required]],
      reward: [null, [Validators.required]],
      nextTask: ['', [Validators.required]],
      group: [null, [Validators.required]],
    });
    this.initForm = true;
    this.getGroups();
    this.getAllTasks();
  }

  private getGroups() {
    this.taskService.getAllGroups().subscribe(allGroups => {
      this.groupsList = allGroups;
    })
  }
  private getAllTasks(groupId?: number) {
    this.taskService.getAllTasks().subscribe((tasks: TaskModel[]) => {
      this.tasksList = tasks.filter((task: any) => task.group.id === groupId);
      console.log(tasks,this.tasksList);
      if(!this.tasksList.length) {
        this.taskForm.removeControl('nextTask');
      } else {
        this.taskForm.setControl('nextTask', new FormControl('', Validators.required));
      }
    });
  }
  public createTask() {
    const taskModel = new TaskModel(this.taskForm.value);
    delete taskModel.id;
    if(taskModel.nextTask.id === 'initial') {
      taskModel.allow = true;
    }
    this.taskService.createTask(taskModel).subscribe(result => {
      this.snackBar.open('Задание успешно созданно', '', {
        duration: 2000,
        panelClass: ['success']
      });
      this.location.back();
    });
  }
  public changeGroup(group) {
    console.log(this.taskForm);
    const groupId: number = group.id;
    this.getAllTasks(groupId);
  }
}
