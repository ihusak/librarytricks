import {Component, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from './app.service';
import { TranslateLocalService } from './shared/translate/translate.service';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SeoSocialShareService} from './shared/seo-social-share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private translateLocalService: TranslateLocalService,
    private translateService: TranslateService,
    private appService: AppService,
    private seoSocialSharingService: SeoSocialShareService
    ) {
    if (!cookieService.get('lb_lang')) {
      appService.setLangToStorage('ua');
      translateLocalService.setLang('ua');
    } else {
      const cookieLang = cookieService.get('lb_lang');
      translateLocalService.setLang(cookieLang);
    }
  }
  ngOnInit() {
    this.seoSocialSharingService.setupRouting();
  }
}
