import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userEmail: string;
  userPass: string;
  userStatus: string;
  userName: string;
  registerMessage: string;

  constructor(
    private registerService: RegisterService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
  }
  registerUser(email: string, pass: string, userName: string) {
    this.registerService.registerUser(email, pass).subscribe((result) => {
      console.log('result of register in component', result);
      if (result.user) {
        this.snackBar.open('Success', '', {
          duration: 2000,
          panelClass: ['success']
        });
        this.registerService.addInfo(email, result.user.uid, userName, this.userStatus);
        this.userEmail = '';
        this.userPass = '';
        this.userStatus = null;
        this.userName = '';
      }
    },
    (error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      this.registerMessage = errorMessage;
      console.log(error);
    });
  }
  selectStatusUser(value: string) {
    this.userStatus = value;
    console.log(value);
  }
}
