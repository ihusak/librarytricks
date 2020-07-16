import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
    <a *ngIf="userInfo" mat-button href="javascript:void(0)" [matMenuTriggerFor]="menu">
      <span class="m-l-8 align-middle">{{userInfo.userName}}</span>
    </a>

    <mat-menu #menu="matMenu">
      <a routerLink="profile" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>Профиль</span>
      </a>
      <a routerLink="profile/settings" mat-menu-item>
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
  public userInfo;
  public previewUrl: string;
  @Output() userLogout = new EventEmitter();
  @Input() set userLogin(obj){
    if (obj) {
      console.log('OBJ', obj);
      this.userInfo = obj;
    }
  };
}