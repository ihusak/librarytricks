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

@Injectable(({providedIn: 'root'}))
export class MetaService {
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }
  public routeMetaTags(router: Router, activatedRoute: ActivatedRoute) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt: ActivatedRoute = activatedRoute;
      rt.data.subscribe(data => {
        console.log('meta data', data);
      })
    });
  }
}
