import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { MainService } from '../main.service';

@Injectable({
    providedIn: 'root'
})
export class MainGuardService implements CanActivate {
    status: boolean;
    constructor(private mainService: MainService, private router: Router, private ngZone: NgZone) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>  {
        this.mainService.getUserInfo().subscribe((data) => {
            console.log('userDetails data', data);
          });
        return false;
    }
    private navigate(command: any[]) {
        this.ngZone.run(() => this.router.navigate(command)).then();
    }
}