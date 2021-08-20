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



@NgModule({
  declarations: [ShopComponent, ShopListComponent, CreateProductComponent, UpdateProductComponent],
  imports: [
    CommonModule,
    ShopRoutingModule,
    PipesModule,
    TranslateModule,
    SharedModule
  ],
  providers: [ShopService]
})
export class ShopModule { }
