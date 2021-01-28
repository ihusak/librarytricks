import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TaskService } from '../tasks.service';
import { TaskModel } from '../task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { MainService } from 'src/app/main/main.service';
import { AdminInfoInterface, CoachInfoInterface } from 'src/app/shared/interface/user-info.interface';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public initForm: boolean = false;
  public groupsList;
  public tasksList;
  public userInfo: any;
  private userRoles = UserRolesEnum;

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private location: Location) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      example: ['', [Validators.required]],
      reward: [null, [Validators.required, Validators.max(100), Validators.min(0)]],
      nextTask: ['', [Validators.required]],
      group: [null, [Validators.required]],
    });
    this.initForm = true;
    this.getGroups();
    this.getAllTasks();
  }

  private getGroups() {
    this.taskService.getAllGroups().subscribe((allGroups: any[]) => {
      let filteredGroups;
      switch(this.userInfo.role.id) {
        case this.userRoles.COACH: 
          filteredGroups = allGroups.filter(group => group.coachId === this.userInfo.id);
          break;
        case this.userRoles.ADMIN: 
          filteredGroups = allGroups;
          break;
      }
      this.groupsList = filteredGroups;
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
