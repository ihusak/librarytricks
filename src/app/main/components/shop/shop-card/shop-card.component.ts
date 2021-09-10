import { Component, OnInit } from '@angular/core';
import {ProductInterface, ShopService} from '../shop.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {
  public product: ProductInterface;
  constructor(
    private shopService: ShopService,
    private translateService: TranslateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const ID = this.route.snapshot.paramMap.get('id');
    this.shopService.getProductById(ID).subscribe((product: ProductInterface) => {
      this.product = product;
    });
  }

}
