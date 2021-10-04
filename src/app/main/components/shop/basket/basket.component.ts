import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductModel} from '../product.model';
import {BasketService} from './basket.service';
import {Subscription} from 'rxjs';
import {
  RouteConfigLoadEnd,
  Router
} from '@angular/router';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit, OnDestroy {
  public basket: ProductModel[] = [];
  public hideBasket: boolean = false;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private basketService: BasketService
  ) { }

  ngOnInit() {
    const basketObjSub = this.basketService.basketObj.subscribe((basket: ProductModel[]) => {
      this.basket = basket;
      this.basketService.basketData = basket;
    });
    this.subscriptions.add(basketObjSub);
  }
  public sum(products: ProductModel[], type: string): number {
    return this.basketService.priceSum(products, type);
  }
  public removeItem(id: string, event: Event) {
    event.stopPropagation();
    const FILTERED_BASKET = this.basket.filter(p => p.id !== id);
    this.basketService.basketObj.next(FILTERED_BASKET);
    this.basketService.removeProduct(id);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
