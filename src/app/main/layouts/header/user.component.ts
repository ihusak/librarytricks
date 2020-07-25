import { Component, Output, EventEmitter, Input } from '@angular/core';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';

@Component({
  selector: 'app-user',
  template: `
    <a *ngIf="userInfoData" mat-button href="javascript:void(0)" [matMenuTriggerFor]="menu">
      <span class="m-l-8 align-middle">{{userInfoData.userName}}</span>
    </a>

    <mat-menu #menu="matMenu">
      <a routerLink="profile" mat-menu-item *ngIf="!(userInfoData | userRolePipe:[userRoles.ADMIN])">
        <mat-icon>account_circle</mat-icon>
        <span>Профиль</span>
      </a>
      <a routerLink="profile/settings" mat-menu-item *ngIf="!(userInfoData | userRolePipe:[userRoles.ADMIN])">
        <mat-icon>settings</mat-icon>
        <span>Настройки</span>
      </a>
      <a (click)="userLogout.emit()" mat-menu-item>
        <mat-icon>exit_to_app</mat-icon>
        <span>Выход</span>
      </a>
    </mat-menu>
  `,
})
export class UserComponent {
  public userInfoData;
  public previewUrl: string;
  public userRoles = UserRolesEnum;
  @Output() userLogout = new EventEmitter();
  @Input() set userInfo(obj){
    if (obj) {
      console.log('OBJ', obj);
      this.userInfoData = obj;
    }
  };
}