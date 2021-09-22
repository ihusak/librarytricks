import { Component, OnInit } from '@angular/core';
import {ProductModel} from './product.model';
import {BasketService} from './basket/basket.service';
import {ShopService} from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  constructor(
    private basketService: BasketService,
    private shopService: ShopService
  ) { }

  ngOnInit() {
    this.shopService.getAllProducts().subscribe((products: ProductModel[]) => {
      this.shopService.allProducts.next(products);
      this.basketService.restoreBasket(products);
    });
  }
}
