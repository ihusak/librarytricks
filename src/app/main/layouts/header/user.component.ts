import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
    <a mat-button href="javascript:void(0)" [matMenuTriggerFor]="menu">
      <img class="r-full align-middle" src="assets/images/avatar.jpg" width="24" alt="" />
      <span class="m-l-8 align-middle">{{userName}}</span>
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
  public userName;
  @Output() userLogout = new EventEmitter();
  @Input() set userLogin(obj){
    if (obj) {
      this.userName = obj.userName;
    }
  };
}