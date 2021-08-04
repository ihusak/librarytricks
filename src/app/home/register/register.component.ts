import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RegisterService } from './register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRole } from '../interface/userRole.interface';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface UserFormInterface {
  name: string;
  email: string;
  password: string;
  type: {
    id: number,
    name: string,
    status: boolean
  };
  invited?: string;
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
    confirmPassword: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    consent: new FormControl('', [Validators.requiredTrue])
  }, {validators: this.matchPassword});
  public env: any = environment;
  private subscription: Subscription = new Subscription();
  public registerToken: string;
  public invitedRoleId: number;

  constructor(
    private registerService: RegisterService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.registerToken = this.route.snapshot.queryParamMap.get('token');
    this.invitedRoleId = parseInt(this.route.snapshot.queryParamMap.get('roleId'));
  }

  ngOnInit() {
    const registerRoles = this.registerService.getRoles().subscribe((roles: UserRole[]) => {
      const adminPermission = localStorage.getItem('admin');
      if (adminPermission) {
        this.userRoles = roles;
      } else {
        this.userRoles = roles.filter(role => role.id !== this.userRolesEnum.ADMIN);
      }
      if (this.invitedRoleId) {
        this.registerUserFrom.controls.type.disable();
        this.registerUserFrom.controls.type.setValue(this.userRoles.filter(role => role.id === this.invitedRoleId)[0]);
      }
      console.log(this);
    });
    this.subscription.add(registerRoles);

  }
  registerUser() {
    const userForm: UserFormInterface = this.registerUserFrom.getRawValue();
    const registerUser = this.registerService.registerUser(userForm, this.registerToken).subscribe((result) => {
      if (result._id) {
        this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.REGISTER', {email: userForm.email}), '', {
          duration: 10000,
          panelClass: ['success']
        });
        this.registerUserFrom.reset();
        this.router.navigate(['/login']);
      }
    },
    (error) => {
      const err = error.error;
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.' + err.errKey), '', {
        duration: 10000,
        panelClass: ['error']
      });
    });
    this.subscription.add(registerUser);
  }
  private matchPassword(group: any) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true };
  }
  public changeRole(role: UserRole) {
    if ((role.id === this.userRolesEnum.PARENT || role.id === this.userRolesEnum.STUDENT) && !this.registerToken) {
      this.registerUserFrom.addControl('invited', new FormControl('', [Validators.required, Validators.email]));
    } else {
      this.registerUserFrom.removeControl('invited');
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
