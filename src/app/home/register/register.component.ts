import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string;
  pass: string;
  registerMessage: string;

  constructor(
    private registerService: RegisterService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
  }
  registerUser(email: string, pass: string) {
    this.registerService.registerUser(email, pass).subscribe((result) => {
      console.log('result of register in component', result);
      this.snackBar.open('Success', '', {
        duration: 2000,
        panelClass: ['success']
      });
      this.email = '';
      this.pass = '';
    },
    (error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      this.registerMessage = errorMessage;
      console.log(error);
    });
  }
}
