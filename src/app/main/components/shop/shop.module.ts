import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopListComponent } from './shop-list/shop-list.component';
import {ShopRoutingModule} from './shop-routing.module';
import {CreateProductComponent} from './product/create-product/create-product.component';
import {UpdateProductComponent} from './product/update-product/update-product.component';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../../shared/shared.module';
import {ShopService} from './shop.service';
import {ShopComponent} from './shop.component';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';
import { NgImageSliderModule } from 'ng-image-slider';
import { BasketComponent } from './basket/basket.component';
import {BasketService} from './basket/basket.service';
import {ProductComponent} from './product/product.component';
import { CheckoutComponent } from './checkout/checkout.component';



@NgModule({
  declarations: [ShopComponent, ShopListComponent, CreateProductComponent, UpdateProductComponent, ProductComponent, BasketComponent, CheckoutComponent],
  imports: [
    CommonModule,
    ShopRoutingModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule,
    SharedModule,
    QuillModule.forRoot(),
    NgImageSliderModule
  ],
  providers: [ShopService, BasketService],
  entryComponents: [
    CreateProductComponent
  ]
})
export class ShopModule { }
