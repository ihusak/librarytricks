import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = 'ilyagusak@gmail.com';
  pass = 'gusakilya1993';
  loginMessage: string;
  loggedIn: boolean = false;

  constructor(
    private loginService: LoginService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router
    ) { }

  ngOnInit() {
  }
  loginUser(email: string, pass: string) {
    this.loginService.loginUser(email, pass).subscribe((userInfo) => {
     this.appService.setUserData(userInfo.tokens, userInfo._id);
     if (userInfo._id) {
      console.log('result of login in component', userInfo);
      this.router.navigate(['main/index']);
      localStorage.setItem('userId', userInfo._id);
      this.snackBar.open('Success', '', {
        duration: 2000,
        panelClass: ['success']
      });
     }
    },
    (error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      this.loginMessage = errorMessage;
      console.log(error);
    });
  }

}
