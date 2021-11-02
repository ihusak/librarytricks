import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../tasks.service';
import { TaskModel } from '../task.model';
import { MainService } from 'src/app/main/main.service';
import { AdminInfoInterface, CoachInfoInterface, ParentInfoInterface, StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
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
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {NotifyInterface} from '../../../../shared/interface/notify.interface';
import { NotificationTypes } from 'src/app/shared/enums/notification-types.enum';
import { UserCoachModel } from 'src/app/shared/models/user-coach.model';
import { AppService } from 'src/app/app.service';
import { UpdateCourseComponent } from '../popups/update-course/update-course.component';
import { TitleService } from 'src/app/shared/title.service';
import {TaskStatusInterface} from '../../../../shared/interface/task-status.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskListComponent implements OnInit, OnDestroy {
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
  private notifyTypes = NotificationTypes;
  public coachList: UserCoachModel[] = [];
  public selectedCoach: UserCoachModel;
  public selectedCourse: CourseInterface;
  public coachCourses: any[] = [];
  public coachCourseList: any[] = [];
  public coach: any = null;
  private payments: Checkout[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private appService: AppService,
    private taskService: TaskService,
    private mainService: MainService,
    private profileService: ProfileService,
    private paymentsService: PaymentsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private titleService: TitleService
    ) {
      this.userInfo = this.mainService.userInfo;
    }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('COMMON.COURSE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    const USER = this.userInfo;
    this.init(USER);
    if(USER.role.id === this.userRoles.STUDENT) {
      const getPaidCourses = this.paymentsService.getPaidCourses(USER.id).subscribe((paid: Checkout[]) => {
        this.payments = paid;
      });
      this.subscription.add(getPaidCourses);
    }
  }

  public assignTask(task: TaskModel) {
    task.status = TaskStatuses.PROCESSING;
    const TASK_STATUS: TaskStatusInterface = {
      status: TaskStatuses.PROCESSING,
      taskId: task.id,
      coachId: this.userInfo.coach.id,
      userId: this.userInfo.id,
      reject: null
    };
    // deprecated
    const changeCurrentTask = this.taskService.changeTaskStatus(this.userInfo.id, TASK_STATUS).subscribe((updatedUserInfo: StudentInfoInterface) => {
      // this.userInfo = updatedUserInfo;
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.START_PROCESSING_TASK'), '', {
        duration: 2000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      const notification: NotifyInterface = {
        users: [{id: this.userInfo.coach.id}],
        author: {
          id: this.userInfo.id,
          name: this.userInfo.userName
        },
        title: 'COMMON.UPDATES',
        type: this.notifyTypes.TASK_IN_PROGRESS,
        userType: [this.userRoles.COACH, this.userRoles.ADMIN],
        task: {
          id: task.id,
          name: task.title
        },
        course: {
          id: this.currentCourse.id,
          name: this.currentCourse.name
        }
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
    });
    this.subscription.add(changeCurrentTask);
  }

  private getAllTasks(courseId?: string) {
    const getTasksByCourse = this.taskService.getTasksByCourse(courseId).subscribe((tasks: TaskModel[]) => {
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
          });
          if (this.userInfo.currentTask.id === task.id) {
            task.status = this.userInfo.currentTask.status;
          }
          return task;
        });
      }
    });
    this.subscription.add(getTasksByCourse);
  }

  private getTasksStatuses(courseId: string) {
    const getUserInfoByCoach = this.profileService.getUserInfoByCoach(this.userInfo.id).subscribe((usersInfo: StudentInfoInterface[]) => {
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
    this.subscription.add(getUserInfoByCoach);
  }
  private init(user) {
    const coachId = this.route.snapshot.queryParamMap.get('coachId');
    const courseId = this.route.snapshot.queryParamMap.get('courseId');
    switch (user.role.id) {
      case this.userRoles.STUDENT:
        const STUDENT: StudentInfoInterface = this.userInfo;
        const getAllCoaches = this.profileService.getAllCoaches(this.userRoles.COACH).subscribe((coaches: UserCoachModel[]) => {
          this.coachList = coaches;

          if(STUDENT.coach.id) {
            const getCoursesByCoachId = this.taskService.getCoachCourses(STUDENT.coach.id).subscribe((courses: CourseInterface[]) => {
              this.coursesList = courses;
              this.selectedCoach = this.coachList.find((coach: UserCoachModel) => coach.id === STUDENT.coach.id);
              this.selectedCourse = courses.find((course: CourseInterface) => course.id === STUDENT.course.id);
              this.currentCourse = this.selectedCourse;
              this.changeCourse(this.currentCourse.id, this.selectedCoach.id);
            if (courseId && coachId) {
              const getCoursesByCoachId = this.taskService.getCoachCourses(coachId).subscribe((courses: CourseInterface[]) => {
                this.coursesList = courses;
                this.selectedCourse = courses.find((course: CourseInterface) => course.id === courseId);
                this.selectedCoach = this.coachList.find((coach: UserCoachModel) => coach.id === coachId);
                this.currentCourse = this.selectedCourse;
                this.changeCourse(this.currentCourse.id, this.selectedCoach.id);
              });
              this.subscription.add(getCoursesByCoachId);
            }
            });
            this.subscription.add(getCoursesByCoachId);
          } else {
            this.currentCourse = null;
            if (courseId && coachId) {
              const getCoursesByCoachId = this.taskService.getCoachCourses(coachId).subscribe((courses: CourseInterface[]) => {
                this.coursesList = courses;
                this.selectedCourse = courses.find((course: CourseInterface) => course.id === courseId);
                this.selectedCoach = this.coachList.find((coach: UserCoachModel) => coach.id === coachId);
                this.currentCourse = this.selectedCourse;
                this.changeCourse(this.currentCourse.id, this.selectedCoach.id);
              });
              this.subscription.add(getCoursesByCoachId);
            }
          }
        });
        this.subscription.add(getAllCoaches);
      break;
      case this.userRoles.COACH:
        const COACH: CoachInfoInterface = this.userInfo;
        const getCoursesByCoachId = this.taskService.getCoachCourses(COACH.id).subscribe((courses: CourseInterface[]) => {
          this.coursesList = courses;
          if (courseId) {
            this.selectedCourse = courses.find((course: CourseInterface) => course.id === courseId);
            this.currentCourse = this.selectedCourse;
            this.changeCourse(this.selectedCourse.id, COACH.id);
          } else {
            this.currentCourse = courses[0];
            this.changeCourse(courses[0].id, COACH.id);
          }
        });
        this.subscription.add(getCoursesByCoachId);
      break;
      case this.userRoles.PARENT:
        const PARENT: ParentInfoInterface = this.userInfo;
        const getAllCoachesForParent = this.profileService.getAllCoaches(this.userRoles.COACH).subscribe((coaches: UserCoachModel[]) => {
          this.coachList = coaches;
          if (courseId && coachId) {
            const getCoursesByCoachId = this.taskService.getCoachCourses(coachId).subscribe((courses: CourseInterface[]) => {
              this.coursesList = courses;
              this.selectedCourse = courses.find((course: CourseInterface) => course.id === courseId);
              this.selectedCoach = this.coachList.find((coach: UserCoachModel) => coach.id === coachId);
              this.currentCourse = this.selectedCourse;
              this.changeCourse(this.currentCourse.id, this.selectedCoach.id);
            });
            this.subscription.add(getCoursesByCoachId);
          }
        })
        this.subscription.add(getAllCoachesForParent);
      break;
      case this.userRoles.ADMIN:
        const ADMIN: AdminInfoInterface = this.userInfo;
        const getAllCoachesForAdmin = this.profileService.getAllCoaches(this.userRoles.COACH).subscribe((coaches: UserCoachModel[]) => {
          this.coachList = coaches;
          if (courseId && coachId) {
            const getCoursesByCoachId = this.taskService.getCoachCourses(coachId).subscribe((courses: CourseInterface[]) => {
              this.coursesList = courses;
              this.selectedCourse = courses.find((course: CourseInterface) => course.id === courseId);
              this.selectedCoach = this.coachList.find((coach: UserCoachModel) => coach.id === coachId);
              this.currentCourse = this.selectedCourse;
              this.changeCourse(this.currentCourse.id, this.selectedCoach.id);
            });
            this.subscription.add(getCoursesByCoachId);
          }
        })
        this.subscription.add(getAllCoachesForAdmin);
      break;
    }
  }
  private checkPayment() {
    const payment = this.payments.find((item: Checkout) => this.currentCourse.id === item.course.id || item.price === 0)
    if (payment) {
      this.currentCourse.paid = true;
    } else {
      this.currentCourse.paid = false;
    }
    if(this.currentCourse.price <= 0) {
      this.currentCourse.paid = true;
    }
  }

  public passTask(task: TaskModel) {
    const dialogRef = this.dialog.open(PassTaskComponent, {
      width: '650px',
      data: {task, userInfo: this.userInfo}
    });
    dialogRef.afterClosed().subscribe((param) => {
      if(param) {
        const notification: NotifyInterface = {
          users: [{id: this.userInfo.coach.id}],
          author: {
            id: this.userInfo.id,
            name: this.userInfo.userName
          },
          title: 'COMMON.UPDATES',
          type: this.notifyTypes.PASS_TASK,
          userType: [this.userRoles.COACH, this.userRoles.ADMIN],
          task: {
            id: task.id,
            name: task.title
          },
          course: {
            id: this.currentCourse.id,
            name: this.currentCourse.name
          }
        };
        this.mainService.setNotification(notification).subscribe((res: any) => {
        window.location.reload();
        });
      }
    });
  }

  public createCourse() {
    const dialogRef = this.dialog.open(CreateCourseComponent, {
      width: '650px'
    });
    dialogRef.afterClosed().subscribe(course => {
      if (course) {
        const notification: NotifyInterface = {
          users: null,
          author: {
            id: this.userInfo.id,
            name: this.userInfo.userName
          },
          title: 'COMMON.COURSE',
          type: this.notifyTypes.NEW_COURSE,
          userType: [this.userRoles.STUDENT, this.userRoles.PARENT]
        };
        this.mainService.setNotification(notification).subscribe((res: any) => {});
        this.coursesList.push(course);
        course.id = course._id;
        delete course._id;
        this.currentCourse = course;
        this.changeCourse(course.id, this.userInfo.id);
      }
    });
  }

  public updateCourse() {
    const dialogRef = this.dialog.open(UpdateCourseComponent, {
      width: '650px',
      data: this.selectedCourse
    });
    dialogRef.afterClosed().subscribe(updatedCourse => {
      if (updatedCourse) {
        // const notification: NotifyInterface = {
        //   users: null,
        //   author: {
        //     id: this.userInfo.id,
        //     name: this.userInfo.userName
        //   },
        //   title: 'COMMON.COURSE',
        //   type: this.notifyTypes.NEW_COURSE,
        //   userType: [this.userRoles.STUDENT, this.userRoles.PARENT]
        // };
        // this.mainService.setNotification(notification).subscribe((res: any) => {
        //   console.log(res);
        // });
        this.coursesList = this.coursesList.map((course: CourseInterface) => {
          if (updatedCourse.id === course.id) {
            course = updatedCourse;
          }
          return course;
        });
        window.location.reload();
      }
    });
  }



  public viewProcessingTasks() {
    const dialogRef = this.dialog.open(ProcessTasksComponent, {
      width: '650px',
      data: this.processingTasksData
    });
  }

  public changeCourse(courseId: string, coachId: string) {
    this.getAllTasks(courseId);
    this.getTasksStatuses(courseId);
    this.changeCourseIdQuery(courseId, coachId);
    this.selectedCourse = this.coursesList.find((course: CourseInterface) => course.id === courseId);
    this.currentCourse = this.selectedCourse;
    if (this.userInfo.role.id === this.userRoles.STUDENT) {
      this.checkPayment();
    }
  }

  compareObjects(o1: any, o2: any): boolean {
    return o2 && o1.name === o2.name && o1.id === o2.id;
  }

  compareObjectsCourse(o1: any, o2: any): boolean {
    return o2 && o1.name === o2.name && o1.id === o2.id;
  }

  compareObjectsCoach(o1: any, o2: any): boolean {
    return o2 && o1.id === o2.id;
  }

  public changeCoach(coachId: string) {
    this.selectedCoach = this.coachList.find((coach: UserCoachModel) => coach.id === coachId);
    const getCoursesByCoachId = this.taskService.getCoachCourses(this.selectedCoach.id).subscribe((courses: CourseInterface[]) => {
      this.coursesList = courses;
    });
    this.currentCourse = null;
    this.selectedCourse = null;
    this.subscription.add(getCoursesByCoachId);
  }

  public youTubeGetID(url: any): string {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }
  public deleteTask(task: TaskModel) {
    this.taskService.deleteTask(task.id).subscribe(deletedTask => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.DELETE_SUCCESSFULLY'), '', {
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
        type: this.notifyTypes.DELETE_COURSE_TASK,
        userType: [this.userRoles.ADMIN],
        task: {
          id: task.id,
          name: task.title
        },
        course: {
          id: this.currentCourse.id,
          name: this.currentCourse.name
        }
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
      this.ngOnInit();
    });
  }

  public assignCourseToUser() {
    const DATA_TO_UPDATE = {
      course: {
        id: this.selectedCourse.id,
        name: this.selectedCourse.name
      },
      coach: {
        id: this.selectedCoach.id,
        name: this.selectedCoach.userName
      }
    };
    const formData = new FormData();
    formData.append('userInfo', JSON.stringify(DATA_TO_UPDATE));
    this.profileService.updateUserInfo(formData).subscribe((updatedUserInfo: any) => {
      this.appService.userInfoSubject.next(updatedUserInfo);
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.USERINFO_UPDATED'), '', {
        duration: 2000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      window.location.reload();
    })
  }

  private changeCourseIdQuery(courseId: string, coachId: string) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {courseId, coachId}});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
