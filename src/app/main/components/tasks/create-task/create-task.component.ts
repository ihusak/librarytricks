import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TaskService } from '../tasks.service';
import { TaskModel } from '../task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { MainService } from 'src/app/main/main.service';
import { ActivatedRoute } from '@angular/router';
import { CourseInterface } from 'src/app/shared/interface/course.interface';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {NotifyInterface} from '../../../../shared/interface/notify.interface';
import {NotificationTypes} from '../../../../shared/enums/notification-types.enum';
import { TitleService } from 'src/app/shared/title.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  public taskForm: FormGroup;
  public initForm: boolean = false;
  public coursesList;
  public tasksList;
  public userInfo: any;
  private userRoles = UserRolesEnum;
  private readonly courseId: string;
  public currentCourse: any;
  private notifyTypes = NotificationTypes;
  private subscription: Subscription = new Subscription();

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private titleService: TitleService
    ) {
      this.courseId = this.route.snapshot.queryParamMap.get('courseId');
    }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.TASK_LIST.COACH.CREATE_TASK.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    this.userInfo = this.mainService.userInfo;
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      example: ['', [Validators.required, Validators.pattern('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$')]],
      reward: [null, [Validators.required, Validators.max(100), Validators.min(0)]],
      nextTask: ['', [Validators.required]],
      course: [null, [Validators.required]],
    });
    this.initForm = true;
    this.getCourses();
    this.changeCourse(this.courseId);
    // this.getAllTasks();
  }

  private getCourses() {
    const getAllCourses = this.taskService.getAllCourses().subscribe((allcourses: any[]) => {
      let filteredCourses;
      switch (this.userInfo.role.id) {
        case this.userRoles.COACH:
        filteredCourses = allcourses.filter(course => course.coachId === this.userInfo.id);
        break;
        case this.userRoles.ADMIN:
        filteredCourses = allcourses;
        break;
      }
      this.coursesList = filteredCourses;
      this.currentCourse = this.coursesList.find((course: CourseInterface) => {
        return course.id === this.courseId;
      });
    });
    this.subscription.add(getAllCourses);
  }
  private getAllTasks(courseId?: string) {
    const getAllTasks = this.taskService.getAllTasks().subscribe((tasks: TaskModel[]) => {
      this.tasksList = tasks.filter((task: TaskModel) => task.course.id === courseId);
      if (!this.tasksList.length) {
        this.taskForm.removeControl('nextTask');
      } else {
        this.taskForm.setControl('nextTask', new FormControl('', Validators.required));
      }
    });
    this.subscription.add(getAllTasks);
  }
  public createTask() {
    const taskModel = new TaskModel(this.taskForm.value);
    delete taskModel.id;
    if (taskModel.nextTask.id === 'initial') {
      taskModel.allow = true;
    }
    const createTask = this.taskService.createTask(taskModel).subscribe(result => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.TASK_CREATED'), '', {
        duration: 2000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      const notification: NotifyInterface = {
        users: null,
        author: {
          id: this.userInfo.id,
          name: this.userInfo.userName
        },
        title: 'COMMON.COURSE',
        type: this.notifyTypes.NEW_COURSE_TASK,
        userType: [this.userRoles.STUDENT, this.userRoles.PARENT],
        course: {
          id: this.currentCourse.id,
          name: this.currentCourse.name
        }
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
      this.location.back();
    });
    this.subscription.add(createTask);
  }
  public changeCourse(courseId: string) {
    this.getAllTasks(courseId);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
