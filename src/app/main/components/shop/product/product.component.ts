import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductInterface, ShopService} from '../shop.service';
import {Subscription} from 'rxjs';
import {BasketService} from '../basket/basket.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {TitleService} from '../../../../shared/title.service';
import {ProductModel} from '../product.model';

export interface ProductImages {
  image: string;
  thumbImage: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit, OnDestroy {
  public product: ProductInterface;
  public productImages: ProductImages[] = [];
  public subscriptions: Subscription = new Subscription();
  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    const ID = this.route.snapshot.paramMap.get('id');
    const getProductByIdSub = this.shopService.getProductById(ID).subscribe((product: ProductInterface) => {
      this.product = product;
      this.productImages = this.product.images.map((url: string, i) => {
        return {
          image: `api/${url}`,
          thumbImage: `api/${url}`,
          alt: this.removeTags(product.description),
          title: this.removeTags(product.title)
        };
      });
      this.titleService.setTitle(product.title);
    });
    this.subscriptions.add(getProductByIdSub);
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
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
