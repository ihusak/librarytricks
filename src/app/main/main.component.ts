import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MainService } from './main.service';
import { AppService } from '../app.service';
import { ProfileService } from './components/profile/profile.service';
import { User } from '../shared/interface/user.interface';
import { UserInfoInterface } from '../shared/interface/user-info.interface';

const WIDTH_BREAKPOINT = '960px';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  toggleSideNav: boolean;
  userLogin: any;

  constructor(
    private mainService: MainService,
    protected appService: AppService,
    protected profileService: ProfileService
  ) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.profileService.getUserInfo(userId).subscribe((userInfoData: UserInfoInterface) => {
      if (userInfoData) {
        this.userLogin = userInfoData;
      } else {
        this.mainService.getUser(userId).subscribe((data: User) => {
          this.userLogin = data;
        });
      }
    });
  }
  public toggleCollapsed() {
    this.toggleSideNav = !this.toggleSideNav;
  }
}
