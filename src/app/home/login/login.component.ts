import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/shared/interface/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email = 'ilyagusak@gmail.com';
  pass = 'gusakilya1993';
  loginMessage: string;
  private subscription: Subscription;

  constructor(
    private loginService: LoginService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router
    ) { }

  ngOnInit() {
  }
  loginUser(email: string, pass: string) {
    this.subscription = this.loginService.loginUser(email, pass).subscribe((user: User) => {
     this.appService.setUserDataToLocalStorage(user.tokens, user.id);
     this.loginService.userId = user.id;
     if (user.id && user.confirmed) {
      this.router.navigate(['main/index']);
      localStorage.setItem('userId', user.id);
      this.snackBar.open('Success', '', {
        duration: 2000,
        panelClass: ['success']
      });
     }
    },
    (error) => {
      this.loginMessage = error.error.message;
      console.log(error);
    });
  }
 ngOnDestroy() {
   if (this.subscription) {
     this.subscription.unsubscribe();
   }
 }
}
