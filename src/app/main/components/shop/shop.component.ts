import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductModel} from './product.model';
import {BasketService} from './basket/basket.service';
import {ShopService} from './shop.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  constructor(
    private basketService: BasketService,
    private shopService: ShopService
  ) { }

  ngOnInit() {
    const getAllProductsSub = this.shopService.getAllProducts().subscribe((products: ProductModel[]) => {
      this.shopService.allProducts.next(products);
      this.basketService.restoreBasket(products);
    });
    this.subscriptions.add(getAllProductsSub);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
