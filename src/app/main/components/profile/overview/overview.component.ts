import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { UserInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public userInfo: UserInfoInterface;
  public userLogin: any;
  public userRoles = UserRolesEnum;

  constructor(
    private profileService: ProfileService,
    private appService: AppService
    ) {
      console.log(this);
     }

  ngOnInit() {
    this.getUserInfo();
  }
  public getUserInfo() {
    const userId = this.appService.getUserId();
    const userRole = this.appService.getUserRole();
    this.profileService.getUserInfo(userId, userRole).subscribe((userInfo: UserInfoInterface) => {
      userInfo.startTraining = moment(userInfo.startTraining).format('DD.MM.YYYY');
      this.userInfo = userInfo;
      // this.appService.setUserInfoData(userInfo);
    }, err => {
      console.log('userInfo err', err)
    });
  }

}
