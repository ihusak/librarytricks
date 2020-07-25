import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() showToggle = true;
  @Input() userInfo;
  @Output() toggleCollapsed = new EventEmitter();
  public userImage: string;
  public userRoles = UserRolesEnum;
  
  constructor() { }

  ngOnInit() {
    this.userImage = this.userInfo.userImg ? `api/${this.userInfo.userImg}` : 'assets/user-default.png';
  }

}
