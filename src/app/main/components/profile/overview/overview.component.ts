import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { UserInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public userInfo: UserInfoInterface;
  public userLogin: any;

  constructor(
    private profileService: ProfileService,
    private appService: AppService
    ) { }

  ngOnInit() {
    this.getUserInfo();
    this.appService.userInfoData.subscribe((user: any) => {
      console.log('userInfoData', user);
      this.userInfo = user;
    });
    this.appService.userLoginData.subscribe((user: any) => {
      console.log('userLoginData', user);
      this.userLogin = user;
    });
    console.log(this);
  }
  public getUserInfo() {
    const userId = this.appService.getUserId();
    this.profileService.getUserInfo(userId).subscribe((userInfo: UserInfoInterface) => {
      if (!userInfo) {
        this.profileService.createUserInfo(userId).subscribe((createdUserInfo: UserInfoInterface) => {
          this.appService.setUserInfoData(createdUserInfo);
        });
      } else {
        userInfo.startTraining = moment(userInfo.startTraining).format('DD.MM.YYYY');
        this.userInfo = userInfo;
        this.appService.setUserInfoData(userInfo);
      }
    }, err => {
      console.log('userInfo err', err)
    });
  }

}
