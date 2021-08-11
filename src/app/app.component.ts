import {Component, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from './app.service';
import { TranslateLocalService } from './shared/translate/translate.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Meta} from '@angular/platform-browser';
import {filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';

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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: Meta
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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
      .subscribe(() => {
        const rt = this.getChild(this.activatedRoute);

        rt.data.subscribe(data => {
          console.log(data);
          this.metaService.updateTag({ property: 'og:image', content: `${environment.siteName}/assets/img/bg.jpg` });
          this.metaService.updateTag({ name: 'og:site_name', content: 'Librarytricks' });
          if (data.title) {
            this.translateService.get(data.title).subscribe(value => {
              this.metaService.updateTag({ property: 'og:title', content: value});
            });
          } else {
            this.metaService.removeTag('property="og:title"');
          }
          if (data.description) {
            this.translateService.get(data.description).subscribe(value => {
              this.metaService.updateTag({ name: 'og:description', content: value});
            });
          } else {
            this.metaService.removeTag('name="og:description"');
          }
          if (data.ogUrl) {
            this.metaService.updateTag({ property: 'og:url', content: data.ogUrl });
          } else {
            this.metaService.updateTag({ property: 'og:url', content: `${environment.siteName}${this.router.url}` });
          }
        });
      });
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }
}
