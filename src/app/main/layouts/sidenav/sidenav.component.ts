import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() userInfo;
  @Input() sideNav;
  @Output() toggleCollapsed = new EventEmitter();
  public userRoles = UserRolesEnum;
  public env: any = environment;
  
  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this);
  }

  public close() {
    this.sideNav.close();
  }

  public navigate(route: string) {
    console.log('!!!route', route);
    this.router.navigate(['/main/'+route]).then(() => {
      setTimeout(() => {
        this.close();
      })
    });
  }
}
