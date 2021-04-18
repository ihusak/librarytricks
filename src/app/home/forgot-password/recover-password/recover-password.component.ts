import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ForgotPasswordService, RecoveryPasswordInterface} from '../forgot-password.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {

  public resetPassFrom: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, {validators: this.matchPassword});
  private subscription: Subscription = new Subscription();
  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  private matchPassword(group: any) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true }
  }
  public recoveryPassword() {
    const password = this.resetPassFrom.get('password').value;
    const token = this.forgotPasswordService.remindToken;
    const recoveryPassword = this.forgotPasswordService.recoveryPassword(password, token).subscribe(res => {
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
