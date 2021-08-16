import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TitleService } from 'src/app/shared/title.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  constructor(
    private translateService: TranslateService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('COMMON.ABOUT_US').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
  }

}
