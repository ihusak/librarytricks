import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from './app.service';
import { TranslateLocalService } from './shared/translate/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private cookieService: CookieService, 
    private translateService: TranslateLocalService,
    private appService: AppService
    ) {
    if (!cookieService.get('lb_lang')) {
      appService.setLangToStorage('ua');
      translateService.setLang('ua');
    } else {
      const cookieLang = cookieService.get('lb_lang');
      translateService.setLang(cookieLang);
    }
}

}
