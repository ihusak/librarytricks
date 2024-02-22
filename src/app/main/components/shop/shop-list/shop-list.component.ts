import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {ShopService} from '../shop.service';
import {MainService} from '../../../main.service';
import {ProductModel} from '../product.model';
import {BasketService} from '../basket/basket.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {TitleService} from '../../../../shared/title.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit, OnDestroy {
  public userInfo: any;
  public userRoles = UserRolesEnum;
  public productList: ProductModel[] = [];
  private subscriptions: Subscription = new Subscription();
  constructor(
    private shopService: ShopService,
    private mainService: MainService,
    private basketService: BasketService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private titleService: TitleService
  ) {
    this.userInfo = mainService.userInfo;
  }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.SHOP.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscriptions.add(translateServiceTitleSub);
    this.shopService.allProducts.subscribe((products: ProductModel[]) => {
      this.productList = products;
    });
  }

  public addToBasket(product: ProductModel) {
    this.basketService.addToBasket(product);
  }
  public deleteProduct(product: ProductModel) {
    const deleteProductSub = this.shopService.deleteProduct(product.id).subscribe(response => {
      console.log(response);
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.SHOP.PRODUCT_DELETED'), '', {
        duration: 4000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      this.productList = this.productList.filter((p: ProductModel) => p.id !== product.id);
    });
    this.subscriptions.add(deleteProductSub);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
