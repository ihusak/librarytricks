import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from 'src/app/app.service';
import { TranslateLocalService } from 'src/app/shared/translate/translate.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LanguageComponent implements OnInit {
  public selectedLang: string = '';
  @ViewChild(MatMenuTrigger, {static: false}) trigger: MatMenuTrigger;
  constructor(
    private cookieService: CookieService, 
    private translateService: TranslateLocalService,
    private appService: AppService
  ) {
    const cookieLang = cookieService.get('lb_lang');
    if(cookieLang) {
      this.selectedLang = cookieLang;
    } else {
      this.selectedLang = 'en';
    }
  }

  ngOnInit() {
  }
  public setLang(lang: string) {
    this.selectedLang = lang;
    this.appService.setLangToStorage(lang);
    this.translateService.setLang(lang);
  }

}
