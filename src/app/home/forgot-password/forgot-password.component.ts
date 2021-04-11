import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ForgotPasswordService, RecoveryPasswordInterface } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {

  public resetPassFrom: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, {validators: this.mathcPassword});
  private subscription: Subscription = new Subscription();

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router
  ) { }

  private mathcPassword(group: any) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true }   
  }
  public recoveryPassword() {
    const recoveryData: RecoveryPasswordInterface = {
      email: this.resetPassFrom.get('email').value,
      newPassword: this.resetPassFrom.get('password').value
    };
    const recoveryPassword = this.forgotPasswordService.recoveryPassword(recoveryData).subscribe(res => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.PASSWORD_RECOVERED', {email: this.resetPassFrom.get('email').value}), '', {
        duration: 10000,
        panelClass: ['success']
      });
      this.router.navigate(['/login']);
    }, (error) => {
      const err = error.error;
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.' + err.errKey, {email: this.resetPassFrom.get('email').value}), '', {
        duration: 10000,
        panelClass: ['error']
      });
    });
    this.subscription.add(recoveryPassword);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
