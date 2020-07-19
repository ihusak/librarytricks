import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MainService } from './main.service';
import { AppService } from '../app.service';
import { ProfileService } from './components/profile/profile.service';
import { UserInfoInterface } from '../shared/interface/user-info.interface';
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
  userInfo: UserInfoInterface;
  user: User;

  constructor(
    private mainService: MainService,
    protected appService: AppService,
    protected profileService: ProfileService
  ) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.profileService.getUserInfo(userId).subscribe((userInfoData: UserInfoInterface) => {
      userInfoData.startTraining = moment(userInfoData.startTraining).format('DD.MM.YYYY');
      this.userInfo = userInfoData;
      this.appService.setUserInfoData(userInfoData);
    });
    this.mainService.getUser(userId).subscribe((user: User) => {
      this.user = user;
      this.appService.setUserLoginData(user);
    });
    this.appService.userInfoData.subscribe((userInfoData: UserInfoInterface) => {
      this.userInfo = userInfoData;
    })
    console.log('main component reflect');
  }
  public toggleCollapsed() {
    this.toggleSideNav = !this.toggleSideNav;
    console.log(this.userInfo);
  }
}
