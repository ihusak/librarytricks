import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { TitleService } from '../shared/title.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  constructor(
    private route: Router, 
    private appService: AppService, 
    private titleService: TitleService,
    private translateService: TranslateService,
    ) { }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('COMMON.MAIN').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    const checkLoggedIn = this.appService.getTokens();
    if (checkLoggedIn.accessToken) {
      this.route.navigate(['main']);
    }
  }
}
