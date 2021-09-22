import { Component, OnInit } from '@angular/core';
import {ProductModel} from '../product.model';
import {BasketService} from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  public basket: ProductModel[] = [];
  constructor(
    private basketService: BasketService
  ) { }

  ngOnInit() {
    this.basketService.basketObj.subscribe((basket: ProductModel[]) => {
      this.basket = basket;
      this.basketService.basketData = basket;
    });
  }
  public sum(products: ProductModel[], type: string): number {
    return this.basketService.priceSum(products, type);
  }
  public removeItem(id: string) {
    this.basketService.removeProduct(id);
  }
}
