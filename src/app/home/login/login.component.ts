import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    private snackBar: MatSnackBar,
    private router: Router
    ) { }

  ngOnInit() {
  }
  loginUser(email: string, pass: string) {
    this.loginService.loginUser(email, pass).subscribe((result) => {
     if (result.userInfo._id) {
      console.log('result of login in component', result);
      this.router.navigate(['main/index']);
      localStorage.setItem('userId', result._id);
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
