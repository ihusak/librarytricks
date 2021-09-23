import { Component, OnInit } from '@angular/core';
import {ProductModel} from '../product.model';
import {ShopService} from '../shop.service';
import {BasketService} from '../basket/basket.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  public productListToCheckout: ProductModel[] = [];
  constructor(
    private shopService: ShopService,
    private basketService: BasketService
  ) { }

  ngOnInit() {
    const selectedProducts = localStorage.getItem('addedProducts').split(',');
    this.shopService.allProducts.subscribe((products: ProductModel[]) => {
      this.productListToCheckout = products.filter((product: ProductModel) => selectedProducts.find(id => id === product.id));
      console.log(this);
    });
  }

}
