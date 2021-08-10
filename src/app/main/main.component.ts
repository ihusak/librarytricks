import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MainService } from './main.service';
import { AppService } from '../app.service';
import { ProfileService } from './components/profile/profile.service';
import { StudentInfoInterface, CoachInfoInterface, ParentInfoInterface, AdminInfoInterface } from '../shared/interface/user-info.interface';
import * as moment from 'moment';
import { User } from '../shared/interface/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {
  toggleSideNav: boolean;
  userInfo: StudentInfoInterface | CoachInfoInterface | ParentInfoInterface | AdminInfoInterface;
  user: User;
  sidenavCollapsed;
  public alwaysOpenedSidenav = true;
  private subscription: Subscription = new Subscription();

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
    const userSubject = this.appService.userInfoSubject.subscribe((userInfo: any) => {
      this.userInfo = userInfo;
      this.mainService.userInfo = userInfo;
    });
    this.subscription.add(userSubject);
  }

  private getUserInfo() {
    const userInfo = this.profileService.getUserInfo().subscribe(
      (userInfoData: StudentInfoInterface | CoachInfoInterface | ParentInfoInterface | AdminInfoInterface) =>
      {
      // if(userInfoData.startTraining) {
      //   userInfoData.startTraining = moment(userInfoData.startTraining).format('DD.MM.YYYY');
      // };
      this.appService.userInfoSubject.next(userInfoData);
      // this.userInfo = userInfoData;
      // this.mainService.userInfo = userInfoData;
    });
    this.subscription.add(userInfo);
  }
  public toggleCollapsed() {
    this.toggleSideNav = !this.toggleSideNav;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
