import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav, MatSidenavContent } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';

const WIDTH_BREAKPOINT = '960px';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {
  toggleSideNav: boolean = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
  }

  ngOnInit() {}
  public toggleCollapsed() {
    this.toggleSideNav = !this.toggleSideNav;
  }
  ngOnDestroy() {}
}
