import {NgModule} from '@angular/core';
import { ShopListComponent } from './shop-list/shop-list.component';
import {ShopRoutingModule} from './shop-routing.module';
import {CreateProductComponent} from './product/create-product/create-product.component';
import {UpdateProductComponent} from './product/update-product/update-product.component';
import {TranslateModule} from '@ngx-translate/core';
import {ShopService} from './shop.service';
import {ShopComponent} from './shop.component';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';
import { NgImageSliderModule } from 'ng-image-slider';
import { BasketComponent } from './basket/basket.component';
import {BasketService} from './basket/basket.service';
import {ProductComponent} from './product/product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import {SharedModule} from '../../../shared/shared.module';



@NgModule({
  declarations: [
    ShopComponent,
    ShopListComponent,
    CreateProductComponent,
    UpdateProductComponent,
    ProductComponent,
    BasketComponent,
    CheckoutComponent,
    OrdersComponent
  ],
  imports: [
    SharedModule,
    ShopRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    QuillModule.forRoot(),
    NgImageSliderModule
  ],
  providers: [ShopService, BasketService]
})
export class ShopModule { }
