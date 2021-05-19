import {Component, OnDestroy} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ForgotPasswordService } from './forgot-password.service';

const REQUEST_INTERVAL = 15000;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {
  public code: FormControl = new FormControl('', [Validators.required]);
  public token: string;
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public disabledRequest: boolean = false;
  public countDown: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router
  ) { }
  public remind(email: string) {
    this.disabledRequest = true;
    this.countDown = REQUEST_INTERVAL;
    this.forgotPasswordService.remind(email).subscribe(res => {
      this.token = res.token;
      this.forgotPasswordService.remindToken = res.token;
      this._countDown();
    }, (error) => {
      const err = error.error;
      this.snackBar.open(this.translateService.instant('COMMON.' + err.errKey), '', {
        duration: 2000,
        panelClass: ['error']
      });
    });
  }
  public resendCode() {
    this.disabledRequest = true;
    this.countDown = REQUEST_INTERVAL;
    if (this.token) {
      this._countDown();
      this.forgotPasswordService.resendCode(this.token).subscribe(res => {
        this.token = res.token;
        this.forgotPasswordService.remindToken = res.token;
        this.snackBar.open(this.translateService.instant('TEMPLATE.FORGOT_PASSWORD.CODE_SUCCESSFULLY_RESEND'), '', {
          duration: 2000,
          panelClass: ['success']
        });
      });
    }
  }
  public confirmResetPassword(code: number) {
    this.forgotPasswordService.confirmResetPassword(this.token, code).subscribe(res => {
      if (res.success) {
        this.router.navigate(['/recovery']);
      }
    }, (error) => {
      const err = error.error;
      if (err.code === 400) {
        this.snackBar.open(this.translateService.instant('TEMPLATE.FORGOT_PASSWORD.' + err.errKey), '', {
          duration: 2000,
          panelClass: ['error']
        });
      }
    });
  }
  private _countDown() {
    setTimeout(() => {
      this.disabledRequest = false;
      clearInterval(setCountDown);
    }, REQUEST_INTERVAL);
    const setCountDown = setInterval(() => {
      if (this.countDown >= 0) {
        this.countDown = this.countDown - 1000;
      }
    }, 1000);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
