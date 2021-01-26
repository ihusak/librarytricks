import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRole } from '../interface/userRole.interface';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface UserFormInterface {
  name: string;
  email: string;
  password: string;
  type: {
    id: number,
    name: string,
    status: boolean
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerMessage: string; // need remove
  userRoles: UserRole[];
  userRolesEnum = UserRolesEnum;
  registerUserFrom = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required])
  });

  constructor(
    private registerService: RegisterService,
    private snackBar: MatSnackBar,
    private router: Router
    ) { }

  ngOnInit() {
    this.registerService.getRoles().subscribe((roles: UserRole[]) => {
      const adminPermission = localStorage.getItem('admin');
      if (adminPermission) {
        this.userRoles = roles;
      } else {
        this.userRoles = roles.filter(role => role.id !== this.userRolesEnum.ADMIN);
      }
    });
  }
  registerUser() {
    const userForm: UserFormInterface = this.registerUserFrom.value;
    this.registerService.registerUser(userForm).subscribe((result) => {
      if (result._id) {
        this.snackBar.open(`Письмо для подтверждения о регистрации отправленно на ${userForm.email}`, '', {
          duration: 10000,
          panelClass: ['success']
        });
        this.registerUserFrom.reset();
        this.router.navigate(['/login']);
      }
    },
    (error) => {
      const err = error.error;
      const errorCode = err.status;
      const errorMessage = err.message;
      this.registerMessage = errorMessage;
    });
  }
}
