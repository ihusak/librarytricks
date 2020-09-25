import { Component, OnInit } from '@angular/core';
import { MainService } from '../../main.service';
import { AppService } from 'src/app/app.service';
import { StudentInfoInterface, CoachInfoInterface, ParentInfoInterface, AdminInfoInterface } from 'src/app/shared/interface/user-info.interface';
import moment from 'moment';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {
  public userInfo: any;
  public userRoles = UserRolesEnum;

  constructor(
    private mainService: MainService,
    private appService: AppService
    ) { }

  ngOnInit() {
    console.log('rating', this.mainService.userInfo);
    this.userInfo = this.mainService.userInfo;
    this.userInfo.progress = Math.round(this.userInfo.progress);
  }

  private getUsersInfo() {
    const userId = this.appService.getUserId();
    const userRole = this.appService.getUserRole();
    this.mainService.getUserInfo(userId, userRole).subscribe(
      (userInfoData: StudentInfoInterface | CoachInfoInterface | ParentInfoInterface | AdminInfoInterface) => 
      {
      if(userInfoData.startTraining) {
        userInfoData.startTraining = moment(userInfoData.startTraining).format('DD.MM.YYYY');
      }
      this.userInfo = userInfoData;
      // this.appService.setUserInfoData(userInfoData);
      this.mainService.userInfo = userInfoData;
      console.log('main component reflect', this.mainService.userInfo);
    });
  }

}
