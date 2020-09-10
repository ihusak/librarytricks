import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MainService } from './main.service';
import { AppService } from '../app.service';
import { ProfileService } from './components/profile/profile.service';
import { StudentInfoInterface, CoachInfoInterface, ParentInfoInterface, AdminInfoInterface } from '../shared/interface/user-info.interface';
import * as moment from 'moment';
import { User } from '../shared/interface/user.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  toggleSideNav: boolean;
  userInfo: StudentInfoInterface | CoachInfoInterface | ParentInfoInterface | AdminInfoInterface;
  user: User;
  sidenavCollapsed;

  constructor(
    private mainService: MainService,
    protected appService: AppService,
    protected profileService: ProfileService
  ) {
  }

  ngOnInit() {
    this.getUserInfo();
  }

  private getUserInfo() {
    const userId = this.appService.getUserId();
    const userRole = this.appService.getUserRole();
    console.log(userRole);
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
  public toggleCollapsed() {
    this.toggleSideNav = !this.toggleSideNav;
    console.log(this.userInfo);
  }
}
