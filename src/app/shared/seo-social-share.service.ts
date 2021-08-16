import {
  ActivatedRoute, ActivationStart, ChildActivationStart,
  GuardsCheckStart,
  NavigationEnd,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  Router,
  RoutesRecognized
} from '@angular/router';
import {Injectable} from '@angular/core';
import {filter} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Meta} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable(({providedIn: 'root'}))
export class SeoSocialShareService {
  private subscriptions = new Subscription();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: Meta,
    private translateService: TranslateService
  ) {
  }
  public setupRouting() {
    const routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
      .subscribe(() => {
        const rt = this.getChild(this.activatedRoute);

        const dataSub = rt.data.subscribe(data => {
          this.metaService.addTags([
            { name: 'twitter:image', content: `${environment.siteName}/assets/img/bg.jpg` },
            { name: 'twitter:image:alt', content: 'Football freestyle academy' },
            { property: 'og:image', content: `${environment.siteName}/assets/img/bg.jpg` },
            { property: 'og:image:alt', content: 'Football freestyle academy' },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:site_name', content: 'Librarytricks academy' }
          ]);
          // this.metaService.updateTag({ name: 'twitter:image', content: `${environment.siteName}/assets/img/bg.jpg` });
          // this.metaService.updateTag({ name: 'twitter:image:alt', content: 'Football freestyle academy' });
          // this.metaService.updateTag({ property: 'og:image', content: `${environment.siteName}/assets/img/bg.jpg` });
          // this.metaService.updateTag({ property: 'og:image:alt', content: 'Football freestyle academy' });
          // this.metaService.updateTag({ property: 'og:image:width', content: '1200' });
          // this.metaService.updateTag({ property: 'og:image:height', content: '630' });
          // this.metaService.updateTag({ property: 'og:site_name', content: 'Librarytricks academy' });
          if (data.title) {
            this.translateService.get(data.title).subscribe(value => {
              this.metaService.updateTag({ property: 'og:title', content: value + ' - Librarytricks'});
              this.metaService.updateTag({ name: 'twitter:title', content: value + ' - Librarytricks'});
            });
          } else {
            this.metaService.removeTag('property="og:title"');
            this.metaService.removeTag('name="twitter:title"');
          }
          if (data.description) {
            this.translateService.get(data.description).subscribe(value => {
              this.metaService.updateTag({ property: 'og:description', content: value});
              this.metaService.updateTag({ name: 'twitter:description', content: value});
              this.metaService.updateTag({ name: 'description', content: value});
            });
          } else {
            this.metaService.removeTag('property="og:description"');
            this.metaService.removeTag('name="twitter:description"');
            this.metaService.removeTag('name="description"');
          }
          if (data.ogUrl) {
            this.metaService.updateTag({ property: 'og:url', content: data.ogUrl });
          } else {
            this.metaService.updateTag({ property: 'og:url', content: `${environment.siteName}${this.router.url}` });
          }
        });
        this.subscriptions.add(dataSub);
      });
    this.subscriptions.add(routerSub);
  }
  private getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }
}
