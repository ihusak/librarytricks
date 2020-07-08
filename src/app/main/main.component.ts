import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MainService } from './main.service';
import { AppService } from '../app.service';
import { ProfileService } from './components/profile/profile.service';

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
    protected pofileService: ProfileService
  ) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.pofileService.getUserInfo(userId).subscribe((userInfoData: any) => {
      if (userInfoData && userInfoData.userImg) {
        this.userLogin = userInfoData;
      } else {
        this.mainService.getUser(userId).subscribe((data) => {
          this.userLogin = data;
          this.appService.setUserLoginData(data);
        });
      }
    });
  }
  public toggleCollapsed() {
    this.toggleSideNav = !this.toggleSideNav;
  }
}
