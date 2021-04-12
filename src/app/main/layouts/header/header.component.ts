import { Component, OnInit, Output, EventEmitter, Input, OnChanges, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AppService } from 'src/app/app.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../main.service';
import { AdminRequestPermissionPopupComponent } from '../popups/admin-request-permission-popup/admin-request-permission-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toogleCollapsed = new EventEmitter();
  @Input() userInfo;
  public userRole = UserRolesEnum;
  private subscription: Subscription = new Subscription();


  constructor(
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private mainService: MainService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
  }
  public logout() {
    const refreshToken = this.appService.getTokens().refreshToken;
    const logout = this.authService.logout(refreshToken).subscribe((data) => {
      this.appService.clearStorage();
      this.appService.userInfoSubject.next(null);
      this.router.navigate(['/']);
    });
    this.subscription.add(logout);
  }
  public requestAdminPermission() {
    const dialogRef = this.dialog.open(AdminRequestPermissionPopupComponent, {
      width: '350px',
      data: this.userInfo
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
