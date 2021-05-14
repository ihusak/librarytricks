import {Component, OnDestroy, OnInit} from '@angular/core';
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
  public code: FormControl = new FormControl('', [Validators.required]);
  public token: string;
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  private subscription: Subscription = new Subscription();

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router
  ) { }
  public remind(email: string) {
    this.forgotPasswordService.remind(email).subscribe(res => {
      console.log(res);
      this.token = res.token;
      this.forgotPasswordService.remindToken = res.token;
    }, (error) => {
      const err = error.error;
      this.snackBar.open(this.translateService.instant('COMMON.' + err.errKey), '', {
        duration: 2000,
        panelClass: ['error']
      });
    });
  }
  public confirmResetPassword(code: number) {
    this.forgotPasswordService.confirmResetPassword(this.token, code).subscribe(res => {
      console.log(res);
      if(res.success) {
        this.router.navigate(['/recovery']);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
