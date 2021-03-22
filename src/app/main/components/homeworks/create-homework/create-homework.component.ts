import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {MainService} from '../../../main.service';
import {TaskService} from '../../tasks/tasks.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CourseInterface} from '../../../../shared/interface/course.interface';
import {TaskModel} from '../../tasks/task.model';

@Component({
  selector: 'app-create-homework',
  templateUrl: './create-homework.component.html',
  styleUrls: ['./create-homework.component.scss']
})
export class CreateHomeworkComponent implements OnInit {
  public hmForm: FormGroup;
  public initForm: boolean = false;
  public userInfo: any;
  private userRoles = UserRolesEnum;

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.hmForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      example: ['', [Validators.required, Validators.pattern('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$')]],
      reward: [null, [Validators.required, Validators.max(100), Validators.min(0)]],
      nextTask: ['', [Validators.required]],
      course: [null, [Validators.required]],
    });
    this.initForm = true;
  }
  public createHm() {
    // const taskModel = new TaskModel(this.taskForm.value);
    // delete taskModel.id;
    // if(taskModel.nextTask.id === 'initial') {
    //   taskModel.allow = true;
    // }
    // this.taskService.createTask(taskModel).subscribe(result => {
    //   this.snackBar.open('Задание успешно созданно', '', {
    //     duration: 2000,
    //     panelClass: ['success']
    //   });
    //   this.location.back();
    // });
  }
}
