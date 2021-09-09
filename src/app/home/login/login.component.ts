import { Component, OnInit, OnDestroy } from '@angular/core';
import {LoginErrorMessage, LoginService} from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {AppService, ServerErrorMessage} from 'src/app/app.service';
import { User } from 'src/app/shared/interface/user.interface';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TitleService } from 'src/app/shared/title.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public email = '';
  public pass = '';
  public forgotPass: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private loginService: LoginService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService,
    private titleService: TitleService
    ) { }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.LOGIN.ENTER_SYSTEM').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
  }
  loginUser(email: string, pass: string) {
    const EMAIL = email.toLowerCase();
    const login = this.loginService.loginUser(EMAIL, pass).subscribe((user: User) => {
     this.appService.setUserDataToLocalStorage(user.tokens, user.id, user.role);
     this.loginService.userId = user.id;
     if (user.id && user.confirmed) {
      this.router.navigate(['main/dashboard']);
      // localStorage.setItem('userId', user.id);
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.LOGIN'), '', {
        duration: 2000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
     }
    },
    (error) => {
      const err: ServerErrorMessage = error.error;
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.' + err.errKey), '', {
        duration: 2000,
        panelClass: ['error'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      if (err.code === 400 && err.errorMessage === LoginErrorMessage.WRONG_PASSWORD) {
        this.forgotPass = true;
      }
    });
    this.subscription.add(login);
  }
 ngOnDestroy() {
  this.subscription.unsubscribe();
 }
}
