import { Component, OnInit, Output, EventEmitter, Input, OnChanges, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AppService } from 'src/app/app.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../main.service';
import { AdminRequestPermissionPopupComponent } from '../popups/admin-request-permission-popup/admin-request-permission-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Output() toogleCollapsed = new EventEmitter();
  @Input() userInfo;
  public userRole = UserRolesEnum;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
  }
  public logout() {
    const refreshToken = this.appService.getTokens().refreshToken;
    this.authService.logout(refreshToken).subscribe((data) => {
      this.appService.clearStorage();
      console.log('logout', data);
      this.router.navigate(['/']);
    });
  }
  public requestAdminPermission() {
    const dialogRef = this.dialog.open(AdminRequestPermissionPopupComponent, {
      width: '350px',
      data: this.userInfo
    });

  }
  ngOnChanges() {}
}
