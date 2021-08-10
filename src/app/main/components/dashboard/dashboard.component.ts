import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { CourseInterface } from 'src/app/shared/interface/course.interface';
import {
  AdminInfoInterface,
  CoachInfoInterface,
  ParentInfoInterface,
  StudentInfoInterface
} from 'src/app/shared/interface/user-info.interface';
import { TitleService } from 'src/app/shared/title.service';
import { MainService } from '../../main.service';
import { ProfileService } from '../profile/profile.service';
import { TaskModel } from '../tasks/task.model';
import { TaskService } from '../tasks/tasks.service';

@Component({
  selector: 'app-index',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  public userRoles = UserRolesEnum;
  public userInfo: any;
  public coachInfo: CoachInfoInterface;
  public studentsList: StudentInfoInterface[];
  public studentTableColumns = ['Позиция', 'Имя', 'Курс', 'Рейтинг', 'Прогресс'];
  public studentTasks: TaskModel[] = [];
  public doneTasks: [];
  public selectCourses;
  public currentCourse: CourseInterface;
  public currentStudent: StudentInfoInterface;
  public currentChild: {id: string, name: string, email: string};
  private subscription: Subscription = new Subscription();

  constructor(
    private mainService: MainService,
    private profileService: ProfileService,
    private taskService: TaskService,
    private titleService: TitleService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('COMMON.DASHBOARD').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    this.userInfo = this.mainService.userInfo;
    switch (this.userInfo.role.id) {
      case this.userRoles.STUDENT:
        if (this.userInfo.coach.id) {
          this.getCoachInfo(this.userInfo.coach.id);
          this.getStudentsInfo(this.userInfo.course.id);
          this.getTaskByCourse(this.userInfo.course.id);
          this.checkStatusTask();
        }
        break;
      case this.userRoles.COACH:
        const allCourses = this.taskService.getAllCourses().subscribe((courses: any[]) => {
          this.selectCourses = courses.filter(course => course.coachId === this.userInfo.id);
          if(this.selectCourses.length) {
            this.currentCourse = this.selectCourses[0];
            this.getStudentsInfo(this.selectCourses[0].id);
            this.getTaskByCourse(this.selectCourses[0].id);
          }
        });
        this.subscription.add(allCourses);
        break;
      case this.userRoles.PARENT:
        const KID_ROLE = this.userRoles.STUDENT;
        this.userInfo.myKid = Array.isArray(this.userInfo.myKid) ? this.userInfo.myKid : [this.userInfo.myKid];
        if (this.userInfo.myKid.length) {
          const userInfoWithParams = this.profileService.getUserInfoWithParams(this.userInfo.myKid[0].id, KID_ROLE).subscribe((studentInfo: StudentInfoInterface) => {
            this.currentStudent = studentInfo;
            this.getTaskByCourse(studentInfo.course.id);
            this.getStudentsInfo(studentInfo.course.id);
            this.getCoachInfo(studentInfo.coach.id);
          });
          this.subscription.add(userInfoWithParams);
        }
      break;
      case this.userRoles.ADMIN:
        const allCoursesAdmin = this.taskService.getAllCourses().subscribe((courses) => {
          this.selectCourses = courses;
          this.currentCourse = courses[0];
          this.getStudentsInfo(courses[0].id);
          this.getTaskByCourse(courses[0].id);
        });
        this.subscription.add(allCoursesAdmin);
        break;
    }
  }

  compareObjectsStudents(o1: any, o2: any): boolean {
    if (o1.id && o2.id) {
      return o1.id === o2.id;
    }
  }

  compareObjectsCourses(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }
  compareObjectsKids(o1: any, o2: any): boolean {
    if (o1 && o2) {
      return o1.id === o2.id;
    }
  }

  public changeCourse(course) {
    const courseId: string = course.id;
    this.currentStudent = null;
    this.getStudentsInfo(courseId);
    this.getTaskByCourse(courseId);
    this.checkStatusTask();
  }

  public changeStudent(student) {
    this.currentStudent = student;
    this.checkStatusTask();
  }

  public changeChild(child) {
    const KID_ROLE = this.userRoles.STUDENT;
    this.studentTasks = [];
    const userInfoWithParams = this.profileService.getUserInfoWithParams(child.id, KID_ROLE).subscribe((studentInfo: StudentInfoInterface) => {
      this.currentStudent = studentInfo;
      if(studentInfo.course.id && studentInfo.coach.id) {
        this.getTaskByCourse(studentInfo.course.id);
        this.getStudentsInfo(studentInfo.course.id);
        this.getCoachInfo(studentInfo.coach.id);
      } else {
        this.coachInfo = null;
      }
    });
    this.subscription.add(userInfoWithParams);
  }

  private getCoachInfo(id: string) {
    const coachRole = this.userRoles.COACH;
    const getUserInfoWithParams = this.profileService.getUserInfoWithParams(id, coachRole).subscribe((coachInfo: CoachInfoInterface) => {
      this.coachInfo = coachInfo;
    });
    this.subscription.add(getUserInfoWithParams);
  }
  private getStudentsInfo(courseId: string) {
    const getUsersInfoByCourseId = this.profileService.getUsersInfoByCourseId(courseId).subscribe((studentsList: StudentInfoInterface[]) => {
      this.studentsList = studentsList.sort((a, b) => a.rating > b.rating ? -1 : 1);
      if ((this.userInfo.role.id === this.userRoles.COACH) &&
          !this.currentStudent || (this.userInfo.role.id === this.userRoles.ADMIN)) {
        this.currentStudent = this.studentsList[0];
      } else if(!(this.userInfo.role.id === this.userRoles.PARENT)) {
        this.currentStudent = this.studentsList.filter(student => student.id === this.userInfo.id)[0];
      }
      this.checkStatusTask();
    });
    this.subscription.add(getUsersInfoByCourseId);
  }
  private getTaskByCourse(courseId: string) {
    const getTasksByCourse = this.taskService.getTasksByCourse(courseId).subscribe(tasks => {
      this.studentTasks = tasks;
      this.checkStatusTask();
    });
    this.subscription.add(getTasksByCourse);
  }
  private checkStatusTask() {
      const student = this.currentStudent ? this.currentStudent : this.userInfo;
      if (student.course && this.studentTasks) {
        this.doneTasks = student.doneTasks.filter(taskId => {
          return this.studentTasks.find(task => task.id === taskId);
        });
        this.studentTasks = this.studentTasks.map((task: TaskModel) => {
          task.done = !!this.doneTasks.find(taskId => taskId === task.id);
          return task;
        });
        student.progress = ((this.studentTasks.filter((task: TaskModel) => task.done).length) * 100) / this.studentTasks.length;
      }
      if (!student.course && this.studentTasks) {
        this.studentTasks = this.studentTasks.map((task: TaskModel) => {
          task.done = false;
          return task;
        });
      }
  }
  public calculateProgress(student?: StudentInfoInterface): number {
    let doneLength;
    if (this.studentTasks.length) {
      doneLength = this.studentTasks.filter((task: TaskModel) => student.doneTasks.find(id => task.id === id)).length;
      return Math.round((doneLength * 100) / this.studentTasks.length);
    }
    return 0;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
