import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRole } from '../interface/userRole.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userEmail: string;
  userPass: string;
  userStatus: UserRole;
  userName: string;
  registerMessage: string;
  userRoles: UserRole[];

  constructor(
    private registerService: RegisterService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.registerService.getRoles().subscribe((roles: UserRole[]) => {
      this.userRoles = roles.filter(role => role.status);
    });
  }
  registerUser(email: string, pass: string, userName: string) {
    console.log(email, pass, userName, this.userStatus);
    this.registerService.registerUser(email, pass, userName, this.userStatus).subscribe((result) => {
      console.log('result of register in component', result);
      if (result._id) {
        this.snackBar.open('Success', '', {
          duration: 2000,
          panelClass: ['success']
        });
        this.userEmail = '';
        this.userPass = '';
        this.userStatus = null;
        this.userName = '';
      }
    },
    (error) => {
      // Handle Errors here.
      const err = error.error;
      console.log(error);
      const errorCode = err.status;
      const errorMessage = err.message;
      this.registerMessage = errorMessage;
    });
  }
  selectUserType(value: UserRole) {
    console.log(value);
    this.userStatus = value;
  }
}
