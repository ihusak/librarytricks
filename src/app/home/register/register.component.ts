import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RegisterService } from './register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRole } from '../interface/userRole.interface';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

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
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerMessage: string; // need remove
  userRoles: UserRole[];
  userRolesEnum = UserRolesEnum;
  registerUserFrom = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    concent: new FormControl('', [Validators.requiredTrue])
  });
  public env: any = environment;
  private subscription: Subscription = new Subscription();

  constructor(
    private registerService: RegisterService,
    private snackBar: MatSnackBar,
    private router: Router
    ) { }

  ngOnInit() {
    const registerRoles = this.registerService.getRoles().subscribe((roles: UserRole[]) => {
      const adminPermission = localStorage.getItem('admin');
      if (adminPermission) {
        this.userRoles = roles;
      } else {
        this.userRoles = roles.filter(role => role.id !== this.userRolesEnum.ADMIN);
      }
    });
    this.subscription.add(registerRoles);
  }
  registerUser() {
    const userForm: UserFormInterface = this.registerUserFrom.value;
    const registerUser = this.registerService.registerUser(userForm).subscribe((result) => {
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
      const errorMessage = err.errorMessage;
      this.snackBar.open(errorMessage, '', {
        duration: 10000,
        panelClass: ['error']
      });
    });
    this.subscription.add(registerUser);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
