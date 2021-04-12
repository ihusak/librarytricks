import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/shared/interface/user.interface';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  pass = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private loginService: LoginService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService
    ) { }

  ngOnInit() {
  }
  loginUser(email: string, pass: string) {
    const login = this.loginService.loginUser(email, pass).subscribe((user: User) => {
     this.appService.setUserDataToLocalStorage(user.tokens, user.id, user.role);
     this.loginService.userId = user.id;
     if (user.id && user.confirmed) {
      this.router.navigate(['main/dashboard']);
      localStorage.setItem('userId', user.id);
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.LOGIN'), '', {
        duration: 2000,
        panelClass: ['success']
      });
     }
    },
    (error) => {
      const err = error.error;
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.' + err.errKey), '', {
        duration: 2000,
        panelClass: ['error']
      });
    });
    this.subscription.add(login);
  }
 ngOnDestroy() {
  this.subscription.unsubscribe();
 }
}
