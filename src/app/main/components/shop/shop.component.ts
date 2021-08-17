import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor(
    private shopService: ShopService
  ) { }

  ngOnInit() {
    this.shopService.getAllProducts().subscribe((response) => {
      console.log(response);
    })
  }

}
