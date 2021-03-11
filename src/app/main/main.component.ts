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
  public alwaysOpenedSidenav = true;

  constructor(
    private mainService: MainService,
    protected appService: AppService,
    protected profileService: ProfileService
  ) {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      this.alwaysOpenedSidenav = false;
    }else{
      // false for not mobile device
      this.alwaysOpenedSidenav = true;
    }
  }

  ngOnInit() {
    this.getUserInfo();
    this.appService.userInfoSubject.subscribe((userInfo: any) => {
      this.userInfo = userInfo;
      this.mainService.userInfo = userInfo;
    });
  }

  private getUserInfo() {
    this.profileService.getUserInfo().subscribe(
      (userInfoData: StudentInfoInterface | CoachInfoInterface | ParentInfoInterface | AdminInfoInterface) =>
      {
      if(userInfoData.startTraining) {
        userInfoData.startTraining = moment(userInfoData.startTraining).format('DD.MM.YYYY');
      };
      this.appService.userInfoSubject.next(userInfoData);
      // this.userInfo = userInfoData;
      // this.mainService.userInfo = userInfoData;
    });
  }
  public toggleCollapsed() {
    this.toggleSideNav = !this.toggleSideNav;
  }
}
