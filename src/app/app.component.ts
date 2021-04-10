import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TranslateLocalService } from './shared/translate/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private cookieService: CookieService, private translateService: TranslateLocalService) {
    if (!cookieService.get('lang')) {
      cookieService.set('lang', 'ua');
      translateService.setLang('ua');
    } else {
      const cookieLang = cookieService.get('lang');
      translateService.setLang(cookieLang);
    }
}

}
