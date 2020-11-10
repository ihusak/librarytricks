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
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit {
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
    if (this.userInfo.progress) {
      this.userInfo.progress = Math.round(this.userInfo.progress);
    }
    switch (this.userInfo.role.id) {
      case this.userRoles.STUDENT:
        if (this.userInfo.coach) {
          this.getCoachInfo(this.userInfo.coach.id);
          this.getStudentsInfo(this.userInfo.group.id);
        }
        break;
      case this.userRoles.COACH:
        this.profileService.getAllGroups().subscribe((groups) => {
          this.selectGroups = groups;
          this.currentGroup = groups[0];
          this.getStudentsInfo(groups[0].id);
          this.getStudentTasks();
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
    const groupId: number = group.id;
    this.currentStudent = null;
    this.getStudentsInfo(groupId);
  }

  public changeStudent(student) {
    this.currentStudent = student;
    this.getStudentsInfo(student.group.id);
    this.getStudentTasks();
  }

  private getCoachInfo(id: string) {
    const coachRole = this.userRoles.COACH;
    this.profileService.getUserInfo(id, coachRole).subscribe((coachInfo: CoachInfoInterface) => {
      this.coachInfo = coachInfo;
    });
  }

  private getStudentsInfo(groupId: number) {
    const studentRole = this.userRoles.STUDENT;
    this.profileService.getAllStudents(studentRole).subscribe((studentsList: StudentInfoInterface[]) => {
      this.studentsList = studentsList.filter((studentInfo: StudentInfoInterface) => {
        if (studentInfo.group) {
          return groupId === studentInfo.group.id;
        }
        return false;
      }).sort((a, b) => a.rating > b.rating ? -1 : 1);
      if ((this.userInfo.role.id === this.userRoles.COACH) && !this.currentStudent) {
        this.currentStudent = this.studentsList[0];
      } else {
        this.currentStudent = this.studentsList.filter(student => student.id === this.userInfo.id)[0];
      }
      this.getStudentTasks();
    });
  }
  private getStudentTasks() {
    this.taskService.getAllTasks().subscribe((tasks: TaskModel[]) => {
      const student = this.currentStudent ? this.currentStudent : this.userInfo;
      if (student.group) {
        this.studentTasks = tasks.filter(task => {
          return task.group.id === (this.currentStudent ? this.currentStudent.group.id : student.group.id);
        });
        this.doneTasks = student.doneTasks.filter(taskId => {
          return this.studentTasks.find(task => task.id === taskId);
        });
        this.studentTasks = this.studentTasks.map((task: TaskModel) => {
          task.done = !!this.doneTasks.find(taskId => taskId === task.id);
          return task;
        });
      }
    });
  }
}
