import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ProductInterface, ShopService} from '../shop.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';

interface ProductImages {
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
  constructor(
    private shopService: ShopService,
    private translateService: TranslateService,
    private route: ActivatedRoute
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
        }
      })
    });
  }
  private removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
}
}
