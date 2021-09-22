import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ProductModel} from '../product.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  public basketObj: Subject<ProductModel[]> = new Subject();
  public basketData: ProductModel[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  public priceSum(products: ProductModel[], type: string): number {
    return products.reduce((sum, current) => {
      return sum + current[type];
    }, 0);
  }
  public removeProduct(id: string) {
    const selectedProducts = localStorage.getItem('addedProducts').split(',');
    let result;
    this.basketData = this.basketData.filter((product: ProductModel) => product.id !== id);
    result = selectedProducts.filter(sid => sid !== id);
    this.basketObj.next(this.basketData);
    localStorage.setItem('addedProducts', result);
  }

  public addToBasket(product: ProductModel) {
    let productsId;
    if (this.basketData.find(productItem => productItem.id === product.id)) {
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
    this.basketData.push(product);
    this.basketObj.next(this.basketData);
    productsId = this.basketData.map((productItem: ProductModel) => productItem.id);
    localStorage.setItem('addedProducts', productsId);
  }
  public restoreBasket(list: ProductModel[]) {
    const selectedProducts = localStorage.getItem('addedProducts').split(',');
    if (!selectedProducts.length) {
      return;
    }
    const restoredProducts = list.filter((product: ProductModel) => selectedProducts.find(id => id === product.id));
    this.basketObj.next(restoredProducts);
  }
}
