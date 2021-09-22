import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ProductInterface, ShopService} from '../shop.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {ProductModel} from '../product.model';
import {BasketService} from '../basket/basket.service';
import {TitleService} from '../../../../shared/title.service';
import {Subscription} from 'rxjs';

export interface ProductImages {
  image: string;
  thumbImage: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopCardComponent implements OnInit {
  public product: ProductInterface;
  public productImages: ProductImages[] = [];
  public subscription: Subscription = new Subscription();
  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    const ID = this.route.snapshot.paramMap.get('id');
    this.shopService.getProductById(ID).subscribe((product: ProductInterface) => {
      this.product = product;
      this.productImages = this.product.images.map((url: string, i) => {
        return {
          image: `api/${url}`,
          thumbImage: `api/${url}`,
          alt: this.removeTags(product.description),
          title: this.removeTags(product.title)
        };
      });
      const translateServiceTitleSub = this.translateService.get('TEMPLATE.SHOP.PRODUCT.PRODUCT_TITLE', {title: product.title}).subscribe((value: string) => {
        this.titleService.setTitle(value);
      });
      this.subscription.add(translateServiceTitleSub);
    });
  }
  public addToBasket(product: ProductModel) {
    this.basketService.addToBasket(product);
  }
  private removeTags(str) {
    if ((str === null) || (str === '')) {
      return false;
    } else {
      str = str.toString();
      return str.replace( /(<([^>]+)>)/ig, '');
    }
  }
}
