import { Component, OnInit } from '@angular/core';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {ShopService} from '../shop.service';
import {MainService} from '../../../main.service';
import {ProductModel} from '../product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  public userInfo: any;
  public userRoles = UserRolesEnum;
  public productList: ProductModel[] = [];
  public basket: ProductModel[] = [];
  constructor(
    private shopService: ShopService,
    private mainService: MainService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    this.userInfo = mainService.userInfo;
  }

  ngOnInit() {
    this.shopService.getAllProducts().subscribe((response: ProductModel[]) => {
      console.log(response);
      this.productList = response;
      this.restoreBasket();
    });
  }

  public addToBasket(product: ProductModel) {
    let productsId;
    if(this.basket.indexOf(product) >= 0) {
      this.snackBar.open(this.translateService.instant('TEMPLATE.SHOP.PRODUCT_ALREADY_ADDED'), '', {
        duration: 2000,
        panelClass: ['warn'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }
    this.snackBar.open(this.translateService.instant('TEMPLATE.SHOP.PRODUCT_ADDED'), '', {
      duration: 2000,
      panelClass: ['success'],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
    this.basket.push(product);
    productsId = this.basket.map((product: ProductModel) => product.id);
    localStorage.setItem('addedProducts', productsId);
  }
  private restoreBasket() {
    const selectedProducts = localStorage.getItem('addedProducts').split(',');
    if(!selectedProducts.length) {
      return;
    }
    this.basket = this.productList.filter((product: ProductModel) => selectedProducts.find(id => id === product.id));
  }
  public priceSum(products: ProductModel[], type: string): number {
    return products.reduce((sum, current) => {
      return sum + current[type];
    }, 0)
  }
  public removeProduct(id: string) {
    const selectedProducts = localStorage.getItem('addedProducts').split(',');
    let result;
    this.basket = this.basket.filter((product: ProductModel) => product.id !== id);
    result = selectedProducts.filter(sid => sid !== id);
    localStorage.setItem('addedProducts', result);
  }
}
