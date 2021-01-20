import { Component, ComponentFactoryResolver, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import {
  AdminInfoInterface,
  CoachInfoInterface,
  ParentInfoInterface,
  StudentInfoInterface
} from 'src/app/shared/interface/user-info.interface';
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
export class DashboardComponent implements OnInit {
  public userRoles = UserRolesEnum;
  public userInfo: any;
  public coachInfo: CoachInfoInterface;
  public studentsList: StudentInfoInterface[];
  public studentTableColumns = ['Позиция', 'Имя', 'Группа', 'Рейтинг', 'Прогресс'];
  public studentTasks: TaskModel[];
  public doneTasks;
  public selectGroups;
  public currentGroup;
  public currentStudent;

  constructor(
    private mainService: MainService,
    private appService: AppService,
    private profileService: ProfileService,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    switch (this.userInfo.role.id) {
      case this.userRoles.STUDENT:
        if (this.userInfo.coach) {
          this.getCoachInfo(this.userInfo.coach.id);
          this.getStudentsInfo(this.userInfo.group.id);
          this.getTaskByGroup(this.userInfo.group.id);
          this.checkStatusTask();
          if (this.userInfo.progress) {
            this.userInfo.progress = Math.round(this.userInfo.progress);
          }
        }
        break;
      case this.userRoles.COACH:
        this.profileService.getAllGroups().subscribe((groups: any[]) => {
          this.selectGroups = groups.filter(group => group.coachId === this.userInfo.id);
          this.currentGroup = this.selectGroups[0];
          this.getStudentsInfo(this.selectGroups[0].id);
          this.getTaskByGroup(this.selectGroups[0].id);
        });
        break;
      case this.userRoles.PARENT:
        const kidRole = this.userRoles.STUDENT;
        if(this.userInfo.myKid) {
          this.profileService.getUserInfoWithParams(this.userInfo.myKid.id, kidRole).subscribe((studentInfo: StudentInfoInterface) => {
            this.currentStudent = studentInfo;
            this.getTaskByGroup(studentInfo.group.id);
            this.getStudentsInfo(studentInfo.group.id);
            this.getCoachInfo(studentInfo.coach.id);
          })
        }
      break;
      case this.userRoles.ADMIN:
        this.profileService.getAllGroups().subscribe((groups) => {
          this.selectGroups = groups;
          this.currentGroup = groups[0];
          this.getStudentsInfo(groups[0].id);
          this.getTaskByGroup(groups[0].id);
        });
        break;
    }
    console.log(this);
  }

  compareObjectsStudents(o1: any, o2: any): boolean {
    if (o1.id && o2.id) {
      return o1.id === o2.id;
    }
  }

  compareObjectsGroups(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  public changeGroup(group) {
    const groupId: string = group.id;
    this.currentStudent = null;
    this.getStudentsInfo(groupId);
    this.checkStatusTask();
  }

  public changeStudent(student) {
    this.currentStudent = student;
    this.checkStatusTask();
  }

  private getCoachInfo(id: string) {
    const coachRole = this.userRoles.COACH;
    this.profileService.getUserInfoWithParams(id, coachRole).subscribe((coachInfo: CoachInfoInterface) => {
      this.coachInfo = coachInfo;
    });
  }
  private getStudentsInfo(groupId: string) {
    this.profileService.getUsersInfoByGroupId(groupId).subscribe((studentsList: StudentInfoInterface[]) => {
      this.studentsList = studentsList.sort((a, b) => a.rating > b.rating ? -1 : 1);
      if ((this.userInfo.role.id === this.userRoles.COACH) &&
          !this.currentStudent || (this.userInfo.role.id === this.userRoles.ADMIN)) {
        this.currentStudent = this.studentsList[0];
      } else if(!(this.userInfo.role.id === this.userRoles.PARENT)) {
        this.currentStudent = this.studentsList.filter(student => student.id === this.userInfo.id)[0];
      }
      this.checkStatusTask();
    });
  }
  private getTaskByGroup(groupId: string) {
    this.taskService.getTasksByGroup(groupId).subscribe(tasks => {
      this.studentTasks = tasks;
      this.checkStatusTask();
    });
  }
  private checkStatusTask() {
      const student = this.currentStudent ? this.currentStudent : this.userInfo;
      if (student.group && this.studentTasks) {
        this.doneTasks = student.doneTasks.filter(taskId => {
          return this.studentTasks.find(task => task.id === taskId);
        });
        this.studentTasks = this.studentTasks.map((task: TaskModel) => {
          task.done = !!this.doneTasks.find(taskId => taskId === task.id);
          return task;
        });
      }
      if (!student.group && this.studentTasks) {
        this.studentTasks = this.studentTasks.map((task: TaskModel) => {
          task.done = false;
          return task;
        });
      }
  }
}
