import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, ViewEncapsulation, OnChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav, MatSidenavContent } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { MainService } from './main.service';

const WIDTH_BREAKPOINT = '960px';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy, OnChanges {
  toggleSideNav: boolean = false;
  userInfo: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private media: MediaMatcher,
    private mainService: MainService
  ) {
  }

  ngOnInit() {
    this.mainService.getUserInfo().subscribe((data) => {
      console.log('userDetails data', data);
      if(!data) {
        this.router.navigate(['main/profile/settings']);
        this.userInfo = data;
      } else {
        this.router.navigate(['main/index']);
        this.userInfo = data;
      }
    });
  }
  public toggleCollapsed() {
    this.toggleSideNav = !this.toggleSideNav;
  }
  ngOnChanges() {
      // this.userInfo = this.mainService.getUserInfo();
      // console.log(this.userInfo);
  }
  ngOnDestroy() {
    // this.mainService.getUserInfo().unsubscribe();
  }
}
