import { Component, OnInit } from '@angular/core';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss']
})
export class HowToUseComponent implements OnInit {
  public userRoles = UserRolesEnum;
  public userInfo: any;

  constructor(private mainService: MainService,) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
  }

}
