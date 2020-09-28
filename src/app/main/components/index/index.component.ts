import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public userRoles = UserRolesEnum;
  public userInfo: any;
  public coachInfo: CoachInfoInterface;
  public studentsList: StudentInfoInterface[];
  public studentTableColumns = ['Позиция', 'Имя', 'Группа', 'Рейтинг', 'Прогресс'];

  constructor(
    private mainService: MainService,
    private appService: AppService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    if (this.userInfo.progress) {
      this.userInfo.progress = Math.round(this.userInfo.progress)
    };
    switch (this.userInfo.role.id) {
      case this.userRoles.STUDENT:
        if (this.userInfo.coach) {
          this.getCoachInfo(this.userInfo.coach.id);
          this.getStudentsInfo(this.userInfo.group.id);
        }
    }
    console.log(this);
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
      console.log(studentsList);
      this.studentsList = studentsList.filter((studentInfo: StudentInfoInterface) => {
        if (studentInfo.group) {
          return groupId === studentInfo.group.id;
        }
        return false;
      }).sort((a, b) => a.rating > b.rating ? -1 : 1);
      console.log(this.studentsList);
    });
  }
}
