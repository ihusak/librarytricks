import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    status: boolean;
    constructor(private router: Router, private ngZone: NgZone) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>  {
        // this.firebaseAuth.auth.onAuthStateChanged((user) => {
        //     console.log(user, route);
        //     if (user) {
        //         console.log('can access');
        //         this.status = true;
        //         this.navigate(['main']);
        //     } else {
        //         console.log('cant access');
        //         this.navigate(['start-page']);
        //         // this.router.parseUrl('/');
        //         this.status = false;
        //     }
        // });
        return this.status;
    }
    private navigate(command: any[]) {
        this.ngZone.run(() => this.router.navigate(command)).then();
    }
}