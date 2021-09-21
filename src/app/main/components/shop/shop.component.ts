import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { ProductModel } from './product.model';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  public basket: ProductModel[] = [];
  constructor(
    private shopService: ShopService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.shopService.busketObj.subscribe((basket: ProductModel[]) => {
      this.basket = basket;
      this.shopService.basketData = basket;
    })
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
    this.shopService.busketObj.next(this.basket);
    localStorage.setItem('addedProducts', result);
  }
}
