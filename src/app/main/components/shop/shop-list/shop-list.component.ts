import { Component, OnInit } from '@angular/core';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {ShopService} from '../shop.service';
import {MainService} from '../../../main.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  public userInfo: any;
  public userRoles = UserRolesEnum;
  constructor(
    private shopService: ShopService,
    private mainService: MainService,
  ) {
    this.userInfo = mainService.userInfo;
  }

  ngOnInit() {
    this.shopService.getAllProducts().subscribe((response) => {
      console.log(response);
    });
  }

}
