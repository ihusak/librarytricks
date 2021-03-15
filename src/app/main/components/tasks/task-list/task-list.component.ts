import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../tasks.service';
import { TaskModel } from '../task.model';
import { MainService } from 'src/app/main/main.service';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../profile/profile.service';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { MatDialog } from '@angular/material/dialog';
import { PassTaskComponent } from '../popups/pass-task/pass-task.component';
import { ProcessTasksComponent } from '../popups/process-tasks/process-tasks.component';
import { CreateCourseComponent } from '../popups/create-course/create-course.component';
import {CourseInterface} from '../../../../shared/interface/course.interface';
import { Checkout, PaymentsService } from '../../payments/payments.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskListComponent implements OnInit {
  public panelOpenState: boolean = false;
  public tasksList: TaskModel[];
  public coursesList: CourseInterface[] = [];
  public currentCourse: CourseInterface = {
    id: '',
    name: '',
    forAll: false,
    coachId: '',
    price: null,
    description: {
      text: '',
      video: ''
    },
    paid: false
  };
  public userInfo: any;
  public userRoles = UserRolesEnum;
  public processingTasks: number = 0;
  public pendingTasks: number = 0;
  public doneTasks: number = 0;
  public taskStatuses = TaskStatuses;
  public processingTasksData: any[] = [];

  constructor(
    private taskService: TaskService,
    private mainService: MainService,
    private profileService: ProfileService,
    private paymentsService: PaymentsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
    ) {
      this.userInfo = this.mainService.userInfo;
    }

  ngOnInit() {
    this.getCourses();
    console.log(this);
  }

  public assignTask(task: TaskModel) {
    task.status = TaskStatuses.PROCESSING;
    this.profileService.changeCurrentTask(task, this.userInfo.id).subscribe((updatedUserInfo: StudentInfoInterface) => {
      this.userInfo = updatedUserInfo;
      this.snackBar.open('Вы начали выполнение задания', '', {
        duration: 2000,
        panelClass: ['success']
      });
    });
  }

  private getAllTasks(courseId?: string) {
    this.taskService.getTasksByCourse(courseId).subscribe((tasks: TaskModel[]) => {
      this.tasksList = tasks;
      const currentStudentDoneTasks = [];
      if (this.userInfo.role.id === UserRolesEnum.STUDENT) {
        this.tasksList.map((task: TaskModel, index) => {
          this.userInfo.doneTasks.find((id: string) => {
            if (id === task.id) {
              currentStudentDoneTasks.push(id);
              task.done = true;
              task.status = this.taskStatuses.DONE;
              if (this.tasksList.length !== currentStudentDoneTasks.length) {
                this.tasksList[index].allow = false;
                this.tasksList[index + 1].allow = true;
              }
              if (this.tasksList.length <= 1) {
                this.tasksList[0].allow = false;
              }
            } else if (!task.done) {
              task.done = false;
            }
            if (this.userInfo.currentTask.id === task.id) {
              task.status = this.userInfo.currentTask.status;
            }
          });
          return task;
        });
      }
      console.log(this.tasksList);
    });
  }

  private getTasksStatuses(courseId: string) {
    this.profileService.getUserInfoByCoach(this.userInfo.id).subscribe((usersInfo: StudentInfoInterface[]) => {
      this.processingTasks = 0;
      this.pendingTasks = 0;
      this.doneTasks = 0;
      this.processingTasksData = [];
      usersInfo.map((info: StudentInfoInterface) => {
        if (info.course.id === courseId) {
          switch (info.currentTask.status) {
            case TaskStatuses.PROCESSING:
              this.processingTasksData.push(info);
              this.processingTasks += 1;
              break;
            case TaskStatuses.PENDING:
              this.pendingTasks += 1;
              break;
            case TaskStatuses.DONE:
              this.doneTasks += 1;
              break;
          }
        }
      });
    });
  }

  private getCourses() {
    this.taskService.getAllCourses().subscribe((allCourses: CourseInterface[]) => {
      if (this.userInfo.role.id === this.userRoles.ADMIN) {
        this.coursesList = allCourses;
      } else {
        this.coursesList = allCourses.filter((course: CourseInterface) => {
          return course.coachId === this.userInfo.id;
        });
      }
      if (this.userInfo.course && this.userInfo.course.id) {
        this.currentCourse = allCourses.filter((course: CourseInterface) => {
          return course.id === this.userInfo.course.id;
        })[0];
        this.paymentsService.getPaidCourses(this.userInfo.id).subscribe((paid: Checkout[]) => {
          if(paid.find((item: Checkout) => this.currentCourse.id === item.course.id || item.price === 0)) {
            this.currentCourse.paid = true;
          } else {
            this.currentCourse.paid = false;
          }
          this.currentCourse.paid = this.currentCourse.price <= 0;
        })
      } else {
        // default group for admin and coach
        const courseIdQuery = this.route.snapshot.queryParamMap.get('courseId');
        if(courseIdQuery) {
          this.currentCourse = this.coursesList.filter((course: CourseInterface) => course.id === courseIdQuery)[0];
        }
        if (this.currentCourse) {
          this.getTasksStatuses(this.currentCourse.id);
        }
      }
      if (this.currentCourse.id) {
        this.getAllTasks(this.currentCourse.id);
      }
      // this.getPendingTasks(this.currentGroup.id);
    });
  }

  public passTask(task: TaskModel) {
    const dialogRef = this.dialog.open(PassTaskComponent, {
      width: '650px',
      data: {task, userInfo: this.userInfo}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  public createCourse() {
    const dialogRef = this.dialog.open(CreateCourseComponent, {
      width: '650px'
    });
    dialogRef.afterClosed().subscribe(course => {
      if (course) {
        this.coursesList.push(course);
        course.id = course._id;
        delete course._id;
      }
      this.currentCourse = course;
      this.changeCourse(course.id);
    });
  }

  public viewProcessingTasks() {
    const dialogRef = this.dialog.open(ProcessTasksComponent, {
      width: '650px',
      data: this.processingTasksData
    });
  }

  public changeCourse(courseId) {
    this.getAllTasks(courseId);
    this.getTasksStatuses(courseId);
    this.changeCourseIdQuery(courseId);
    // this.getPendingTasks(groupId);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  public youTubeGetID(url: any): string {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }
  public deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(deletedTask => {
      this.snackBar.open('Задание успешно удалено', '', {
        duration: 2000,
        panelClass: ['success']
      });
      this.ngOnInit();
    });
  }

  private changeCourseIdQuery(courseId: string) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {courseId}});
  }
}
