import { Component, OnInit } from '@angular/core';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {ShopService} from '../shop.service';
import {MainService} from '../../../main.service';
import {ProductModel} from '../product.model';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  public userInfo: any;
  public userRoles = UserRolesEnum;
  public productList: ProductModel[] = [];
  constructor(
    private shopService: ShopService,
    private mainService: MainService,
  ) {
    this.userInfo = mainService.userInfo;
  }

  ngOnInit() {
    this.shopService.getAllProducts().subscribe((response: ProductModel[]) => {
      console.log(response);
      this.productList = response;
    });
  }

}
